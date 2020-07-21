import React from 'react';
import { Row, Col, Empty, Card } from 'antd';
import { useForm } from 'antd/lib/form/Form';

import { Summary, Step } from 'core/models/generated';

import TreeView from 'components/UpdateGuide/TreeView';
import SummaryForm from 'components/UpdateGuide/SummaryForm';
import StepForm from 'components/UpdateGuide/StepForm';

import sty from './Content.module.scss';
import { FormInstance } from 'core/models';

const isStep = (obj: Step | Summary) => {
  return (obj as Summary).stepId === undefined;
};

export interface ContentProps {
  form: FormInstance;
}

const Content: React.FC<ContentProps> = ({ form }) => {
  const [stepForm] = useForm(form);
  const [summaryForm] = useForm(form);

  const [current, setCurent] = React.useState<Step | Summary>();

  const handleChange = (node?: Step | Summary) => {
    setCurent(node);
    if (node) {
      const form = isStep(node) ? stepForm : summaryForm;
      form.setFieldsValue(node);
      form.resetFields();
    }
  };

  const handleStepSubmit = values => {
    console.log('values: ', values);
  };

  const handleSummarySubmit = values => {
    console.log('values: ', values);
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
              <StepForm form={stepForm} onSubmit={handleStepSubmit} />
            ) : (
              <SummaryForm form={summaryForm} onSubmit={handleSummarySubmit} />
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
