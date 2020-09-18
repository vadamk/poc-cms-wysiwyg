import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams, useLocation } from 'react-router-dom';
import update from 'immutability-helper';
import { Button, Typography, Modal, message, Spin } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { GuideStep, GuideStepSummary } from 'core/models/generated';
import { SummaryFragment } from 'core/graphql/fragments';
import { GET_GUIDE } from 'components/UpdateGuide';
import TreeViewNode from 'components/TreeViewNode';
import DndCard from 'components/DndCard';
import ConfirmInput from 'components/ConfirmInput';

import sty from './TreeView.module.scss';
import { basicReorder } from 'core/utils';

const normalizeTree = (steps: GuideStep[]) =>
  (steps || [])
    .sort((a, b) => a.orderNum - b.orderNum)
    .map(step => ({
      ...step,
      summaries: (step.summaries as GuideStepSummary[]).sort(
        (a, b) => a.orderNum - b.orderNum,
      ),
    }));

export const CREATE_SUMMARY = gql`
  mutation CreateGuideStepSummary($input: CreateGuideStepSummaryInput!) {
    createGuideStepSummary(input: $input) {
      ...SummaryFragment
    }
  }
  ${SummaryFragment}
`;

export const DELETE_SUMMARY = gql`
  mutation DeleteGuideStepSummary($summaryId: Int!) {
    deleteGuideStepSummary(summaryId: $summaryId)
  }
`;

export const CREATE_STEP = gql`
  mutation CreateGuideStep($input: CreateGuideStepInput!) {
    createGuideStep(input: $input) {
      id
      guideId
      title
      description
      orderNum
    }
  }
`;

export const DELETE_STEP = gql`
  mutation DeleteGuideStep($stepId: Int!) {
    deleteGuideStep(stepId: $stepId)
  }
`;

export const SET_SUMMRY_ORDER = gql`
  mutation SortGuideSummaries($order: [GuideStepSummaryOrderInput!]!) {
    sortGuideStepSummaries(order: $order)
  }
`;

export const SET_STEP_ORDER = gql`
  mutation SortGuideSteps($order: [GuideStepOrderInput!]!) {
    sortGuideSteps(order: $order)
  }
`;

export interface TreeViewProps {
  value?: GuideStepSummary | GuideStep;
  onChange: (summary?: GuideStepSummary | GuideStep) => void;
  isFieldsTouched?: boolean;
}

