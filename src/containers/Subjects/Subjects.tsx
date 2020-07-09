import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks'
import { TableRowSelection, ColumnsType } from 'antd/lib/table/interface';
import {
  Typography,
  Table,
  Breadcrumb,
  Button,
  Dropdown,
  Menu,
  Modal,
  notification,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';

import { SubjectFragment } from 'graphql/fragments';
import { FormValues } from 'models';
import { removeTypeName } from 'utils';

import CreateSubjectForm from './CreateSubjectForm';

export const GET_SUBJECTS_LIST = gql`
  query GetSubjectList {
    getSubjectList {
      ...SubjectFragment
    }
  }
  ${SubjectFragment}
`;

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

export interface SubjectsProps {}

const Subjects: React.FC<SubjectsProps> = () => {
  const [isCreating, setCreating] = React.useState(false);
  const [editableSubject, setEditableSubject] = React.useState<any>(null);

  const [createForm] = useForm();
  const [updateForm] = useForm();

  const { data, loading, refetch } = useQuery(GET_SUBJECTS_LIST);
  
  const [createSubject, createSubjectStatus] = useMutation(CREATE_SUBJECT, {
    onCompleted: () => {
      refetch();
      cancelCreating();
      notification.success({
        message: 'Success',
        description: 'Subject has been created.',
      });
    },
  });

  const [updateSubject, updateSubjectStatus] = useMutation(UPDATE_SUBJECT, {
    onCompleted: () => {
      refetch();
      cancelUpdating();
      notification.success({
        message: 'Success',
        description: 'Subject has been updated.',
      });
    },
  });

  const subjects = React.useMemo(() => {
    return (data?.getSubjectList || []).reverse()
  }, [data]);

  const startCreating = () => {
    setCreating(true);
  }

  const cancelCreating = () => {
    createForm.resetFields();
    setCreating(false);
  }

  const handleCreate = () => {
    createForm
      .validateFields()
      .then((values: FormValues) => {
        createSubject({ variables: { subject: values } });
      });
  }

  const startUpdating = (subject: any) => {
    setEditableSubject(subject);
  }

  const cancelUpdating = () => {
    updateForm.resetFields();
    setEditableSubject(null);
  }

  const handleUpdate = () => {
    updateForm
      .validateFields()
      .then((values: FormValues) => {
        updateSubject({ variables: {
          subject: { ...removeTypeName(editableSubject), ...values},
        }});
      });
  }

  const deleteRequest = (subject: any) => {
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
      onOk: () => {
        console.log('OK');
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  }

  const columns = React.useMemo<ColumnsType<never>>(() => {
    return [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        width: 200,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <Dropdown trigger={['click']} overlay={() => (
            <Menu>
              <Menu.Item
                icon={<EditOutlined />}
                onClick={() => startUpdating(record)}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                icon={<DeleteOutlined />}
                onClick={() => deleteRequest(record)}
              >
                Delete
              </Menu.Item>
            </Menu>
          )}>
            <MoreOutlined />
          </Dropdown>
        )
      },
    ];
  }, []);

  return (
    <>
      <div className='toolbar'>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/">Dashboard</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            Subjects
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className='buttons'>
          <Button onClick={startCreating}>Create</Button>
        </div>
      </div>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={subjects}
        columns={columns}
      />

      {/* Create Subject Modal */}
      <Modal
        title="Create a new subject"
        visible={isCreating}
        okText="Create"
        okButtonProps={{ loading: createSubjectStatus.loading }}
        onOk={handleCreate}
        onCancel={cancelCreating}
      >
        <CreateSubjectForm
          form={createForm}
          isSubmitting={createSubjectStatus.loading}
        />
      </Modal>

      {/* Update Subject Modal */}
      <Modal
        title="Update Subject"
        visible={Boolean(editableSubject)}
        okText="Update"
        okButtonProps={{ loading: updateSubjectStatus.loading }}
        onOk={handleUpdate}
        onCancel={cancelUpdating}
      >
        <CreateSubjectForm
          form={updateForm}
          initialValues={editableSubject || {}}
          isSubmitting={createSubjectStatus.loading}
        />
      </Modal>
    </>
  );
};

export default Subjects;
