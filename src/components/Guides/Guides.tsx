import React from 'react';
import { Space, Button, Table, Tag, Typography, Modal, message } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { PlusOutlined, MoreOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { getAudienceOptions, getEditionOptions } from 'core/utils';
import { DiscoveryFragment } from 'core/graphql/fragments';

import Toolbar from 'components/Toolbar';
import { Discovery } from 'core/models/generated';
import { Language } from 'core/global';
import CrudMenu from 'components/CrudMenu';
import DateTime from 'components/DateTime';
import Tags from 'components/Tags';

import sty from './Guides.module.scss';

const { Column } = Table;
const { Text } = Typography;

export const GET_GUIDES_LIST = gql`
  query GetDiscoveryList {
    getDiscoveryList {
      ...DiscoveryFragment
    }
  }
  ${DiscoveryFragment}
`;

export const DELETE_GUIDE = gql`
  mutation DeleteDiscovery($discoveryId: Int!) {
    deleteDiscovery(discoveryId: $discoveryId)
  }
`;

export interface GuidesProps {}

const Guides: React.FC<GuidesProps> = () => {
  const history = useHistory();

  const { data, loading, refetch } = useQuery(GET_GUIDES_LIST, {
    pollInterval: 10000,
  });

  const [deleteGuide, deleteGuideStatus] = useMutation(DELETE_GUIDE, {
    onCompleted: () => {
      message.success('Guide has been deleted.');
      refetch();
    },
  });

  const guides = React.useMemo(() => {
    return (data?.getDiscoveryList || []).reverse();
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

  const redirectToUpdate = (guide?: Discovery) => {
    if (guide) {
      history.push(`/guides/${guide.id}`);
    }
  };

  const actionButtons = React.useMemo(() => (
    <Link to="/guides/create">
      <Button type="primary" icon={<PlusOutlined />}>Create</Button>
    </Link>
  ), []);

  return (
    <>
      <Toolbar title="Guides" extra={actionButtons} />
      <Table rowKey="id" loading={loading} dataSource={guides as any}>
        <Column<Discovery>
          title="Title"
          dataIndex="title"
          key="title"
          width={200}
          render={(text, r) => <Link to={`/guides/${r.id}`}>{text}</Link>}
        />
        <Column
          title="Language"
          dataIndex="language"
          key="language"
          render={(key: Language) => <Tag>{key.toUpperCase()}</Tag>}
        />
        <Column
          title="Slug"
          dataIndex="link"
          key="link"
          render={text => <Link to={`/`}>/{text}</Link>}
        />
        <Column
          title="Editions"
          dataIndex="editions"
          key="editions"
          width={220}
          render={text => <Tags options={getEditionOptions(text)} color="magenta" />}
        />
        <Column
          title="Audiences"
          dataIndex="audiences"
          key="audiences"
          width={220}
          render={text => <Tags options={getAudienceOptions(text)} />}
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
        <Column<Discovery>
          dataIndex="actions"
          key="actions"
          width={45}
          render={(_, guide) => (
            <CrudMenu<Discovery>
              data={guide}
              onEdit={redirectToUpdate}
              onDelete={deleteRequest}
            >
              <Button type="text" icon={<MoreOutlined />} shape="circle" />
            </CrudMenu>
          )}
        />
      </Table>
    </>
  );
};

export default Guides;
