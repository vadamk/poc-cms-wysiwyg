import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import update from 'immutability-helper';
import { Button, Typography, Modal, message, Spin } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { QueryGetDiscoveryArgs, Step, Summary } from 'core/models/generated';
import { SummaryFragment } from 'core/graphql/fragments';
import { GET_GUIDE } from 'components/UpdateGuide';
import TreeViewNode from 'components/UpdateGuide/TreeViewNode';
import DndCard from 'components/UpdateGuide/DndCard';
import ConfirmInput from 'components/ConfirmInput';

import sty from './TreeView.module.scss';

const normalizeTree = (steps: Step[]) =>
  (steps || [])
    .sort((a, b) => a.orderNum - b.orderNum)
    .map(step => ({
      ...step,
      summaries: (step.summaries as Summary[]).sort((a, b) => a.orderNum - b.orderNum),
    }));

export const CREATE_SUMMARY = gql`
  mutation CreateSummary($summary: CreateDiscoverySummaryInput!) {
    createSummary(summary: $summary) {
      ...SummaryFragment
    }
  }
  ${SummaryFragment}
`;

export const DELETE_SUMMARY = gql`
  mutation DeleteSummary($summaryId: Int!) {
    deleteSummary(summaryId: $summaryId)
  }
`;

export const CREATE_STEP = gql`
  mutation CreateStep($input: CreateDiscoveryStepInput!) {
    createStep(input: $input) {
      id
      discoveryId
      title
      description
      orderNum
    }
  }
`;

export const DELETE_STEP = gql`
  mutation DeleteStep($stepId: Int!) {
    deleteStep(stepId: $stepId)
  }
`;

export const SET_SUMMRY_ORDER = gql`
  mutation SortDiscoverySummaries($order: [DiscoverySummaryOrderInput!]!) {
    sortDiscoverySummaries(order: $order)
  }
`;

export const SET_STEP_ORDER = gql`
  mutation SortDiscoverySteps($order: [DiscoveryStepOrderInput!]!) {
    sortDiscoverySteps(order: $order)
  }
`;

export interface TreeViewProps {
  onChange: (summary?: Summary | Step) => void;
}

