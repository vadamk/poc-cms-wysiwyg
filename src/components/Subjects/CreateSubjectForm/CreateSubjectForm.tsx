import React from 'react';
import { Form, Input, Select } from 'antd';

import { FormProps } from 'models';
import { langOptions, Language } from 'global';

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

export interface CreateSubjectFormProps extends FormProps {
  mode?: 'create' | 'update';
}

const CreateSubjectForm: React.FC<CreateSubjectFormProps> = ({
  form,
  initialValues = { language: Language.SV },
  isSubmitting = false,
}) => (
  <Form
    {...layout}
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

    <Form.Item label="Language" name="language">
      <Select disabled={isSubmitting} options={langOptions} />
    </Form.Item>

    <Form.Item label="Description" name="description">
      <Input.TextArea rows={4} disabled={isSubmitting} />
    </Form.Item>
  </Form>
);

export default CreateSubjectForm;
