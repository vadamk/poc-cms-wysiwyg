import React from 'react';
import { gql } from 'apollo-boost';

import { DiscoveryFragment } from 'core/graphql/fragments';
import Toolbar, { Breadcrumb } from 'components/Toolbar';
import GuidesForm from 'components/GuidesForm';

import sty from './CreateGuide.module.scss';
import { useMutation } from '@apollo/react-hooks';
import { MutationCreateDiscoveryArgs, CreateDiscoveryInput } from 'core/models/generated';
import { Card } from 'antd';
import { useHistory } from 'react-router-dom';

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

  const [createGuide, createGuideStatus] = useMutation<
    CreateDiscoveryInput,
    MutationCreateDiscoveryArgs
  >(CREATE_GUIDE, {
    onCompleted: () => {
      history.push('/guides');
    },
  });

  const breadcrumbs = React.useMemo<Breadcrumb[]>(() => {
    return [{ path: '/guides', breadcrumbName: 'Guides' }];
  }, []);

  const handleSubmit = values => {
    const discovery = { ...values, stepCount: 1, orderNum: 1 };
    createGuide({ variables: { discovery } });
  };

  return (
    <>
      <Toolbar title="Create Guide" breadcrumbs={breadcrumbs} />
      <Card>
        <GuidesForm isSubmitting={createGuideStatus.loading} onSubmit={handleSubmit} />
      </Card>
    </>
  );
};

export default CreateGuide;
