import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Spin, message, Button } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useHistory } from 'react-router-dom';

import { ArticleFragment } from 'core/graphql/fragments';
import Toolbar, { Breadcrumb } from 'components/Toolbar';
import ArticleForm from 'components/ArticleForm';
import { Edition } from 'core/global';
import { FormValues } from 'core/models';

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
  const [form] = useForm();
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
    onCompleted: data => {
      const { editions, audiences, subject, ...rest } = data?.getArticle;

      const formData = {
        ...rest,
        editions: editions.map(ed => Edition[ed.type.trim()]),
        audiences: audiences.map(ad => ad.type),
        subjectId: subject.id,
      };

      setFormData(formData);
    },
  });

  const breadcrumbs = React.useMemo<Breadcrumb[]>(() => {
    return [{ path: '/articles', breadcrumbName: 'Articles' }];
  }, []);

  const handleSubmit = React.useCallback(
    () =>
      form.validateFields().then(values => {
        const article = {
          ...values,
          id: data?.getArticle.id,
          actualTime: +new Date(),
        };

        updateArticle({ variables: { article } });
      }),
    [data, form, updateArticle],
  );

  const actionButtons = React.useMemo(
    () => (
      <Button loading={updateArticleStatus.loading} type="primary" onClick={handleSubmit}>
        Save Changes
      </Button>
    ),
    [handleSubmit, updateArticleStatus.loading],
  );

  return (
    <>
      <Toolbar title="Update Article" breadcrumbs={breadcrumbs} extra={actionButtons} />
      <Spin spinning={loading}>
        {formData && (
          <ArticleForm
            form={form}
            initialValues={formData}
            isSubmitting={updateArticleStatus.loading}
            onSubmit={handleSubmit}
          />
        )}
      </Spin>
    </>
  );
};

export default UpdateArticle;