const TreeView: React.FC<TreeViewProps> = ({
  value,
  onChange = () => null,
  isFieldsTouched,
}) => {
  const { slug } = useParams<any>();

  const [steps, setGuideSteps] = React.useState<GuideStep[]>([]);
  const [current, setCurent] = React.useState<GuideStep | GuideStepSummary>();

  React.useEffect(() => setCurent(value), [value]);

  // const [currentGuideStepSummary, setCurentGuideStepSummary] = React.useState<GuideStepSummary | null>(null);
  const [stepForCreating, setGuideStepForCreating] = React.useState<GuideStep | null>(
    null,
  );
  const [isCreatingGuideStep, setCreatingGuideStep] = React.useState(false);

  const guideId = React.useMemo(() => Number(slug), [slug]);

  const { data } = useQuery(GET_GUIDE, {
    variables: { guideId: Number(slug) },
    onCompleted: ({ getGuide: { steps } }) => {
      if (steps[0].summaries.length) {
        chooseCurrent(steps[0].summaries[0]);
      }
    },
  });

  const [createGuideStep, createGuideStepStatus] = useMutation(CREATE_STEP, {
    refetchQueries: [{ query: GET_GUIDE, variables: { guideId } }],
    onCompleted: ({ createGuideStep: step }) => {
      setCreatingGuideStep(false);

      // optimistic strategy
      const nextGuideSteps = update(steps, { $push: [{ ...step, summaries: [] }] });
      console.log('nextGuideSteps: ', nextGuideSteps);
      setGuideSteps(nextGuideSteps);
    },
  });

  const [deleteGuideStep, deleteGuideStepStatus] = useMutation(DELETE_STEP, {
    refetchQueries: [{ query: GET_GUIDE, variables: { guideId } }],
    onCompleted: () => {
      message.success('GuideStep has been deleted.');
    },
  });

  const [setGuideStepsOrder, setGuideStepsOrderStatus] = useMutation(SET_STEP_ORDER, {
    refetchQueries: [{ query: GET_GUIDE, variables: { guideId } }],
  });

  const [setGuideStepSummaryOrder, setGuideStepSummaryOrderStatus] = useMutation(
    SET_SUMMRY_ORDER,
    {
      refetchQueries: [{ query: GET_GUIDE, variables: { guideId } }],
    },
  );

  const [createGuideStepSummary, createGuideStepSummaryStatus] = useMutation(
    CREATE_SUMMARY,
    {
      refetchQueries: [{ query: GET_GUIDE, variables: { guideId } }],
      onCompleted: ({ createGuideStepSummary }) => {
        setGuideStepForCreating(null);

        // optimistic strategy
        const summary: GuideStepSummary = createGuideStepSummary;
        const stepIndex = steps.findIndex(st => st.id === summary.stepId);

        if (stepIndex !== -1) {
          const nextGuideSteps = update(steps, {
            [stepIndex]: step =>
              update(step, {
                summaries: summaries =>
                  update(summaries, {
                    $push: [summary],
                  }),
              }),
          });

          setGuideSteps(nextGuideSteps);
        }
      },
    },
  );

  const [deleteGuideStepSummary, deleteGuideStepSummaryStatus] = useMutation(
    DELETE_SUMMARY,
    {
      refetchQueries: [{ query: GET_GUIDE, variables: { guideId } }],
      onCompleted: () => {
        message.success('GuideStepSummary has been deleted.');
      },
    },
  );

  const chooseCurrent = React.useCallback(
    (node?: GuideStep | GuideStepSummary) => {
      onChange(node);
    },
    [onChange],
  );

  const startCreatingGuideStep = React.useCallback(() => {
    setCreatingGuideStep(true);
  }, []);

  const cancelCreatingGuideStep = React.useCallback(() => {
    setCreatingGuideStep(false);
  }, []);

  React.useEffect(() => {
    setGuideSteps(normalizeTree(data?.getGuide.steps));
  }, [data]);

  const handleCreateGuideStep = React.useCallback(
    value => {
      createGuideStep({
        variables: {
          input: {
            guideId,
            orderNum: steps.length + 1,
            title: value,
            description: `${value} description`,
            image: `${document.location.origin}/fallback-step.jpg`
          },
        },
      });
    },
    [createGuideStep, guideId, steps.length],
  );

  const startCreatingGuideStepSummary = React.useCallback((step: GuideStep) => {
    setGuideStepForCreating(step);
  }, []);

  const cancelCreatingGuideStepSummary = React.useCallback(() => {
    setGuideStepForCreating(null);
  }, []);

  const handleCreateGuideStepSummary = React.useCallback(
    (value: string) => {
      if (stepForCreating) {
        const input = {
          stepId: stepForCreating?.id,
          title: value,
          content: `<p>${value} Content...</p>`,
          orderNum: stepForCreating?.summaries.length + 1,
        };

        createGuideStepSummary({ variables: { input } });
      }
    },
    [createGuideStepSummary, stepForCreating],
  );

  const startDeletingGuideStep = React.useCallback(
    (step: GuideStep, index: number) => {
      Modal.confirm({
        title: (
          <>
            Are you sure you want to delete{' '}
            <Typography.Text mark>
              {step.title || `GuideStep ${index + 1}`}
            </Typography.Text>
            ?
          </>
        ),
        icon: <ExclamationCircleOutlined />,
        width: 640,
        okText: 'Delete',
        okButtonProps: { loading: deleteGuideStepStatus.loading },
        onOk: () => deleteGuideStep({ variables: { stepId: step.id } }),
      });
    },
    [deleteGuideStep, deleteGuideStepStatus.loading],
  );

  const startDeletingGuideStepSummary = React.useCallback(
    (summary: GuideStepSummary) => {
      Modal.confirm({
        title: (
          <>
            Are you sure you want to delete{' '}
            <Typography.Text mark>{summary.title}</Typography.Text>?
          </>
        ),
        icon: <ExclamationCircleOutlined />,
        width: 640,
        okText: 'Delete',
        okButtonProps: { loading: deleteGuideStepSummaryStatus.loading },
        onOk: () => {
          deleteGuideStepSummary({ variables: { summaryId: summary.id } });

          if (summary.id === current?.id) {
            chooseCurrent(); // deselect summary that going to be deleted
          }
        },
      });
    },
    [
      chooseCurrent,
      current,
      deleteGuideStepSummary,
      deleteGuideStepSummaryStatus.loading,
    ],
  );

  const moveGuideStepSummary = React.useCallback(
    (stepIndex: number, dragIndex: number, hoverIndex: number) => {
      const dragCard = steps[stepIndex].summaries[dragIndex];
      const nextGuideSteps = update(steps, {
        [stepIndex]: step =>
          update(step, {
            summaries: summaries =>
              update(summaries, {
                $splice: [
                  [dragIndex, 1],
                  [hoverIndex, 0, dragCard],
                ],
              }),
          }),
      });

      setGuideSteps(nextGuideSteps);
    },
    [steps],
  );

  const dropGuideStepSummary = React.useCallback(
    (stepIndex: number, dragIndex: number, hoverIndex: number) => {
      const dragCard = steps[stepIndex].summaries[dragIndex];
      const nextGuideSteps = update(steps, {
        [stepIndex]: step =>
          update(step, {
            summaries: summaries =>
              update(summaries, {
                $splice: [
                  [dragIndex, 1],
                  [hoverIndex, 0, dragCard],
                ],
              }),
          }),
      });

      setGuideSteps(nextGuideSteps);

      const order = (steps[stepIndex].summaries as GuideStepSummary[]).map(
        (sum, index) => ({
          id: sum.id,
          orderNum: index + 1,
        }),
      );

      setGuideStepSummaryOrder({ variables: { order } });
    },
    [setGuideStepSummaryOrder, steps],
  );

  const moveGuideStep = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const nextGuideSteps = basicReorder(steps, dragIndex, hoverIndex);
      setGuideSteps(nextGuideSteps);
    },
    [steps],
  );

  const dropGuideStep = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const nextGuideSteps = basicReorder(steps, dragIndex, hoverIndex);

      setGuideSteps(nextGuideSteps);

      const order = nextGuideSteps.map((step, index) => ({
        id: step.id,
        orderNum: index + 1,
      }));

      setGuideStepsOrder({ variables: { order } });
    },
    [setGuideStepsOrder, steps],
  );

  return (
    <div className={sty.wrapper}>
      <Spin
        spinning={
          setGuideStepsOrderStatus.loading || setGuideStepSummaryOrderStatus.loading
        }
      >
        {steps?.map((step, stIndex) => (
          <DndCard
            key={step.id}
            id={step.id}
            index={stIndex}
            type={String(guideId)}
            moveCard={moveGuideStep}
            onDrop={dropGuideStep}
          >
            <TreeViewNode
              title={step.title || `GuideStep ${stIndex + 1}`}
              defaultExpanded={stIndex === 0}
              isActive={step.id === current?.id}
              onClick={() => chooseCurrent(step)}
              actions={[
                steps?.length > 1 && (
                  <Button
                    shape="circle"
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => startDeletingGuideStep(step, stIndex)}
                  />
                ),
              ]}
            >
              {(step.summaries as GuideStepSummary[])?.map((sum, sumIndex) => (
                <DndCard
                  key={sum.id}
                  id={sum.id}
                  index={sumIndex}
                  type={String(sum.stepId)}
                  moveCard={(...atrs) => moveGuideStepSummary(stIndex, ...atrs)}
                  onDrop={(...atrs) => dropGuideStepSummary(stIndex, ...atrs)}
                >
                  <TreeViewNode
                    title={sum?.title}
                    isActive={sum.id === current?.id}
                    onClick={() => chooseCurrent(sum)}
                    actions={[
                      <Button
                        shape="circle"
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => startDeletingGuideStepSummary(sum)}
                      />,
                    ]}
                  />
                </DndCard>
              ))}
              <div className={sty.createSection}>
                {stepForCreating?.id === step.id ? (
                  <ConfirmInput
                    isLoading={createGuideStepSummaryStatus.loading}
                    onOk={handleCreateGuideStepSummary}
                    onCancel={cancelCreatingGuideStepSummary}
                  />
                ) : (
                  <Button
                    key={`${step.id}_createButton`}
                    type="dashed"
                    icon={<PlusOutlined />}
                    style={{ width: '100%' }}
                    onClick={() => startCreatingGuideStepSummary(step)}
                  >
                    Add Summary
                  </Button>
                )}
              </div>
            </TreeViewNode>
          </DndCard>
        ))}
        {steps?.length && (
          <div className={sty.createSection}>
            {isCreatingGuideStep ? (
              <ConfirmInput
                isLoading={createGuideStepStatus.loading}
                onOk={handleCreateGuideStep}
                onCancel={cancelCreatingGuideStep}
              />
            ) : (
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                style={{ width: '100%' }}
                onClick={() => startCreatingGuideStep()}
              >
                Add Step
              </Button>
            )}
          </div>
        )}
      </Spin>
    </div>
  );
};

export default TreeView;
