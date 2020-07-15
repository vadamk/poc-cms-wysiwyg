import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { gql } from 'apollo-boost';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { useForm } from 'antd/lib/form/Form';

import { saveInLocalStorage } from 'services/browser';
import { localStorageKeys } from 'core/global';

import SignInForm from './SignInForm';

const { Title } = Typography;

export const SIGN_IN = gql`
  mutation SignIn($identity: String!, $password: String!) {
    auth(identity: $identity, password: $password) {
      token
    }
  }
`;

export const SET_AUTHORIZED = gql`
  mutation($isAuthorized: Boolean!) {
    setAuthorized(isAuthorized: $isAuthorized) @client
  }
`;

export interface SignInProps {}

const SignIn: React.FC<SignInProps> = () => {
  const [form] = useForm();
  const history = useHistory();
  const [setAuthorized] = useMutation(SET_AUTHORIZED);

  const [signIn, signInStatus] = useMutation(SIGN_IN, {
    onCompleted: async ({ auth }) => {
      saveInLocalStorage(localStorageKeys.token, auth.token);
      await setAuthorized({ variables: { isAuthorized: true } });
      history.push('/');
    },
    onError: () => {
      form.setFieldsValue({});
    }
  });


  const handleSubmit = (values) => {
    signIn({ variables: { ...values } })
  }

  return (
    <Row
      justify="center"
      align="middle"
      style={{ height: '100vh', backgroundColor: '#f9f9f9' }}
    >
      <Col span={8}>
        <Card>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign In</Title>
          <SignInForm
            form={form}
            isSubmitting={signInStatus.loading}
            onSubmit={handleSubmit}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default SignIn;
