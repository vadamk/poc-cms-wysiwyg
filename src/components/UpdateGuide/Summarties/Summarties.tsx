import React from 'react';
import { Space, Button, Input } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import update from "immutability-helper";

import { Summary, Step } from 'core/models/generated';
import { SummaryFragment } from 'core/graphql/fragments';
import { GET_GUIDE } from 'components/UpdateGuide/UpdateGuide';
import DndCard from 'components/UpdateGuide/DndCard';
import TreeViewItem from 'components/UpdateGuide/TreeViewItem';

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

export interface SummartiesProps {
  step: Step;
  guideId: Number;
  onChange: (sum: Summary) => void;
}

const Summarties: React.FC<SummartiesProps> = ({ guideId, step, onChange = () => null }) => {
  const [summaries, setSummaries] = React.useState<Summary[]>([]);
  const [currentSummary, setCurrentSummary] = React.useState<Summary>();
  const [isCreating, setCreating] = React.useState(false);

  const newSummaryRef = React.useRef<Input>(null);

  const chooseSummary = React.useCallback((sum: Summary) => {
    setCurrentSummary(sum);
    onChange(sum);
  }, [onChange]);

  React.useEffect(() => {
    const nextSummaries = step.summaries as Summary[];

    setSummaries(nextSummaries);

    if (!summaries.find(sum => sum?.id === currentSummary?.id)) {
      chooseSummary(nextSummaries[0]);
    }
  }, [chooseSummary, currentSummary, step.summaries]);

  const [createSummary, createSummaryStatus] = useMutation(CREATE_SUMMARY, {
    refetchQueries: [{ query: GET_GUIDE, variables: { discoveryId: guideId } }],
    onCompleted: ({ createSummary: sum }) => {
      setSummaries([...summaries, sum ])
    }
  });

  const [deleteSummary, deleteSummaryStatus] = useMutation(DELETE_SUMMARY, {
    refetchQueries: [{ query: GET_GUIDE, variables: { discoveryId: guideId } }],
  });

  const startCreatingSummary = React.useCallback(() => {
    setCreating(true);
    setTimeout(() => newSummaryRef.current?.focus());
  }, []);

  const handleCreateSummary = React.useCallback(({ target }) => {
    if (!target.value) {
      return;
    }

    setCreating(false);

    const summary = {
      stepId: step.id,
      title: target.value,
      content: '<p></p>',
      orderNum: summaries.length
    }
    createSummary({ variables: { summary } });
  }, [createSummary, step.id, summaries.length]);

  const handleDeleteSummary = React.useCallback((summary: Summary, ev: React.MouseEvent) => {
    ev.stopPropagation();

    if (summary.id === currentSummary?.id) {
      const summaryIndex = summaries.findIndex(sum => sum?.id === summary.id);
      chooseSummary(summaries[summaryIndex + 1] || summaries[summaryIndex - 1]);
    }

    setSummaries(summaries.filter(sum => sum.id !== summary.id));

    deleteSummary({ variables: { summaryId: summary.id } });
  }, [chooseSummary, currentSummary, deleteSummary, summaries]);

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const dragCard = summaries[dragIndex];
    setSummaries(
      update(summaries, {
        $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
      })
    );
  };

  return (
    <Space direction="vertical" style={{ display: 'flex' }}>

      <div>
      {summaries.map((sum, i) => (
        <DndCard
          key={sum.id}
          id={sum.id}
          index={i}
          type={String(sum.stepId)}
          moveCard={moveCard}
        >
          <TreeViewItem
            title={sum.title}
            isActive={sum.id === currentSummary?.id}
            actions={[
              <Button
                shape="circle"
                type="text"
                icon={<DeleteOutlined />}
                loading={deleteSummaryStatus.loading}
                onClick={ev => handleDeleteSummary(sum, ev)}
              />
            ]}
            data={sum}
            onClick={chooseSummary}
          />
        </DndCard>
      ))}
      </div>
      {isCreating ? (
        <Input
          ref={newSummaryRef}
          onPressEnter={handleCreateSummary}
        />
      ) : (
        <Button
          type="dashed"
          loading={createSummaryStatus.loading}
          icon={<PlusOutlined />}
          style={{ width: '100%' }}
          onClick={startCreatingSummary}
        >
          Add
        </Button>
      )}
    </Space>
  );
};

export default React.memo(Summarties);
