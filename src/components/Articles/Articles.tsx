import React from 'react';
import { gql } from 'apollo-boost';
import { Link, useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks'
import {
  Typography,
  Table,
  Button,
  Modal,
  Space,
  Select,
  message,
  Tag,
} from 'antd';
import Column from 'antd/lib/table/Column';
import {
  ExclamationCircleOutlined,
  PlusOutlined,
  MoreOutlined,
} from '@ant-design/icons';

import { getFromLocalStorage, saveInLocalStorage } from 'services/browser';
import { ArticleFragment } from 'core/graphql/fragments';
import {
  localStorageKeys,
  audienceOptions,
  editionOptions,
  Language,
} from 'core/global';

import Toolbar from 'components/Toolbar';
import Tags from 'components/Tags';
import DateTime from 'components/DateTime';
import CrudMenu from 'components/CrudMenu';

import CardsView from './CardsView';

import sty from './Articles.module.scss';

const { Text, Paragraph } = Typography;

enum ViewMode {
  CARDS = 'cards',
  TABLE = 'table',
}

const viewOptions = [
  { label: 'Cards', value: ViewMode.CARDS },
  { label: 'Table', value: ViewMode.TABLE }
];

export const getAudienceOptions = (audience: { type: string }[]) => {
  const audienceTypes = audience.map(ad => ad.type);
  return audienceOptions.filter(o => audienceTypes.includes(o.value));
}

export const getEditionsOptions = (editions: { type: string }[]) => {
  const editionTypes = editions.map(ed => ed.type);
  return editionOptions.filter(o => editionTypes.includes(o.value));
}

export const GET_ARTICLES_LIST = gql`
  query GetArticleList {
    getArticleList {
      ...ArticleFragment
    }
  }
  ${ArticleFragment}
`;

export const DELETE_ARTICLE = gql`
  mutation DeleteArticle($articleId: Int!) {
    deleteArticle(articleId: $articleId)
  }
`;

export interface ArticlesProps {}

const Articles: React.FC<ArticlesProps> = () => {
  const history = useHistory()

  const [viewMode, setViewMode] = React.useState<ViewMode>(ViewMode.TABLE);
  const { data, loading, refetch } = useQuery(GET_ARTICLES_LIST, {
    pollInterval: 10000,
  });

  React.useEffect(() => {
    setViewMode(getFromLocalStorage(localStorageKeys.articlesView) || ViewMode.TABLE);
  }, []);

  const [deleteArticle, deleteArticleStatus] = useMutation(DELETE_ARTICLE, {
    onCompleted: () => {
      message.success('Article has been deleted.');
      refetch();
    }
  });

  const articles = React.useMemo(() => {
    return (data?.getArticleList || []).reverse()
  }, [data]);

  const deleteRequest = (article: any) => {
    Modal.confirm({
      title: (
        <span>
          Are you sure you want to delete{' '}
          <Text mark>{article.title}</Text>?
        </span>
      ),
      icon: <ExclamationCircleOutlined />,
      width: 640,
      okText: 'Delete',
      okButtonProps: { loading: deleteArticleStatus.loading },
      onOk: () => {
        deleteArticle({ variables: { articleId: article.id } })
      },
    });
  }

  const handleChangeView = (value: ViewMode) => {
    setViewMode(value);
    saveInLocalStorage(localStorageKeys.articlesView, value);
  }

  const redirectToUpdate = ({ id }: { id: string }) => {
    history.push(`/articles/${id}`);
  }

  return (
    <>
      <Toolbar title="Articles">
        <Space>
          <Select
            value={viewMode}
            options={viewOptions}
            onChange={handleChangeView}
          /> 
          <Link to="/articles/create">
            <Button icon={<PlusOutlined />}>Create</Button>
          </Link>
        </Space>
      </Toolbar>
      
      {viewMode === 'cards' ? (
        <CardsView
          articles={articles}
          isLoading={loading}
          onEdit={redirectToUpdate}
          onDelete={deleteRequest}
        />
      ) : (
        <Table
          rowKey="id"
          loading={loading}
          dataSource={articles}
        >
          <Column
            title='Title'
            dataIndex='title'
            key='title'
            width={200}
            render={(text, r: any) => <Link to={`/articles/${r.id}`}>{text}</Link>}
          />
          <Column
            title="Language"
            dataIndex="language"
            key="language"
            render={(key: Language) => (
              <Tag>{key.toUpperCase()}</Tag>
            )}
          />
          <Column
            title="Subtitle"
            dataIndex="subTitle"
            key="subTitle"
            render={data => (
              <Paragraph ellipsis={{ rows: 3 }}>
                {data}
              </Paragraph>
            )}
          />
          <Column
            title="Editions"
            dataIndex="editions"
            key="editions"
            width={220}
            render={data => <Tags options={getEditionsOptions(data)}  color="magenta" />}
          />
          <Column
            title="Audiences"
            dataIndex="audiences"
            key="audiences"
            width={220}
            render={data => <Tags options={getAudienceOptions(data)} />}
          />
          <Column
            title="Edited"
            dataIndex="actualTime"
            key="actualTime"
            width={160}
            render={data => (
              <Text type="secondary" className={sty.dateTime}>
                <DateTime timestamp={data} />
              </Text>
            )}
          />
          <Column
            dataIndex="actions"
            key="actions"
            width={45}
            render={(_, article: any) => (
              <CrudMenu data={article} onEdit={redirectToUpdate} onDelete={deleteRequest}>
                <Button type="text" icon={<MoreOutlined />} shape="circle" />
              </CrudMenu>
            )}
          />
        </Table>
      )}
      

    </>
  );
};

export default Articles;
