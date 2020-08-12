import React from 'react';
import { gql } from 'apollo-boost';
import { Link, useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Typography, Table, Button, Modal, Space, message, Tag, Badge } from 'antd';
import Column from 'antd/lib/table/Column';
import { ExclamationCircleOutlined, PlusOutlined, MoreOutlined } from '@ant-design/icons';

import {
  DeleteArticleMutation,
  DeleteArticleMutationVariables,
  Article,
} from 'core/models/generated';
import { getFromLocalStorage, saveInLocalStorage } from 'core/services/browser';
import { ArticleFragment } from 'core/graphql/fragments';
import { localStorageKeys, Language } from 'core/global';
import { getEditionOptions, getSubjectsOptions, basicReorder } from 'core/utils';
import { RadioChangeEvent } from 'antd/lib/radio';

import Toolbar from 'components/Toolbar';
import Tags from 'components/Tags';
import DateTime from 'components/DateTime';
import CrudMenu from 'components/CrudMenu';
import RadioButtons from 'components/RadioButtons';

import DragableBodyRow from './DragableBodyRow';
import CardsView from './CardsView';

import sty from './Articles.module.scss';

const { Text, Paragraph } = Typography;

enum ViewMode {
  CARDS = 'cards',
  TABLE = 'table',
}

const viewOptions = [
  { label: 'Cards', value: ViewMode.CARDS },
  { label: 'Table', value: ViewMode.TABLE },
];

export const GET_ARTICLES = gql`
  query GetArticles {
    getArticles {
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

export const SET_ARTICLES_ORDER = gql`
  mutation SortArticles($order: [OrderArticleInput!]!) {
    sortArticles(order: $order)
  }
`;

export interface ArticlesProps {}

const Articles: React.FC<ArticlesProps> = () => {
  const history = useHistory();

  const [viewMode, setViewMode] = React.useState<ViewMode>(ViewMode.TABLE);
  const [articles, setArticles] = React.useState<any[]>([]);

  const { data, loading, refetch } = useQuery(GET_ARTICLES, {
    pollInterval: 10000,
  });

  React.useEffect(() => {
    setViewMode(getFromLocalStorage(localStorageKeys.articlesView) || ViewMode.TABLE);
  }, []);

  React.useEffect(() => {
    if (data) {
      setArticles(data?.getArticles || [])
    }
  }, [data]);

  const [deleteArticle, deleteArticleStatus] = useMutation<
    DeleteArticleMutation,
    DeleteArticleMutationVariables
  >(DELETE_ARTICLE, {
    onCompleted: () => {
      message.success('Article has been deleted.');
      refetch();
    },
  });

  const [setArticlesOrder, setArticlesOrderStatus] = useMutation(SET_ARTICLES_ORDER, {
    refetchQueries: [{ query: GET_ARTICLES }]
  });

  const requestDelete = (article: any) => {
    Modal.confirm({
      title: (
        <span>
          Are you sure you want to delete <Text mark>{article.title}</Text>?
        </span>
      ),
      icon: <ExclamationCircleOutlined />,
      width: 640,
      okText: 'Delete',
      okButtonProps: { loading: deleteArticleStatus.loading },
      onOk: () => {
        deleteArticle({ variables: { articleId: article.id } });
      },
    });
  };

  const handleChangeView = ({ target }: RadioChangeEvent) => {
    setViewMode(target.value);
    saveInLocalStorage(localStorageKeys.articlesView, target.value);
  };

  const redirectToUpdate = (article?: Article) => {
    if (article) {
      history.push(`/articles/${article.id}`);
    }
  };

  const actionButtons = React.useMemo(
    () => (
      <Space>
        <RadioButtons
          value={viewMode}
          options={viewOptions}
          onChange={handleChangeView}
        />
        <Link to="/articles/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Create
          </Button>
        </Link>
      </Space>
    ),
    [viewMode],
  );

  const moveRow = React.useCallback((dragIndex: number, hoverIndex: number) => {
    const nextArticles = basicReorder(articles, dragIndex, hoverIndex);
    setArticles(nextArticles);

    const order = nextArticles.map((article, index) => ({
      id: article.id,
      orderNum: index + 1,
    }));

    setArticlesOrder({ variables: { order } })
  }, [articles, setArticlesOrder]);

  return (
    <>
      <Toolbar title="Articles" extra={actionButtons} />

      {viewMode === 'cards' ? (
        <CardsView
          articles={articles}
          isLoading={loading}
          onEdit={redirectToUpdate}
          onDelete={requestDelete}
        />
      ) : (
        <Table
          rowKey="id"
          loading={loading || setArticlesOrderStatus.loading}
          dataSource={articles as any}
          pagination={false}
          components={{ body: { row: DragableBodyRow } }}
          onRow={(record, index) => ({
            index,
            moveRow,
          }) as any}
        >
          <Column<Article>
            title="Title"
            dataIndex="title"
            key="title"
            width={200}
            render={(text, r) => (
              <Text ellipsis style={{ width: 200 }}>
                <Link to={`/articles/${r.id}`}>{text}</Link>
              </Text>
            )}
          />
          <Column
            title="Language"
            dataIndex="language"
            key="language"
            render={(key: Language) => <Tag>{key.toUpperCase()}</Tag>}
          />
          <Column
            title="Subtitle"
            dataIndex="subTitle"
            key="subTitle"
            render={text => <Paragraph ellipsis={{ rows: 3 }}>{text}</Paragraph>}
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
          <Column<Article>
            dataIndex="actions"
            key="actions"
            width={45}
            render={(_, article) => (
              <CrudMenu<Article>
                data={article}
                onEdit={redirectToUpdate}
                onDelete={requestDelete}
              >
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
