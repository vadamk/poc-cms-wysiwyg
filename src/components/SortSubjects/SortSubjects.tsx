import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { Row, Col, Typography, Spin, Empty } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';

import { getAudienceOptions, getSubjectsOptions, basicReorder } from 'core/utils';
import { SubjectFragment } from 'core/graphql/fragments';
import { Option } from 'core/models';
import { Subject } from 'core/models/generated';

import Toolbar, { Breadcrumb } from 'components/Toolbar';
import TreeViewNode from 'components/TreeViewNode';
import DndCard from 'components/DndCard';

// import sty from './SortSubjects.module.scss';

const { Title } = Typography;

export const GET_AUDIENCES = gql`
  query GetAudiencesForBothLang {
    enAudiences: getAudiences(language: "en") {
      id
      title
      language
    }
    svAudiences: getAudiences(language: "sv") {
      id
      title
      language
    }
  }
`;

export const GET_AUDIENCE_SUBJECTS = gql`
  query GetAudienceSubjects($audienceId: Int!) {
    getAudienceSubjects(audienceId: $audienceId) {
      ...SubjectFragment
    }
  }
  ${SubjectFragment}
`;

export const SET_SUBJECTS_ORDER = gql`
  mutation SortSubjects($order: [OrderSubjectInput!]!, $audienceId: Int!) {
    sortSubjects(order: $order, audienceId: $audienceId)
  }
`;

export interface SortSubjectsProps {}

const SortSubjects: React.FC<SortSubjectsProps> = () => {
  const [subjectOptions, setSubjectOptions] = React.useState<Option[]>([]);
  const [audienceOptions, setAudienceOptions] = React.useState<Option[]>([]);
  const [currentId, setCurrentId] = React.useState<number>();

  const getAudiencesStatus = useQuery(GET_AUDIENCES, {
    onCompleted: data => {
      if (!data) {
        return;
      }

      const audiences = [...data.svAudiences, ...data.enAudiences];
      const options = getAudienceOptions(audiences) || [];

      setAudienceOptions(options);
      setCurrentId(options[0].value as number);
    }
  });

  const [getSubjects, getSubjectsStatus] = useLazyQuery(GET_AUDIENCE_SUBJECTS);

  React.useEffect(() => {
    if (currentId) {
      getSubjects({ variables: { audienceId: currentId } });
    }
  }, [currentId, getSubjects]);

  React.useEffect(() => {
    if (getSubjectsStatus.data) {
      const { getAudienceSubjects: subjects } = getSubjectsStatus.data;
      setSubjectOptions(
        getSubjectsOptions(subjects)
      );
    }
  }, [getSubjectsStatus.data]);

  const [setSubjectOrder, setSubjectOrderStatus] = useMutation(SET_SUBJECTS_ORDER, {
    refetchQueries: [{
      query: GET_AUDIENCE_SUBJECTS,
      variables: { audienceId: currentId }
    }]
  });

  const breadcrumbs = React.useMemo<Breadcrumb[]>(() => {
    return [{ path: '/Subjects', breadcrumbName: 'Subjects' }];
  }, []);

  const moveSubject = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setSubjectOptions(
        basicReorder(subjectOptions, dragIndex, hoverIndex)
      );
    },
    [subjectOptions],
  );

  const dropSubject = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const nextSubjectOptions = basicReorder(subjectOptions, dragIndex, hoverIndex);
      setSubjectOptions(nextSubjectOptions);

      const order = nextSubjectOptions.map((subject, index) => ({
        id: subject.value,
        orderNum: index + 1,
      }));

      setSubjectOrder({ variables: { order, audienceId: currentId } });
    },
    [currentId, setSubjectOrder, subjectOptions],
  );

  return (
    <>
      <Toolbar title="Sort Subjects" breadcrumbs={breadcrumbs} />
      <Spin spinning={getAudiencesStatus.loading}>
        {getAudiencesStatus.data && (
          <>
            <Row gutter={[24, 10]}>
              <Col offset={4} span={6}>
                <Title level={4}>Needs</Title>
              </Col>
              <Col span={9}>
                <Title level={4}>Subjects</Title>
              </Col>
            </Row>
            <Row gutter={[0, 40]}>
              <Col offset={4} span={6}>
                <div style={{ display: 'flex', position: 'sticky', top: '120px' }}>
                  <div style={{ flexGrow: 1 }}>
                    {audienceOptions.map(audience => (
                      <TreeViewNode
                        key={audience.value as number}
                        isActive={audience.value === currentId}
                        title={audience.label}
                        onClick={() => setCurrentId(audience.value as number)}
                      />
                    ))}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexBasis: '48px',
                    color: '#b3b3b3'
                  }}>
                    <DoubleRightOutlined />
                  </div>
                </div>
              </Col>
              <Col span={9}>
                <Spin spinning={setSubjectOrderStatus.loading || getSubjectsStatus.loading}>
                  {subjectOptions.length 
                    ? subjectOptions.map((audience, index) => (
                      <DndCard
                        key={audience.value + String(audience.index)}
                        id={audience.value}
                        index={index}
                        originalIndex={audience.index as number}
                        type={String(currentId)}
                        moveCard={moveSubject}
                        onDrop={dropSubject}
                      >
                        <TreeViewNode
                          size="lg"
                          showHandle
                          title={audience.label}
                        />
                      </DndCard>
                    ))
                    : <Empty description="No Subjects" />
                  }
                </Spin>
              </Col>
            </Row>
          </>
        )}
      </Spin>
    </>
  );
};

export default SortSubjects;
