import React from 'react';
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Card, Spin, message } from 'antd';
import { useHistory } from "react-router-dom";

import { ArticleFragment } from 'graphql/fragments';
import Toolbar from 'components/Toolbar';
import ArticleForm from 'components/ArticleForm';
import { Edition } from 'global';

export const GET_ARTICLE = gql`
  query GetArticle($articleId: Int!) {
    getArticle(articleId: $articleId) {
      ...ArticleFragment
    }
  }
  ${ArticleFragment}
`;

export const UPDATE_ARTICLE = gql`
  mutation UpdateArticle($article: UpdateArticleInput!) {
    updateArticle(article: $article) {
      ...ArticleFragment
    }
  }
  ${ArticleFragment}
`;

export interface UpdateArticleProps {}

const UpdateArticle: React.FC<UpdateArticleProps> = () => {
  const history = useHistory();
  const { slug } = useParams();
  const [formData, setFormData] = React.useState();

  const [updateArticle, updateArticleStatus] = useMutation(UPDATE_ARTICLE, {
    onCompleted: () => {
      message.success('Article has been updated.');
      history.push('/articles');
    },
  });

  const { data, loading } = useQuery(GET_ARTICLE, {
    variables: { articleId: Number(slug) },
    onCompleted: (data) => {
      const {
        editions,
        audiences,
        subject,
        ...rest
      } = data?.getArticle;

      const formData = {
        ...rest,
        editions: editions.map(ed => Edition[ed.type.trim()]),
        audiences: audiences.map(ad => ad.type),
        subjectId: subject.id,
      };

      setFormData(formData);
    }
  });

  const breadcrumbs = React.useMemo(() => {
    return [{ path: '/articles', title: 'Articles' }];
  }, []);

  const handleSubmit = React.useCallback(({ audience, edition, ...values }) => {
    const article = {
      ...values,
      id: data?.getArticle.id,
      actualTime: +new Date(),
    };
    updateArticle({ variables: { article } });
  }, [data, updateArticle]);

  return (
    <>
      <Toolbar title="Update Article" breadcrumbs={breadcrumbs} />
      <Card>
        <Spin spinning={loading}>
          {formData && <ArticleForm
            initialValues={formData}
            mode="update"
            isSubmitting={updateArticleStatus.loading}
            onSubmit={handleSubmit}
          />}
        </Spin>
      </Card>
    </>
  );
};

export default UpdateArticle;
