import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Tabs, Spin, message, Button, Row, Col, Card, Empty } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useParams } from 'react-router-dom';

import { Edition } from 'core/global';
import { DiscoveryFragment, SummaryFragment } from 'core/graphql/fragments';

import Toolbar, { Breadcrumb } from 'components/Toolbar';
import GuideForm from 'components/GuidesForm';

import sty from './UpdateGuide.module.scss';
import { removeTypeName } from 'core/utils';
import TreeView from 'components/UpdateGuide/TreeView';
import SummaryForm from 'components/UpdateGuide/SummaryForm';
import StepForm from 'components/UpdateGuide/StepForm';
import { Step, Summary } from 'core/models/generated';

const { TabPane } = Tabs;

const isStep = (obj: Step | Summary) => {
  return (obj as Summary).stepId === undefined;
};

export const GET_GUIDE = gql`
  query GetGuide($discoveryId: Int!) {
    getDiscovery(discoveryId: $discoveryId) {
      ...DiscoveryFragment
    }
  }
  ${DiscoveryFragment}
`;

export const UPDATE_GUIDE = gql`
  mutation UpdateDiscovery($discovery: UpdateDiscoveryInput!, $discoveryId: Int!) {
    updateDiscovery(discovery: $discovery, discoveryId: $discoveryId) {
      ...DiscoveryFragment
    }
  }
  ${DiscoveryFragment}
`;

export const UPDATE_SUMMARY = gql`
  mutation UpdateSummary($summary: UpdateDiscoverySummaryInput!) {
    updateSummary(summary: $summary) {
      ...SummaryFragment
    }
  }
  ${SummaryFragment}
`;

export const UPDATE_STEP = gql`
  mutation UpdateDiscoveryStep($input: UpdateDiscoveryStepInput!, $stepId: Int!) {
    updateDiscoveryStep(input: $input, stepId: $stepId)
  }
`;

export interface UpdateGuideProps {}

const UpdateGuide: React.FC<UpdateGuideProps> = () => {
  const { slug } = useParams();

  const [generalInfoForm] = useForm();
  const [stepForm] = useForm();
  const [summaryForm] = useForm();

  const [formData, setFormData] = React.useState();
  const [activeTab, setActiveTab] = React.useState(1);
  const [current, setCurent] = React.useState<Step | Summary>();

  const discoveryId = React.useMemo(() => Number(slug), [slug]);

  const { data, loading } = useQuery(GET_GUIDE, {
    variables: { discoveryId: Number(slug) },
    onCompleted: data => {
      const { editions, audiences, subjects, ...rest } = data?.getDiscovery;

      const formData = {
        ...rest,
        editions: editions.map(ed => Edition[ed.type.trim()]),
        audiences: audiences.map(ad => ad.type),
        subjectIDs: subjects.map(s => s.id),
      };

      setFormData(formData);
    },
  });

  const [updateGuide, updateGuideStatus] = useMutation(UPDATE_GUIDE, {
    onCompleted: () => {
      message.success('Guide has been updated.');
    },
  });

  const [updateSummary, updateSummaryStatus] = useMutation(UPDATE_SUMMARY, {
    refetchQueries: [{ query: GET_GUIDE, variables: { discoveryId } }],
    onCompleted: () => {
      message.success('Summary has been updated.');
    },
  });

  const [updateStep, updateStepStatus] = useMutation(UPDATE_STEP, {
    refetchQueries: [{ query: GET_GUIDE, variables: { discoveryId } }],
    onCompleted: () => {
      message.success('Step has been updated.');
    },
  });

  const handleStepSubmit = values => {
    updateStep({
      variables: {
        stepId: current?.id,
        input: values,
      },
    });
  };

  const handleSummarySubmit = values => {
    updateSummary({
      variables: {
        summary: { ...removeTypeName(current), ...values },
      },
    });
  };

  const breadcrumbs = React.useMemo<Breadcrumb[]>(() => {
    return [{ path: '/guides', breadcrumbName: 'Guides' }];
  }, []);

  const handleChangeTab = React.useCallback(key => {
    setActiveTab(key);
  }, []);

  const handleSubmit = React.useCallback(
    values => {
      const discovery = {
        ...values,
        orderNum: data?.getDiscovery.orderNum,
        actualTime: +new Date(),
      };
      const discoveryId = data?.getDiscovery.id;
      updateGuide({ variables: { discovery, discoveryId } });
    },
    [data, updateGuide],
  );

  const saveChanges = React.useCallback(() => {
    console.log('activeTab: ', activeTab);
    if (activeTab === 1) {
      generalInfoForm.submit();
    } else {
      if (current && isStep(current)) {
        stepForm.submit();
      } else {
        summaryForm.submit();
      }
    }
  }, [activeTab, current, generalInfoForm, stepForm, summaryForm]);

  const handleChange = async (node?: Step | Summary) => {
    setCurent(node);
    if (node) {
      const form = isStep(node) ? stepForm : summaryForm;
      form.resetFields();
      form.setFieldsValue(node);
    }
  };

  const isSubmitting = React.useMemo(() => {
    return [updateGuideStatus, updateStepStatus, updateSummaryStatus].some(
      status => status.loading,
    );
  }, [updateGuideStatus, updateStepStatus, updateSummaryStatus]);

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
            <Button type="primary" loading={isSubmitting} onClick={saveChanges}>
              Save Changes
            </Button>
          </div>
        }
      />
      <Spin spinning={loading}>
        {Number(activeTab) === 1 && formData && (
          <GuideForm
            mode="update"
            form={generalInfoForm}
            initialValues={formData}
            isSubmitting={updateGuideStatus.loading}
            onSubmit={handleSubmit}
          />
        )}
        {Number(activeTab) === 2 && formData && (
          <Row gutter={[10, 10]}>
            <Col span={6}>
              <TreeView onChange={handleChange} />
            </Col>
            <Col span={18}>
              <Card className={sty.form}>
                {current ? (
                  isStep(current) ? (
                    <StepForm
                      form={stepForm}
                      isSubmitting={updateStepStatus.loading}
                      onSubmit={handleStepSubmit}
                    />
                  ) : (
                    <SummaryForm
                      form={summaryForm}
                      isSubmitting={updateSummaryStatus.loading}
                      onSubmit={handleSummarySubmit}
                    />
                  )
                ) : (
                  <Empty description="Please choose summary or step" />
                )}
              </Card>
            </Col>
          </Row>
        )}
      </Spin>
    </>
  );
};

export default UpdateGuide;
