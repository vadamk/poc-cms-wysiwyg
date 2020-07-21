import React from 'react';
import { Form, Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';

import { FormProps } from 'core/models';
import { Summary } from 'core/models/generated';
import RichEditor from 'components/RichEditor';

export interface SummaryFormProps extends FormProps {}

const SummaryForm: React.FC<SummaryFormProps> = ({
  form,
  initialValues,
  isSubmitting = false,
  onSubmit,
}) => {
  const [internalForm] = useForm(form);

  return (
    <>
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
          label="Content"
          name="content"
          rules={[{ required: true, message: 'Please input content!' }]}
        >
          <RichEditor />
        </Form.Item>
      </Form>
    </>
  );
};

export default SummaryForm;
