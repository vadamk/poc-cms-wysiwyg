import React from 'react';
import { gql } from 'apollo-boost';
import { Link, useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks'
import {
  Typography,
  Table,
  Button,
  Modal,
  Tag,
  Card,
  Row,
  Col,
  Space,
  Select,
  Spin,
  Dropdown,
  Menu,
  message,
} from 'antd';
import Column from 'antd/lib/table/Column';
import {
  ExclamationCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
} from '@ant-design/icons';

import { ArticleFragment } from 'graphql/fragments';
import Toolbar from 'components/Toolbar';
import EditionTags from 'components/EditionTags';
import { localStorageKeys } from 'global';
import AudienceTags from 'components/AudienceTags';
import { getFromLocalStorage, saveInLocalStorage } from 'services/browser';

const { Title, Text, Paragraph } = Typography;

const viewOptions = [
  { label: 'Cards', value: 'cards' },
  { label: 'Table', value: 'table' }
];

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

const Cards = ({ articles, isLoading, onDelete }) => (
  <Spin spinning={isLoading}>
    <Row gutter={[20, 20]}>
      {articles.map(article => (
        <Col key={article.id} span={6}>
          <Card
            cover={<img src={article.image} alt=""/>}
            actions={[
              <Link to={`/articles/${article.id}`}>
                <EditOutlined key="edit" />
              </Link>,
              <DeleteOutlined key="ellipsis" onClick={() => onDelete(article)} />,
            ]}
          >
            <Title level={4}>{article.title}</Title>
            <Space direction="vertical">
              <Paragraph ellipsis={{ rows: 3 }}>
                {article.subTitle}
              </Paragraph>
              {Boolean(article?.editions.length) && <Space align="start">
                <b>Editions:</b>
                <EditionTags items={article?.editions} />
              </Space>}
              <Space align="start">
                <b>Audiences:</b>
                <AudienceTags items={article?.audiences} />
              </Space>
            </Space>
            {/* <Card.Meta title={new Date(article.actualTime)} /> */}
          </Card>
        </Col>
      ))}
    </Row>
  </Spin>
);

const Articles: React.FC<ArticlesProps> = () => {
  const history = useHistory()

  const [viewMode, setViewMode] = React.useState(getFromLocalStorage(localStorageKeys.articlesView) || 'cards');
  const { data, loading, refetch } = useQuery(GET_ARTICLES_LIST);
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

  const handleChangeView = (value: string) => {
    console.log('value: ', value);
    setViewMode(value);
    saveInLocalStorage(localStorageKeys.articlesView, value);
  }

  const redirectToUpdate = (id: string) => {
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
        <Cards articles={articles} isLoading={loading} onDelete={deleteRequest} />
      ) : (
        <Table rowKey="id" loading={loading} dataSource={articles}>
          <Column
            title='Title'
            dataIndex='title'
            key='title'
            width={200}
            render={(text, { id }: any) => <Link to={`/articles/${id}`}>{text}</Link>}
          />
          <Column
            title="Subtitle"
            dataIndex="subTitle"
            key="subTitle"
          />
          <Column
            title="Editions"
            dataIndex="editions"
            key="editions"
            render={data => <EditionTags items={data} />}
          />
          <Column
            title="Audiences"
            dataIndex="audiences"
            key="audiences"
            render={data => <AudienceTags items={data} />}
          />
          <Column
            dataIndex="actions"
            key="actions"
            width={45}
            render={(_, record: any) => (
              <Dropdown
                trigger={['click']}
                overlay={() => (
                  <Menu>
                    <Menu.Item
                      icon={<EditOutlined />}
                      onClick={() => redirectToUpdate(record.id)}
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
                )}
              >
                <MoreOutlined />
              </Dropdown>
            )}
          />
        </Table>
      )}
      

    </>
  );
};

export default Articles;
