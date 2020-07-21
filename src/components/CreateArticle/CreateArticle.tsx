import React from 'react';
import { message, Button } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import { ArticleFragment } from 'core/graphql/fragments';

import Toolbar, { Breadcrumb } from 'components/Toolbar';
import ArticleForm from 'components/ArticleForm';
import { GET_ARTICLES_LIST } from 'components/Articles';

export const CREATE_ARTICLE = gql`
  mutation CreateArticle($article: CreateArticleInput!) {
    createArticle(article: $article) {
      ...ArticleFragment
    }
  }
  ${ArticleFragment}
`;

export interface CreateArticleProps {}

const CreateArticle: React.FC<CreateArticleProps> = () => {
  let history = useHistory();
  let [form] = useForm();

  const [createArticle, createArticleStatus] = useMutation(CREATE_ARTICLE, {
    onCompleted: () => {
      message.success('Article has been created.');
      history.push('/articles');
    },
    refetchQueries: [{ query: GET_ARTICLES_LIST }],
  });

  const breadcrumbs = React.useMemo<Breadcrumb[]>(() => {
    return [{ path: '/articles', breadcrumbName: 'Articles' }];
  }, []);

  const handleSubmit = React.useCallback(() => {
    form.validateFields().then(values => {
      const article = { ...values, actualTime: +new Date() };
      createArticle({ variables: { article } });
    });
  }, [createArticle, form]);

  const actionButtons = React.useMemo(
    () => (
      <Button type="primary" loading={createArticleStatus.loading} onClick={handleSubmit}>
        Publish
      </Button>
    ),
    [createArticleStatus.loading, handleSubmit],
  );

  return (
    <>
      <Toolbar title="Create Article" breadcrumbs={breadcrumbs} extra={actionButtons} />
      <ArticleForm form={form} isSubmitting={createArticleStatus.loading} />
    </>
  );
};

export default CreateArticle;
