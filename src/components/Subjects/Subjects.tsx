import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks'
import {
  Typography,
  Table,
  Button,
  Modal,
  Tag,
  message,
} from 'antd';
import {
  MoreOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import Column from 'antd/lib/table/Column';

import { Language } from 'core/global';
import { GetSubjectListQuery } from 'core/models/generated';
import { FormValues } from 'core/models';
import { SubjectFragment } from 'core/graphql/fragments';
import { removeTypeName } from 'core/utils';

import Toolbar from 'components/Toolbar';
import CrudMenu from 'components/CrudMenu';

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

export const DELETE_SUBJECT = gql`
  mutation DeleteSubject($subjectId: Int!) {
    deleteSubject(subjectId: $subjectId)
  }
`;

export interface SubjectsProps {}

const Subjects: React.FC<SubjectsProps> = () => {
  const [isCreating, setCreating] = React.useState(false);
  const [editableSubject, setEditableSubject] = React.useState<any>(null);

  const [createForm] = useForm();
  const [updateForm] = useForm();

  const { data, loading, refetch } = useQuery<GetSubjectListQuery>(GET_SUBJECTS_LIST);

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
    updateForm.setFieldsValue(subject);
  }

  const cancelUpdating = () => {
    setEditableSubject(null);
    updateForm.resetFields();
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

  const deleteRequest = React.useCallback((subject: any) => {
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
  }, [deleteSubject, deleteSubjectStatus.loading])

  return (
    <>
      <Toolbar title="Subject">
        <Button icon={<PlusOutlined />} onClick={startCreating}>Create</Button>
      </Toolbar>
      <Table<any>
        rowKey="id"
        loading={loading}
        dataSource={subjects}
      >
        <Column title="Title" dataIndex="title" key="title" width={200} />
        <Column
          title="Language"
          dataIndex="language"
          key="language"
          render={(key: Language) => (
            <Tag>{key.toUpperCase()}</Tag>
          )}
        />
        <Column title="Description" dataIndex="description" key="description" />
        <Column
          dataIndex="action"
          key="action"
          width={45}
          render={(_, record) => (
            <CrudMenu data={record} onEdit={startUpdating} onDelete={deleteRequest}>
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
        <CreateSubjectForm
          form={createForm}
          isSubmitting={createSubjectStatus.loading}
        />
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
        <CreateSubjectForm
          form={updateForm}
          isSubmitting={createSubjectStatus.loading}
        />
      </Modal>
    </>
  );
};

export default Subjects;
