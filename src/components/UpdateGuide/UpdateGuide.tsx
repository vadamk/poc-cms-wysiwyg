import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Tabs, Spin, Card, message, Button } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useParams } from 'react-router-dom';

import { Edition } from 'core/global';
import { DiscoveryFragment } from 'core/graphql/fragments';

import Toolbar, { Breadcrumb } from 'components/Toolbar';
import GuideForm from 'components/GuidesForm';

import Content from './Content';

import sty from './UpdateGuide.module.scss';

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
  const [generalInfoform] = useForm();
  const [contentForm] = useForm();
  const { slug } = useParams();

  const [formData, setFormData] = React.useState();
  const [activeTab, setActiveTab] = React.useState(1);

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

  const handleSaveChanges = () => {
    if (activeTab === 1) {
      generalInfoform.submit()
    } else {
      contentForm.submit();
    }
  }

  return (
    <>
      <Toolbar
        title="Update Guide"
        breadcrumbs={breadcrumbs}
        footer={
          <div className={sty.pageHeader}>
            <Tabs defaultActiveKey={String(activeTab)} onChange={handleChangeTab}>
              <TabPane tab="General Info" key="1" />
              <TabPane tab="Manage Content" key="2" />
            </Tabs>
            <Button
              type="primary"
              loading={updateGuideStatus.loading}
              onClick={handleSaveChanges}
            >
              Save changes
            </Button>
          </div>
        }
      />
      <Spin spinning={loading}>
        {Number(activeTab) === 1 && formData && (
          <Card>
            <GuideForm
              mode="update"
              form={generalInfoform}
              initialValues={formData}
              isSubmitting={updateGuideStatus.loading}
              onSubmit={handleSubmit}
            />
          </Card>
        )}
        {Number(activeTab) === 2 && formData && <Content form={contentForm} />}
      </Spin>
    </>
  );
};

export default UpdateGuide;
