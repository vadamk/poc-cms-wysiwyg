import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import update from "immutability-helper";
import { Button, Typography, Modal, message, Input } from 'antd';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import { QueryGetDiscoveryArgs, Step, Summary } from 'core/models/generated';
import { SummaryFragment } from 'core/graphql/fragments';
import { GET_GUIDE } from 'components/UpdateGuide';
import TreeViewItem from 'components/UpdateGuide/TreeViewItem';
import DndCard from 'components/UpdateGuide/DndCard';

import sty from './TreeView.module.scss';
import ConfirmInput from 'components/ConfirmInput';

const normalizeTree = (steps: Step[]) => (steps || [])
  .sort((a, b) => a.orderNum - b.orderNum)
  .map(step => ({
    ...step,
    summaries: (step.summaries as Summary[])
      .sort((a, b) => a.orderNum - b.orderNum)
  }));

export const CREATE_SUMMARY = gql`
  mutation CreateSummary($summary: CreateSummaryInput!) {
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
  mutation CreateStep($discoveryId: Int!, $orderNum: Int!) {
    createStep(discoveryId: $discoveryId, orderNum: $orderNum) {
      id
      orderNum
    }
  }
`;

export const DELETE_STEP = gql`
  mutation DeleteStep($stepId: Int!) {
    deleteStep(stepId: $stepId)
  }
`;

export interface TreeViewProps {
  onSummaryChange: (summary?: Summary) => void;
}

