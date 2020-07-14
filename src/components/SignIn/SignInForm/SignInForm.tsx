import React from 'react';
import { Form, Input, Button } from 'antd';

import { FormProps } from 'models';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export interface SignInFormProps extends FormProps {}

const SignInForm: React.FC<SignInFormProps> = ({ isSubmitting, onSubmit }) => {
  return (
    <Form {...layout} name="basic" onFinish={onSubmit}>
      <Form.Item
        label="Username"
        name="identity"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input disabled={isSubmitting} />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password disabled={isSubmitting} />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignInForm;
