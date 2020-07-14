import React from 'react';
import { Card, message } from 'antd';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from "react-router-dom";

import { ArticleFragment } from 'graphql/fragments';

import Toolbar from 'components/Toolbar';
import ArticleForm from 'components/ArticleForm';

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
  
  const [createArticle, createArticleStatus] = useMutation(CREATE_ARTICLE, {
    onCompleted: () => {
      message.success('Article has been created.');
      history.push('/articles');
    },
  });

  const breadcrumbs = React.useMemo(() => {
    return [{ path: '/articles', title: 'Articles' }];
  }, []);

  const handleSubmit = (values) => {
    const article = { ...values, actualTime: +new Date() };
    createArticle({ variables: { article } });
  }

  return (
    <>
      <Toolbar title="Create Article" breadcrumbs={breadcrumbs} />
      <Card>
        <ArticleForm
          isSubmitting={createArticleStatus.loading}
          onSubmit={handleSubmit}
        />
      </Card>
    </>
  );
};

export default CreateArticle;
