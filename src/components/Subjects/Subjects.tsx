import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Typography, Table, Button, Modal, message, Tabs } from 'antd';
import { MoreOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import Column from 'antd/lib/table/Column';

import { Subject } from 'core/models/generated';
import { FormValues } from 'core/models';
import { SubjectFragment } from 'core/graphql/fragments';
import { removeTypeName } from 'core/utils';

import Toolbar from 'components/Toolbar';
import CrudMenu from 'components/CrudMenu';

import CreateSubjectForm from './CreateSubjectForm';

import sty from './Subjects.module.scss';
import { GET_SUBJECTS_LIST } from 'components/ArticleForm';

const { TabPane } = Tabs;

const isEmptySubject = (subject: Subject) => {
  return ![subject.articles, subject.discoveries].some(arr => arr && arr.length);
};

export const CREATE_SUBJECT = gql`
  mutation CreateSubject($subject: CreateSubjectInput!) {
    createSubject(subject: $subject) {
      ...SubjectFragment
    }
  }
  ${SubjectFragment}
`;

export const UPDATE_SUBJECT = gql`
  mutation UpdateSubject($subject: UpdateSubjectInput!) {
    updateSubject(subject: $subject) {
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

  const { data, loading, refetch } = useQuery(GET_SUBJECTS_LIST);

  const [createSubject, createSubjectStatus] = useMutation(CREATE_SUBJECT, {
    onCompleted: () => {
      refetch();
      cancelCreating();
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
    return (activeTab === 'en' ? data?.enSubjects : data?.svSubjects) || [];
  }, [activeTab, data]);

  const startCreating = () => {
    setCreating(true);
  };

  const cancelCreating = () => {
    createForm.resetFields();
    setCreating(false);
  };

  const handleCreate = () => {
    createForm.validateFields().then((values: FormValues) => {
      createSubject({ variables: { subject: values } });
    });
  };

  const startUpdating = (subject: any) => {
    setEditableSubject(subject);
    updateForm.setFieldsValue(subject);
  };

  const cancelUpdating = () => {
    setEditableSubject(null);
    updateForm.resetFields();
  };

  const handleUpdate = () => {
    updateForm.validateFields().then((values: FormValues) => {
      updateSubject({
        variables: {
          subject: { ...removeTypeName(editableSubject), ...values },
        },
      });
    });
  };

  const deleteRequest = React.useCallback(
    (subject: any) => {
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
      <Button type="primary" icon={<PlusOutlined />} onClick={startCreating}>
        Create
      </Button>
    ),
    [],
  );

  return (
    <>
      <Toolbar
        title="Subject"
        footer={
          <div className={sty.pageHeader}>
            <Tabs defaultActiveKey={String(activeTab)} onChange={handleChangeTab}>
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
        <Column
          dataIndex="action"
          key="action"
          width={45}
          render={(_, record: Subject) => (
            <CrudMenu
              data={record}
              onEdit={startUpdating}
              onDelete={isEmptySubject(record) ? deleteRequest : undefined}
            >
              <Button type="text" icon={<MoreOutlined />} shape="circle" />
            </CrudMenu>
          )}
        />
      </Table>

      {/* Create Subject Modal */}
      <Modal
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
