import React from 'react';
import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Typography, Table, Button, Modal, message, Tabs, Space } from 'antd';
import {
  MoreOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import Column from 'antd/lib/table/Column';

import { Subject } from 'core/models/generated';
import { FormValues } from 'core/models';
import { SubjectFragment } from 'core/graphql/fragments';
import { getAudienceOptions } from 'core/utils';

import Toolbar from 'components/Toolbar';
import CrudMenu from 'components/CrudMenu';
import { GET_SUBJECTS } from 'components/ArticleForm';

import CreateSubjectForm from './CreateSubjectForm';

import sty from './Subjects.module.scss';
import Tags from 'components/Tags';

const { TabPane } = Tabs;

export const CREATE_SUBJECT = gql`
  mutation CreateSubject($input: CreateSubjectInput!) {
    createSubject(input: $input) {
      ...SubjectFragment
    }
  }
  ${SubjectFragment}
`;

export const UPDATE_SUBJECT = gql`
  mutation UpdateSubject($input: UpdateSubjectInput!, $subjectId: Int!) {
    updateSubject(input: $input, subjectId: $subjectId) {
      ...SubjectFragment
    }
  }
  ${SubjectFragment}
`;

export const DELETE_SUBJECT = gql`
  mutation DeleteSubject($subjectId: Int!) {
    deleteSubject(subjectId: $subjectId)
  }
`;

export interface SubjectsProps {}

const Subjects: React.FC<SubjectsProps> = () => {
  const [isCreating, setCreating] = React.useState(false);
  const [editableSubject, setEditableSubject] = React.useState<any>(null);
  const [activeTab, setActiveTab] = React.useState<'sv' | 'en'>('sv');

  const [createForm] = useForm();
  const [updateForm] = useForm();

  const { data, loading, refetch } = useQuery(GET_SUBJECTS);

  const [createSubject, createSubjectStatus] = useMutation(CREATE_SUBJECT, {
    onCompleted: ({ createSubject: { language } }) => {
      refetch();
      cancelCreating();
      setActiveTab(language);
      message.success('Subject has been created.');
    },
  });

  const [updateSubject, updateSubjectStatus] = useMutation(UPDATE_SUBJECT, {
    onCompleted: () => {
      refetch();
      cancelUpdating();
      message.success('Subject has been updated.');
    },
  });

  const [deleteSubject, deleteSubjectStatus] = useMutation(DELETE_SUBJECT, {
    onCompleted: () => {
      refetch();
      cancelUpdating();
      message.success('Subject has been deleted.');
    },
  });

  const subjects = React.useMemo(() => {
    return (activeTab === 'en' ? data?.enSubjects : data?.svSubjects)?.reverse() || [];
  }, [activeTab, data]);

  const startCreating = React.useCallback(() => {
    setCreating(true);
  }, []);

  const cancelCreating = () => {
    createForm.resetFields();
    setCreating(false);
  };

  const handleCreate = () => {
    createForm.validateFields().then((values: FormValues) => {
      createSubject({ variables: { input: values } });
    });
  };

  const startUpdating = (subject: any) => {
    setEditableSubject(subject);
    const { audiences, ...rest } = subject;
    updateForm.setFieldsValue({ audienceIDs: audiences.map(a => a.id), ...rest });
  };

  const cancelUpdating = () => {
    setEditableSubject(null);
    updateForm.resetFields();
  };

  const handleUpdate = () => {
    updateForm.validateFields().then((values: FormValues) => {
      const { id: subjectId } = editableSubject;
      updateSubject({
        variables: {
          input: values,
          subjectId,
        },
      });
    });
  };

  const requestDelete = React.useCallback(
    (subject?: Subject) => {
      if (!subject) {
        console.error('No Subject to delete');
        return;
      }

      const { articles, guides } = subject;

      if (articles.length !== 0 || guides.length !== 0) {
        Modal.warn({
          title: (
            <span>
              You can not delete this subjects!{' '}
              This subject is assigned to articles or guides.
              <Typography.Text mark>{subject.title}</Typography.Text>?
            </span>
          ),
        });

        return;
      }

      Modal.confirm({
        title: (
          <span>
            Are you sure you want to delete{' '}
            <Typography.Text mark>{subject.title}</Typography.Text>?
          </span>
        ),
        icon: <ExclamationCircleOutlined />,
        width: 640,
        okText: 'Delete',
        okButtonProps: { loading: deleteSubjectStatus.loading },
        onOk: () => {
          deleteSubject({ variables: { subjectId: subject.id } });
        },
      });
    },
    [deleteSubject, deleteSubjectStatus.loading],
  );

  const handleChangeTab = React.useCallback(key => {
    setActiveTab(key);
  }, []);

  const actionButtons = React.useMemo(
    () => (
      <Space style={{ marginBottom: '5px' }}>
        <Link to="/subjects/sort">
          <Button icon={<SortAscendingOutlined />}>
            Sort Subjects
          </Button>
        </Link>
        <Button type="primary" icon={<PlusOutlined />} onClick={startCreating}>
          Create
        </Button>
      </Space>
    ),
    [startCreating],
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
        <Column
          dataIndex="action"
          key="action"
          width={45}
          render={(_, subject: Subject) => (
            <CrudMenu
              data={subject}
              onEdit={startUpdating}
              onDelete={requestDelete}
            >
              <Button type="text" icon={<MoreOutlined />} shape="circle" />
            </CrudMenu>
          )}
        />
      </Table>

      {/* Create Subject Modal */}
      <Modal
        destroyOnClose
        style={{ top: 30 }}
        width={640}
        title="Create a new subject"
        visible={isCreating}
        okText="Create"
        okButtonProps={{ loading: createSubjectStatus.loading }}
        onOk={handleCreate}
        onCancel={cancelCreating}
      >
        <CreateSubjectForm form={createForm} isSubmitting={createSubjectStatus.loading} />
      </Modal>

      {/* Update Subject Modal */}
      <Modal
        style={{ top: 30 }}
        width={640}
        title="Update Subject"
        visible={Boolean(editableSubject)}
        okText="Update"
        okButtonProps={{ loading: updateSubjectStatus.loading }}
        onOk={handleUpdate}
        onCancel={cancelUpdating}
      >
        <CreateSubjectForm form={updateForm} isSubmitting={createSubjectStatus.loading} />
      </Modal>
    </>
  );
};

export default Subjects;
