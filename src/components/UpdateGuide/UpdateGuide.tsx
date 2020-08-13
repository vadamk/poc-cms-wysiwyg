import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Tabs, Spin, message, Button, Row, Col, Card, Empty, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';

import { Edition } from 'core/global';
import { GuideFragment, SummaryFragment } from 'core/graphql/fragments';
import { removeTypeName } from 'core/utils';
import { GuideStep, GuideStepSummary } from 'core/models/generated';

import TreeView from 'components/UpdateGuide/TreeView';
import SummaryForm from 'components/UpdateGuide/SummaryForm';
import StepForm from 'components/UpdateGuide/StepForm';
import Toolbar, { Breadcrumb } from 'components/Toolbar';
import GuideForm from 'components/GuidesForm';

import sty from './UpdateGuide.module.scss';

const { TabPane } = Tabs;

const isStep = (obj: GuideStep | GuideStepSummary) => {
  return (obj as GuideStepSummary).stepId === undefined;
};

export const GET_GUIDE = gql`
  query GetGuide($guideId: Int!) {
    getGuide(guideId: $guideId) {
      ...GuideFragment
    }
  }
  ${GuideFragment}
`;

export const UPDATE_GUIDE = gql`
  mutation UpdateGuide($input: UpdateGuideInput!, $guideId: Int!) {
    updateGuide(input: $input, guideId: $guideId) {
      ...GuideFragment
    }
  }
  ${GuideFragment}
`;

export const UPDATE_SUMMARY = gql`
  mutation UpdateGuideStepSummary(
    $input: UpdateGuideStepSummaryInput!
    $summaryId: Int!
  ) {
    updateGuideStepSummary(input: $input, summaryId: $summaryId) {
      ...SummaryFragment
    }
  }
  ${SummaryFragment}
`;

export const UPDATE_STEP = gql`
  mutation UpdateGuideStep($input: UpdateGuideStepInput!, $stepId: Int!) {
    updateGuideStep(input: $input, stepId: $stepId)
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
  const [current, setCurent] = React.useState<GuideStep | GuideStepSummary>();
 
  console.log('current: ', current, activeTab);

  const guideId = React.useMemo(() => Number(slug), [slug]);

  const { data, loading } = useQuery(GET_GUIDE, {
    variables: { guideId: Number(slug) },
    onCompleted: data => {
      const { editions, subjects, ...rest } = data?.getGuide;

      const formData = {
        ...rest,
        editions: editions.map(ed => Edition[ed.type.trim()]),
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
    refetchQueries: [{ query: GET_GUIDE, variables: { guideId } }],
    onCompleted: () => {
      message.success('Summary has been updated.');
    },
  });

  const [updateStep, updateStepStatus] = useMutation(UPDATE_STEP, {
    refetchQueries: [{ query: GET_GUIDE, variables: { guideId } }],
    onCompleted: () => {
      message.success('Step has been updated.');
    },
  });

  const handleStepSubmit = values => {
    updateStep({
      variables: {
        input: values,
        stepId: current?.id,
      },
    });
  };

  const handleSummarySubmit = values => {
    if (current) {
      console.log('current: ', current);
      const { id: summaryId, ...rest } = current;
      updateSummary({
        variables: {
          input: { ...removeTypeName(rest), ...values },
          summaryId,
        },
      });
    }
  };

  const breadcrumbs = React.useMemo<Breadcrumb[]>(() => {
    return [{ path: '/guides', breadcrumbName: 'Guides' }];
  }, []);

  const handleChangeTab = React.useCallback(key => {
    setActiveTab(key);
  }, []);

  const handleSubmit = React.useCallback(
    values => {
      const input = {
        ...values,
        orderNum: data?.getGuide.orderNum,
        actualTime: +new Date(),
      };
      const guideId = data?.getGuide.id;
      updateGuide({ variables: { input, guideId } });
    },
    [data, updateGuide],
  );

  const saveChanges = React.useCallback(() => {
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

  const changeNode = async (nextNode?: GuideStep | GuideStepSummary) => {
    if (nextNode) {
      setCurent(nextNode);
      const form = isStep(nextNode) ? stepForm : summaryForm;
      form.resetFields();
      form.setFieldsValue(nextNode);
    }
  };

  const requestChangeNode = (
    nextNode?: GuideStep | GuideStepSummary,
    changeCurrent?: (data: GuideStep | GuideStepSummary | undefined) => void,
  ) => {
    if (!current) {
      changeNode(nextNode);
      return;
    }

    const prevForm = isStep(current) ? stepForm : summaryForm;

    if (!prevForm.isFieldsTouched()) {
      changeNode(nextNode);
      if (changeCurrent) {
        changeCurrent(nextNode);
      }
      return;
    }

    Modal.confirm({
      title: (
        <span>
          If you switch to another tab without saving you will lose all data entered.
          Are you sure?
        </span>
      ),
      width: 640,
      okText: 'No, I need these data',
      cancelText: 'Yes',
      onOk: () => {
      },
      onCancel: () => {
        if (changeCurrent) {
          changeCurrent(nextNode);
        }
        changeNode(nextNode);
      },
    });
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
            {(Boolean(current) || activeTab === 1) && (
              <Button type="primary" loading={isSubmitting} onClick={saveChanges}>
                Save Changes
              </Button>
            )}
          </div>
        }
      />
      <Spin spinning={loading}>
        {formData ? (
          <>
            {Number(activeTab) === 1 && (
              <GuideForm
                mode="update"
                form={generalInfoForm}
                initialValues={formData}
                isSubmitting={updateGuideStatus.loading}
                onSubmit={handleSubmit}
              />
            )}
            {Number(activeTab) === 2 && (
              <Row gutter={[10, 10]}>
                <Col span={6}>
                  <TreeView
                    onChange={requestChangeNode}
                  />
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
          </>
        ) : (
          <Empty description="Guide has not been found." />
        )}
      </Spin>
    </>
  );
};

export default UpdateGuide;
