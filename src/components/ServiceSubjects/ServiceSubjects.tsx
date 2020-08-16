import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Table, Button, Tabs, Space } from 'antd';
import { SortAscendingOutlined } from '@ant-design/icons';
import Column from 'antd/lib/table/Column';

import { ServiceSubjectFragment } from 'core/graphql/fragments';
import { Subject } from 'core/models/generated';
import { Language } from 'core/models';
import { getAudienceOptions } from 'core/utils';

import Toolbar from 'components/Toolbar';
import Tags from 'components/Tags';

import sty from './ServiceSubjects.module.scss';

const { TabPane } = Tabs;

const GET_SERVICE_SUBJECTS = gql`
  query ServiceSubjects {
    enSubjects: getServiceSubjects(language: "en") {
      ...ServiceSubjectFragment
    }
    svSubjects: getServiceSubjects(language: "sv") {
      ...ServiceSubjectFragment
    }
  }
  ${ServiceSubjectFragment}
`;

export interface SubjectsProps {}

const Subjects: React.FC<SubjectsProps> = () => {
  const [activeTab, setActiveTab] = React.useState<'sv' | 'en'>('sv');

  const { data, loading } = useQuery(GET_SERVICE_SUBJECTS);
  console.log('data: ', data);

  const subjects = React.useMemo(() => {
    return (activeTab === Language.EN ? data?.enSubjects : data?.svSubjects)?.reverse() || [];
  }, [activeTab, data]);

  const handleChangeTab = React.useCallback(key => {
    setActiveTab(key);
  }, []);

  const actionButtons = React.useMemo(
    () => (
      <Space style={{ marginBottom: '5px' }}>
        <Link to="/service-subjects/sort">
          <Button icon={<SortAscendingOutlined />}>
            Sort Subjects
          </Button>
        </Link>
      </Space>
    ),
    [],
  );

  return (
    <>
      <Toolbar
        title="Subject"
        footer={
          <div className={sty.pageHeader}>
            <Tabs activeKey={String(activeTab)} onChange={handleChangeTab}>
              <TabPane tab="Swedish" key="sv" />
              <TabPane tab="English" key="en" />
            </Tabs>
            {actionButtons}
          </div>
        }
      />
      <Table<Subject>
        rowKey="id"
        loading={loading}
        pagination={false}
        dataSource={subjects as Subject[]}
      >
        <Column title="Title" dataIndex="title" key="title" width={200} />
        <Column title="Description" dataIndex="description" key="description" />
        {activeTab === 'sv' && (
          <Column
            title="Audiences"
            dataIndex="audiences"
            key="audiences"
            width={220}
            render={text => <Tags options={getAudienceOptions(text)} />}
          />
        )}
      </Table>
    </>
  );
};

export default Subjects;
