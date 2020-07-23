import React from 'react';
import { Form, Input } from 'antd';

import { FormProps } from 'core/models';

import { useForm } from 'antd/lib/form/Form';

export interface StepFormProps extends FormProps {}

const StepForm: React.FC<StepFormProps> = ({
  form,
  initialValues,
  isSubmitting,
  onSubmit = () => null,
}) => {
  const [internalForm] = useForm(form);

  return (
    <Form
      name="basic"
      layout="vertical"
      initialValues={initialValues}
      form={internalForm}
      onFinish={onSubmit}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: 'Please input title!' }]}
      >
        <Input
          autoFocus
          autoComplete="off"
          disabled={isSubmitting}
          placeholder="Please input title"
        />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Please input description!' }]}
      >
        <Input.TextArea
          rows={2}
          disabled={isSubmitting}
          placeholder="Please input description"
        />
      </Form.Item>
    </Form>
  );
};

export default StepForm;
