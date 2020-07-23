import React from 'react';
import { Row, Col, Empty, Card, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { gql } from 'apollo-boost';

import { FormInstance } from 'core/models';
import { SummaryFragment, StepFragment } from 'core/graphql/fragments';
import { Summary, Step } from 'core/models/generated';

import TreeView from 'components/UpdateGuide/TreeView';
import SummaryForm from 'components/UpdateGuide/SummaryForm';
import StepForm from 'components/UpdateGuide/StepForm';

import sty from './Content.module.scss';
import { useMutation } from '@apollo/react-hooks';
import { removeTypeName } from 'core/utils';
import { GET_GUIDE } from 'components/UpdateGuide';
import { useParams } from 'react-router-dom';

const isStep = (obj: Step | Summary) => {
  return (obj as Summary).stepId === undefined;
};

export const UPDATE_SUMMARY = gql`
  mutation UpdateSummary($summary: UpdateSummaryInput!) {
    updateSummary(summary: $summary) {
      ...SummaryFragment
    }
  }
  ${SummaryFragment}
`;

export const UPDATE_STEP = gql`
  mutation UpdateDiscoveryStep($input: UpdateStepInput!, $stepId: Int!) {
    updateDiscoveryStep(input: $input, stepId: $stepId)
  }
`;

export interface ContentProps {
  form: FormInstance;
}

const Content: React.FC<ContentProps> = ({ form }) => {
  const { slug } = useParams();

  const [stepForm] = useForm(form);
  const [summaryForm] = useForm(form);

  const [current, setCurent] = React.useState<Step | Summary>();

  const discoveryId = React.useMemo(() => Number(slug), [slug]);

  const [updateSummary, updateSummaryStatus] = useMutation(UPDATE_SUMMARY, {
    refetchQueries: [{ query: GET_GUIDE, variables: { discoveryId } }],
    onCompleted: () => {
      message.success('Summary has been updated.');
    }
  });

  const [updateStep, updateStepStatus] = useMutation(UPDATE_STEP, {
    refetchQueries: [{ query: GET_GUIDE, variables: { discoveryId } }],
    onCompleted: () => {
      message.success('Step has been updated.');
    }
  });

  const handleChange = async (node?: Step | Summary) => {
    setCurent(node);
    if (node) {
      const form = isStep(node) ? stepForm : summaryForm;
      form.resetFields();
      form.setFieldsValue(node);
    }
  };

  const handleStepSubmit = values => {
    updateStep({
      variables: {
        stepId: current?.id,
        input: values
      }
    });
  };

  const handleSummarySubmit = values => {
    updateSummary({
      variables: {
        summary: { ...removeTypeName(current), ...values }
      }
    });
  };

  return (
    <Row gutter={[10, 10]}>
      <Col span={6}>
        <TreeView onChange={handleChange} />
      </Col>
      <Col span={18}>
        <Card className={sty.form}>
          {current ? (
            isStep(current) ? (
              <StepForm
                form={stepForm}
                isSubmitting={updateStepStatus.loading}
                onSubmit={handleStepSubmit}
              />
            ) : (
              <SummaryForm
                form={summaryForm}
                isSubmitting={updateSummaryStatus.loading}
                onSubmit={handleSummarySubmit}
              />
            )
          ) : (
            <Empty description="Please choose summary or step" />
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default React.memo(Content);