const TreeView: React.FC<TreeViewProps> = ({
  onSummaryChange = () => null,
}) => {
  const { slug } = useParams();

  const [steps, setSteps] = React.useState<Step[]>([]);
  const [currentStep, setCurentStep] = React.useState<Step | null>(null);
  const [currentSummary, setCurentSummary] = React.useState<Summary>();
  const [stepForCreating, setStepForCreating] = React.useState<Step | null>(null);
  const [isCreatingStep, setCreatingStep] = React.useState(false);
  
  const discoveryId = React.useMemo(() => Number(slug), [slug]);

  const { data } = useQuery<any, QueryGetDiscoveryArgs>(GET_GUIDE, {
    variables: { discoveryId: Number(slug) },
    onCompleted: ({ getDiscovery: { steps } }) => {
      expandStep(steps[0]);
      if (steps[0].summaries.length) {
        chooseSummary(steps[0].summaries[0]);
      }
    }
  });

  const [createStep, createStepStatus] = useMutation(CREATE_STEP, {
    refetchQueries: [{ query: GET_GUIDE, variables: { discoveryId } }],
    onCompleted: ({ createStep: step }) => {
      setCreatingStep(false);

      // optimistic strategy
      const nextSteps = update(steps, { $push: [step] });
      setSteps(nextSteps);
    }
  });

  const [deleteStep, deleteStepStatus] = useMutation(DELETE_STEP, {
    refetchQueries: [{ query: GET_GUIDE, variables: { discoveryId } }],
    onCompleted: () => {
      message.success('Step has been deleted.');
    }
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
          [stepIndex]: step => update(step, {
            summaries: summaries => update(summaries, {
              $push: [summary]
            })
          })
        });
    
        setSteps(nextSteps);
      }
    }
  });

  const [deleteSummary, deleteSummaryStatus] = useMutation(DELETE_SUMMARY, {
    refetchQueries: [{ query: GET_GUIDE, variables: { discoveryId } }],
    onCompleted: () => {
      message.success('Summary has been deleted.');
    }
  });

  const expandStep = React.useCallback((step: Step) => {
    setCurentStep(step.id !== currentStep?.id ? step : null);
  }, [currentStep]);

  const chooseSummary = React.useCallback((summary?: Summary) => {
    setCurentSummary(summary);
    onSummaryChange(summary);
  }, [onSummaryChange]);

  const startCreatingStep = React.useCallback(() => {
    setCreatingStep(true);
  }, []);

  const cancelCreatingStep = React.useCallback(() => {
    setCreatingStep(false);
  }, []);

  /*
    It looks tricky.
    We have to update `currentSummary` and to emit `onSummaryChange`
    to update `currentSummary` for other componets.
    To make it less tricky we have to add `getSummaries` method to server API
    and stop use `currentSummary` in other componets but start use currentSummaryId.

    const rechoose = () => {
      if (currentSummary) {
        const nextCurrentStep = steps
          .find(st => st.id === currentSummary?.stepId);

        if (nextCurrentStep?.summaries) {
          const nextCurrentSummary = nextCurrentStep.summaries
            .find(sum => sum?.id === currentSummary?.id);

          if (nextCurrentSummary) {
            chooseSummary(nextCurrentSummary);
            return;
          }
        }

        chooseSummary();
      }
    }
  */

  React.useEffect(() => {
    setSteps(normalizeTree(data?.getDiscovery.steps));
  }, [data]);

  const handleCreateStep = React.useCallback(() => {
    createStep({
      variables: {
        discoveryId,
        orderNum: steps.length + 1
      }
    });
  }, [createStep, discoveryId, steps.length]);

  const startCreatingSummary = React.useCallback((step: Step) => {
    setStepForCreating(step);
  }, []);

  const cancelCreatingSummary = React.useCallback(() => {
    setStepForCreating(null);
  }, []);

  const handleCreateSummary = React.useCallback((value: string) => {
    if (stepForCreating) {
      const summary = {
        stepId: stepForCreating?.id,
        title: value,
        content: '<p><br></p>',
        orderNum: stepForCreating?.summaries.length + 1,
      }
  
      createSummary({ variables: { summary } });
    }
  }, [createSummary, stepForCreating]);
  
  const startDeletingStep = React.useCallback((step: Step, index: number) => {
    Modal.confirm({
      title: (
        <>
          Are you sure you want to delete{' '}
          <Typography.Text mark>Step {index + 1}</Typography.Text>?
        </>
      ),
      icon: <ExclamationCircleOutlined />,
      width: 640,
      okText: 'Delete',
      okButtonProps: { loading: deleteStepStatus.loading },
      onOk: () => deleteStep({ variables: { stepId: step.id } }),
    });
  }, [deleteStep, deleteStepStatus.loading]);

  const startDeletingSummary = React.useCallback((summary: Summary) => {
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
        
        if (summary.id === currentSummary?.id) {
          chooseSummary(); // deselect summary that going to be deleted
        }
      },
    });
  }, [chooseSummary, currentSummary, deleteSummary, deleteSummaryStatus.loading]);

  const moveSummary = React.useCallback((
    stepIndex: number,
    dragIndex: number,
    hoverIndex: number
  ) => {
    const dragCard = steps[stepIndex].summaries[dragIndex];
    const nextSteps = update(steps, {
      [stepIndex]: step => update(step, {
        summaries: summaries => update(summaries, {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
        })
      })
    });

    setSteps(nextSteps);
  }, [steps]);

  return (
    <div className={sty.wrapper}>
      {steps.map((step, stIndex) => (
        <TreeViewItem
          key={step.id}
          title={`Step ${stIndex + 1}`}
          isExpanded={step.id === currentStep?.id}
          onClick={() => expandStep(step)}
          actions={[
            <Button
              shape="circle"
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => startDeletingStep(step, stIndex)}
            />
          ]}
        >
          {(step.summaries as Summary[]).map((sum, sumIndex) => (
            <DndCard
              key={sum.id}
              id={sum.id}
              index={sumIndex}
              type={String(sum.stepId)}
              moveCard={(...atrs) => moveSummary(stIndex, ...atrs)}
            >
              <TreeViewItem
                title={sum?.title}
                isActive={sum.id === currentSummary?.id}
                onClick={() => chooseSummary(sum)}
                actions={[
                  <Button
                    shape="circle"
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => startDeletingSummary(sum)}
                  />
                ]}
              />
            </DndCard>
          ))}
          {step.summaries.length < 5 && (
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
        </TreeViewItem>
      ))}
      {steps.length < 5 && (
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
    </div>
  );
};

export default TreeView;