const TreeView: React.FC<TreeViewProps> = ({ onChange = () => null }) => {
  const { slug } = useParams();

  const [steps, setSteps] = React.useState<Step[]>([]);
  const [current, setCurent] = React.useState<Step | Summary | null>(null);
  // const [currentSummary, setCurentSummary] = React.useState<Summary | null>(null);
  const [stepForCreating, setStepForCreating] = React.useState<Step | null>(null);
  const [isCreatingStep, setCreatingStep] = React.useState(false);

  const discoveryId = React.useMemo(() => Number(slug), [slug]);

  const { data } = useQuery<any, QueryGetDiscoveryArgs>(GET_GUIDE, {
    variables: { discoveryId: Number(slug) },
    onCompleted: ({ getDiscovery: { steps } }) => {
      if (steps[0].summaries.length) {
        chooseCurrent(steps[0].summaries[0]);
      }
    },
  });

  const [createStep, createStepStatus] = useMutation(CREATE_STEP, {
    refetchQueries: [{ query: GET_GUIDE, variables: { discoveryId } }],
    onCompleted: ({ createStep: step }) => {
      setCreatingStep(false);

      // optimistic strategy
      const nextSteps = update(steps, { $push: [{ ...step, summaries: [] }] });
      console.log('nextSteps: ', nextSteps);
      setSteps(nextSteps);
    },
  });

  const [deleteStep, deleteStepStatus] = useMutation(DELETE_STEP, {
    refetchQueries: [{ query: GET_GUIDE, variables: { discoveryId } }],
    onCompleted: () => {
      message.success('Step has been deleted.');
    },
  });

  const [setStepsOrder, setStepsOrderStatus] = useMutation(SET_STEP_ORDER, {
    refetchQueries: [{ query: GET_GUIDE, variables: { discoveryId } }],
  });

  const [setSummaryOrder, setSummaryOrderStatus] = useMutation(SET_SUMMRY_ORDER, {
    refetchQueries: [{ query: GET_GUIDE, variables: { discoveryId } }],
  });

  const [createSummary, createSummaryStatus] = useMutation(CREATE_SUMMARY, {
    refetchQueries: [{ query: GET_GUIDE, variables: { discoveryId } }],
    onCompleted: ({ createSummary }) => {
      setStepForCreating(null);

      // optimistic strategy
      const summary: Summary = createSummary;
      const stepIndex = steps.findIndex(st => st.id === summary.stepId);

      if (stepIndex !== -1) {
        const nextSteps = update(steps, {
          [stepIndex]: step =>
            update(step, {
              summaries: summaries =>
                update(summaries, {
                  $push: [summary],
                }),
            }),
        });

        setSteps(nextSteps);
      }
    },
  });

  const [deleteSummary, deleteSummaryStatus] = useMutation(DELETE_SUMMARY, {
    refetchQueries: [{ query: GET_GUIDE, variables: { discoveryId } }],
    onCompleted: () => {
      message.success('Summary has been deleted.');
    },
  });

  const chooseCurrent = React.useCallback(
    (node?: Step | Summary) => {
      setCurent(node || null);
      onChange(node);
    },
    [onChange],
  );

  const startCreatingStep = React.useCallback(() => {
    setCreatingStep(true);
  }, []);

  const cancelCreatingStep = React.useCallback(() => {
    setCreatingStep(false);
  }, []);

  React.useEffect(() => {
    setSteps(normalizeTree(data?.getDiscovery.steps));
  }, [data]);

  const handleCreateStep = React.useCallback((value) => {
    createStep({
      variables: {
        input: {
          discoveryId,
          orderNum: steps.length + 1,
          title: value,
          description: `${value} description`,
        }
      },
    });
  }, [createStep, discoveryId, steps.length]);

  const startCreatingSummary = React.useCallback((step: Step) => {
    setStepForCreating(step);
  }, []);

  const cancelCreatingSummary = React.useCallback(() => {
    setStepForCreating(null);
  }, []);

  const handleCreateSummary = React.useCallback(
    (value: string) => {
      if (stepForCreating) {
        const summary = {
          stepId: stepForCreating?.id,
          title: value,
          content: `<p>${value} Content...</p>`,
          orderNum: stepForCreating?.summaries.length + 1,
        };

        createSummary({ variables: { summary } });
      }
    },
    [createSummary, stepForCreating],
  );

  const startDeletingStep = React.useCallback(
    (step: Step, index: number) => {
      Modal.confirm({
        title: (
          <>
            Are you sure you want to delete{' '}
            <Typography.Text mark>{step.title || `Step ${index + 1}`}</Typography.Text>?
          </>
        ),
        icon: <ExclamationCircleOutlined />,
        width: 640,
        okText: 'Delete',
        okButtonProps: { loading: deleteStepStatus.loading },
        onOk: () => deleteStep({ variables: { stepId: step.id } }),
      });
    },
    [deleteStep, deleteStepStatus.loading],
  );

  const startDeletingSummary = React.useCallback(
    (summary: Summary) => {
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
        okButtonProps: { loading: deleteSummaryStatus.loading },
        onOk: () => {
          deleteSummary({ variables: { summaryId: summary.id } });

          if (summary.id === current?.id) {
            chooseCurrent(); // deselect summary that going to be deleted
          }
        },
      });
    },
    [chooseCurrent, current, deleteSummary, deleteSummaryStatus.loading],
  );

  const moveSummary = React.useCallback(
    (stepIndex: number, dragIndex: number, hoverIndex: number) => {
      const dragCard = steps[stepIndex].summaries[dragIndex];
      const nextSteps = update(steps, {
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

      setSteps(nextSteps);
    },
    [steps],
  );

  const dropSummary = React.useCallback(
    (stepIndex: number, dragIndex: number, hoverIndex: number) => {
      const dragCard = steps[stepIndex].summaries[dragIndex];
      const nextSteps = update(steps, {
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

      setSteps(nextSteps);

      const order = (steps[stepIndex].summaries as Summary[]).map((sum, index) => ({
        id: sum.id,
        orderNum: index + 1,
      }));

      setSummaryOrder({ variables: { order } })
    },
    [setSummaryOrder, steps],
  );

  const moveStep = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = steps[dragIndex];
      const nextSteps = update(steps, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      });

      setSteps(nextSteps);
    },
    [steps],
  );

  const dropStep = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = steps[dragIndex];
      const nextSteps = update(steps, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      });

      setSteps(nextSteps);

      const order = nextSteps.map((step, index) => ({
        id: step.id,
        orderNum: index + 1,
      }));

      setStepsOrder({ variables: { order } })
    },
    [setStepsOrder, steps],
  );

  return (
    <div className={sty.wrapper}>
      <Spin spinning={setStepsOrderStatus.loading || setSummaryOrderStatus.loading}>
        {steps?.map((step, stIndex) => (
          <DndCard
            key={step.id}
            id={step.id}
            index={stIndex}
            type={String(discoveryId)}
            moveCard={moveStep}
            onDrop={dropStep}
          >
            <TreeViewNode
              title={step.title || `Step ${stIndex + 1}`}
              defaultExpanded={stIndex === 0}
              isActive={step.id === current?.id}
              onClick={() => chooseCurrent(step)}
              actions={[
                steps?.length > 1 && (
                  <Button
                    shape="circle"
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => startDeletingStep(step, stIndex)}
                  />
                ),
              ]}
            >
              {(step.summaries as Summary[])?.map((sum, sumIndex) => (
                <DndCard
                  key={sum.id}
                  id={sum.id}
                  index={sumIndex}
                  type={String(sum.stepId)}
                  moveCard={(...atrs) => moveSummary(stIndex, ...atrs)}
                  onDrop={(...atrs) => dropSummary(stIndex, ...atrs)}
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
                        onClick={() => startDeletingSummary(sum)}
                      />,
                    ]}
                  />
                </DndCard>
              ))}
              {step?.summaries?.length < 5 && (
                <div className={sty.createSection}>
                  {stepForCreating?.id === step.id ? (
                    <ConfirmInput
                      isLoading={createSummaryStatus.loading}
                      onOk={handleCreateSummary}
                      onCancel={cancelCreatingSummary}
                    />
                  ) : (
                    <Button
                      key={`${step.id}_createButton`}
                      type="dashed"
                      icon={<PlusOutlined />}
                      style={{ width: '100%' }}
                      onClick={() => startCreatingSummary(step)}
                    >
                      Add Summary
                    </Button>
                  )}
                </div>
              )}
            </TreeViewNode>
          </DndCard>
        ))}
        {steps?.length < 5 && (
          <div className={sty.createSection}>
            {isCreatingStep ? (
              <ConfirmInput
                isLoading={createStepStatus.loading}
                onOk={handleCreateStep}
                onCancel={cancelCreatingStep}
              />
            ) : (
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                style={{ width: '100%' }}
                onClick={() => startCreatingStep()}
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
