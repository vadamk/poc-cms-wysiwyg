import React from 'react';
import { gql } from 'apollo-boost';
import cx from 'classnames';
import { List, Button, Space, Menu } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import { Step } from 'core/models/generated';

import { GET_GUIDE } from 'components/UpdateGuide/UpdateGuide';

import sty from './Steps.module.scss';

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

export interface StepsProps {
  guideId: number;
  onChange: (step: Step) => void;
}

const Steps: React.FC<StepsProps> = ({ guideId, onChange }) => {
  const [currentStep, setCurrentStep] = React.useState<Step>();

  const { data } = useQuery(GET_GUIDE, {
    variables: { discoveryId: guideId },
  });

  const [createStep, createStepStatus] = useMutation(CREATE_STEP, {
    refetchQueries: [{ query: GET_GUIDE, variables: { discoveryId: guideId } }],
  });

  const [deleteStep, deleteStepStatus] = useMutation(DELETE_STEP, {
    refetchQueries: [{ query: GET_GUIDE, variables: { discoveryId: guideId } }]
  });

  const steps = React.useMemo<Step[]>(() => {
    return data?.getDiscovery.steps || [];
  }, [data]);

  const chooseStep = React.useCallback((step: Step) => {
    setCurrentStep(step);
    onChange(step);
  }, [onChange]);

  const handleCreateStep = React.useCallback(() => {
    const variables = {
      discoveryId: guideId,
      orderNum: steps.length + 1
    };

    createStep({ variables });
  }, [createStep, guideId, steps.length]);

  const handleDeleteStep = React.useCallback((step: Step, ev: React.MouseEvent) => {
    ev.stopPropagation();

    if (step.id === currentStep?.id) {
      const stepIndex = steps.findIndex(st => st.id === step.id);
      chooseStep(steps[stepIndex + 1] || steps[stepIndex - 1]);
    }

    deleteStep({ variables: { stepId: step.id } });
  }, [chooseStep, currentStep, deleteStep, steps]);

  React.useEffect(() => {
    if (data) {
      const { steps } = data.getDiscovery;
      const nextStepIndex = steps.findIndex(st => st.id === currentStep?.id);
      chooseStep(steps[nextStepIndex !== -1 ? nextStepIndex : 0]);
    }
  }, [chooseStep, currentStep, data]);

  return (
    <Space direction="vertical" style={{ display: 'flex' }}>
      <List
        dataSource={steps}
        renderItem={(step, index) => (
          <List.Item
            key={step.id}
            className={cx(step.id === currentStep?.id && sty.selected)}
            onClick={() => chooseStep(step)}
            actions={[
              <Button
                shape="circle"
                type="text"
                icon={<DeleteOutlined />}
                loading={deleteStepStatus.loading}
                onClick={ev => handleDeleteStep(step, ev)}
              />
            ]}
          >
            <List.Item.Meta title={<span>Step {index + 1}</span>} />
          </List.Item>
        )}
      />
      {steps.length < 5 && (
        <Button
          type="dashed"
          loading={createStepStatus.loading}
          icon={<PlusOutlined />}
          style={{ width: '100%' }}
          onClick={handleCreateStep}
        >
          Add
        </Button>
      )}
    </Space>
  );
};

export default React.memo(Steps);
