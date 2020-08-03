import React from 'react';
import { Button, Table, Tag, Typography, Modal, message, Badge } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { PlusOutlined, MoreOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { getEditionOptions, getSubjectsOptions } from 'core/utils';
import { GuideFragment } from 'core/graphql/fragments';

import Toolbar from 'components/Toolbar';
import { Language } from 'core/global';
import CrudMenu from 'components/CrudMenu';
import DateTime from 'components/DateTime';
import Tags from 'components/Tags';

import sty from './Guides.module.scss';

const { Column } = Table;
const { Text } = Typography;

export const GET_GUIDES = gql`
  query GetGuides {
    getGuides {
      ...GuideFragment
    }
  }
  ${GuideFragment}
`;

export const DELETE_GUIDE = gql`
  mutation DeleteGuide($guideId: Int!) {
    deleteGuide(guideId: $guideId)
  }
`;

export interface GuidesProps {}

const Guides: React.FC<GuidesProps> = () => {
  const history = useHistory();

  const { data, loading, refetch } = useQuery(GET_GUIDES, {
    pollInterval: 10000,
  });

  const [deleteGuide, deleteGuideStatus] = useMutation(DELETE_GUIDE, {
    onCompleted: () => {
      message.success('Guide has been deleted.');
      refetch();
    },
  });

  const guides = React.useMemo(() => {
    return (data?.getGuides || []).sort((a, b) => b?.actualTime - a?.actualTime);
  }, [data]);

  const deleteRequest = (guide: any) => {
    Modal.confirm({
      title: (
        <span>
          Are you sure you want to delete <Text mark>{guide.title}</Text>?
        </span>
      ),
      icon: <ExclamationCircleOutlined />,
      width: 640,
      okText: 'Delete',
      okButtonProps: { loading: deleteGuideStatus.loading },
      onOk: () => {
        deleteGuide({ variables: { guideId: guide.id } });
      },
    });
  };

  const redirectToUpdate = (guide?) => {
    if (guide) {
      history.push(`/guides/${guide.id}`);
    }
  };

  const actionButtons = React.useMemo(
    () => (
      <Link to="/guides/create">
        <Button type="primary" icon={<PlusOutlined />}>
          Create
        </Button>
      </Link>
    ),
    [],
  );

  return (
    <>
      <Toolbar title="Guides" extra={actionButtons} />
      <Table rowKey="id" loading={loading} dataSource={guides as any} pagination={false}>
        <Column
          title="Title"
          dataIndex="title"
          key="title"
          width={200}
          render={(text, r: any) => <Link to={`/guides/${r.id}`}>{text}</Link>}
        />
        <Column
          title="Language"
          dataIndex="language"
          key="language"
          width={100}
          render={(key: Language) => <Tag>{key.toUpperCase()}</Tag>}
        />
        <Column
          title="Visibility"
          dataIndex="isPublished"
          key="isPublished"
          width={120}
          render={isPublished => (
            <>
              <Badge status={isPublished ? 'success' : 'default'} />
              {isPublished ? 'Public' : 'Private'}
            </>
          )}
        />
        <Column
          title="Edited"
          dataIndex="actualTime"
          key="actualTime"
          width={160}
          render={text => (
            <Text type="secondary" className={sty.dateTime}>
              <DateTime timestamp={text} />
            </Text>
          )}
        />
        <Column
          title="Subjects"
          dataIndex="subjects"
          key="subjects"
          width={220}
          render={subjects => <Tags options={getSubjectsOptions(subjects)} />}
        />
        <Column
          title="Editions"
          dataIndex="editions"
          key="editions"
          width={220}
          render={text => <Tags options={getEditionOptions(text)} color="magenta" />}
        />
        <Column
          dataIndex="actions"
          key="actions"
          width={45}
          render={(_, guide) => (
            <CrudMenu data={guide} onEdit={redirectToUpdate} onDelete={deleteRequest}>
              <Button type="text" icon={<MoreOutlined />} shape="circle" />
            </CrudMenu>
          )}
        />
      </Table>
    </>
  );
};

export default Guides;
