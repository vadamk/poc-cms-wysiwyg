import React from 'react';
import { gql } from 'apollo-boost';

import { DiscoveryFragment } from 'core/graphql/fragments';
import Toolbar, { Breadcrumb } from 'components/Toolbar';
import GuidesForm from 'components/GuidesForm';

import { useMutation } from '@apollo/react-hooks';
import { CreateDiscoveryMutationVariables, CreateDiscoveryMutation } from 'core/models/generated';
import { Card, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { GET_GUIDES_LIST } from 'components/Guides';

import sty from './CreateGuide.module.scss';
import { useForm } from 'antd/lib/form/Form';

export const CREATE_GUIDE = gql`
  mutation CreateDiscovery($discovery: CreateDiscoveryInput!) {
    createDiscovery(discovery: $discovery) {
      ...DiscoveryFragment
    }
  }
  ${DiscoveryFragment}
`;

export interface CreateGuideProps {}

const CreateGuide: React.FC<CreateGuideProps> = () => {
  const history = useHistory();
  const [form] = useForm();

  const [createGuide, createGuideStatus] = useMutation<
    CreateDiscoveryMutation,
    CreateDiscoveryMutationVariables
  >(CREATE_GUIDE, {
    refetchQueries: [{ query: GET_GUIDES_LIST }],
    onCompleted: ({ createDiscovery: { id } }) => {
      history.push(`/guides/${id}`);
    },
  });

  const breadcrumbs = React.useMemo<Breadcrumb[]>(() => {
    return [{ path: '/guides', breadcrumbName: 'Guides' }];
  }, []);

  const handleSubmit = React.useCallback(values => {
    const discovery = {
      ...values,
      orderNum: 1,
      actualTime: +new Date()
    };

    createGuide({ variables: { discovery } });
  }, [createGuide]);

  const submitForm = React.useCallback(() => {
    form.submit()
  }, [form]);

  const actionButtons = React.useMemo(
    () => (
      <Button type="primary" loading={createGuideStatus.loading} onClick={submitForm}>
        Create
      </Button>
    ),
    [createGuideStatus.loading, submitForm],
  );

  return (
    <>
      <Toolbar title="Create Guide" breadcrumbs={breadcrumbs} extra={actionButtons} />
      <GuidesForm
        form={form}
        mode="create"
        isSubmitting={createGuideStatus.loading}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default CreateGuide;
