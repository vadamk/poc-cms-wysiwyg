import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Tabs, Spin, Card, message, Button } from 'antd';
import { useParams } from 'react-router-dom';

import { Edition } from 'core/global';
import { DiscoveryFragment } from 'core/graphql/fragments';

import Toolbar, { Breadcrumb } from 'components/Toolbar';
import GuideForm from 'components/GuidesForm';

import Content from './Content';

import sty from './UpdateGuide.module.scss';
import { useForm } from 'antd/lib/form/Form';

const { TabPane } = Tabs;

export const GET_GUIDE = gql`
  query GetGuide($discoveryId: Int!) {
    getDiscovery(discoveryId: $discoveryId) {
      ...DiscoveryFragment
    }
  }
  ${DiscoveryFragment}
`;

export const UPDATE_GUIDE = gql`
  mutation UpdateDiscovery($discovery: UpdateDiscoveryInput!) {
    updateDiscovery(discovery: $discovery) {
      ...DiscoveryFragment
    }
  }
  ${DiscoveryFragment}
`;

export interface UpdateGuideProps {}

const UpdateGuide: React.FC<UpdateGuideProps> = () => {
  const [form] = useForm();
  const { slug } = useParams();

  const [formData, setFormData] = React.useState();
  const [activeTab, setActiveTab] = React.useState(2);

  const { data, loading } = useQuery(GET_GUIDE, {
    variables: { discoveryId: Number(slug) },
    onCompleted: data => {
      const { editions, audiences, subject, ...rest } = data?.getDiscovery;

      const formData = {
        ...rest,
        editions: editions.map(ed => Edition[ed.type.trim()]),
        audiences: audiences.map(ad => ad.type),
        subjectId: subject.id,
      };

      setFormData(formData);
    },
  });

  const [updateGuide, updateGuideStatus] = useMutation(UPDATE_GUIDE, {
    onCompleted: () => {
      message.success('Guide has been updated.');
    },
  });

  const breadcrumbs = React.useMemo<Breadcrumb[]>(() => {
    return [{ path: '/guides', breadcrumbName: 'Guides' }];
  }, []);

  const handleChangeTab = React.useCallback(key => {
    setActiveTab(key);
  }, []);

  const handleSubmit = React.useCallback(
    values => {
      const guide = {
        ...values,
        id: data?.getDiscovery.id,
        orderNum: data?.getDiscovery.orderNum,
      };

      updateGuide({ variables: { discovery: guide } });
    },
    [data, updateGuide],
  );

  return (
    <>
      <Toolbar
        title="Update Guide"
        breadcrumbs={breadcrumbs}
        extra={
          <Button type="primary" onClick={() => form.submit()}>
            Save changes
          </Button>
        }
        footer={
          <Tabs defaultActiveKey={String(activeTab)} onChange={handleChangeTab}>
            <TabPane tab="General Info" key="1" />
            <TabPane tab="Manage Content" key="2" />
          </Tabs>
        }
      />
      <Spin spinning={loading}>
        {Number(activeTab) === 1 && formData && (
          <Card>
            <GuideForm onSubmit={handleSubmit} mode="update" initialValues={formData} />
          </Card>
        )}
        {Number(activeTab) === 2 && formData && <Content form={form} />}
      </Spin>
    </>
  );
};

export default UpdateGuide;
