import React from 'react';
import { gql } from 'apollo-boost';
import { useForm } from 'antd/lib/form/Form';
import { useMutation } from '@apollo/react-hooks';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';

import { GuideFragment } from 'core/graphql/fragments';

import Toolbar, { Breadcrumb } from 'components/Toolbar';
import GuidesForm from 'components/GuidesForm';
import { GET_GUIDES } from 'components/Guides';

export const CREATE_GUIDE = gql`
  mutation CreateGuide($input: CreateGuideInput!) {
    createGuide(input: $input) {
      ...GuideFragment
    }
  }
  ${GuideFragment}
`;

export interface CreateGuideProps {}

const CreateGuide: React.FC<CreateGuideProps> = () => {
  const history = useHistory();
  const [form] = useForm();

  const [createGuide, createGuideStatus] = useMutation(CREATE_GUIDE, {
    refetchQueries: [{ query: GET_GUIDES }],
    onCompleted: ({ createGuide: { id } }) => {
      history.push(`/guides/${id}`);
    },
  });

  const breadcrumbs = React.useMemo<Breadcrumb[]>(() => {
    return [{ path: '/guides', breadcrumbName: 'Guides' }];
  }, []);

  const handleSubmit = React.useCallback(
    values => {
      const discovery = {
        ...values,
        orderNum: 1,
        actualTime: +new Date(),
      };

      createGuide({ variables: { discovery } });
    },
    [createGuide],
  );

  const submitForm = React.useCallback(() => {
    form.submit();
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
