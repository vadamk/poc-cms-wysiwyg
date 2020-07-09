import React from 'react';
import { Form, Input } from 'antd';

import { FormProps } from 'models';

export interface CreateSubjectFormProps extends FormProps {
  mode?: 'create' | 'update';
}

const CreateSubjectForm: React.FC<CreateSubjectFormProps> = ({
  form,
  initialValues = {},
  isSubmitting = false,
}) => (
  <Form
    layout="vertical"
    name="basic"
    form={form}
    initialValues={initialValues}
  >
    <Form.Item
      label="Title"
      name="title"
      rules={[{ required: true, message: 'Please input title!' }]}
    >
      <Input autoFocus autoComplete="off" disabled={isSubmitting} />
    </Form.Item>

    <Form.Item label="Description" name="description">
      <Input.TextArea disabled={isSubmitting} />
    </Form.Item>
  </Form>
);

export default CreateSubjectForm;
