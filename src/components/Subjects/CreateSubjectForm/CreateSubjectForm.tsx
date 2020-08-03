import React from 'react';
import { gql } from 'apollo-boost';
import { Form, Input, Select, Checkbox, Row, Col, Tooltip, Spin } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';

import { FormProps, Option } from 'core/models';
import { langOptions, Language, Audiences } from 'core/global';
import { getAudienceOptions } from 'core/utils';
import { useQuery } from '@apollo/react-hooks';

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

export const GET_AUDIENCES = gql`
  query GetAudiencesForBothLang {
    enAudiences: getAudiences(language: "en") {
      id
      title
      language
    }
    svAudiences: getAudiences(language: "sv") {
      id
      title
      language
    }
  }
`;

export interface CreateSubjectFormProps extends FormProps {
  mode?: 'create' | 'update';
}

const CreateSubjectForm: React.FC<CreateSubjectFormProps> = ({
  form,
  initialValues = { language: Language.SV },
  isSubmitting = false,
}) => {
  const [internalForm] = useForm(form);

  const [isEnglish, setEnglish] = React.useState(initialValues.language === Language.EN);
  const getAudiencesStatus = useQuery(GET_AUDIENCES);

  const audiences = React.useMemo(() => {
    const { data } = getAudiencesStatus;

    if (!data) {
      return [];
    }

    return [...data.svAudiences, ...data.enAudiences]
  }, [getAudiencesStatus]);

  const swedenJobId = React.useMemo(() => {
    return audiences.find(a => a.title === Audiences.SWEDEN_JOB)?.id;
  }, [audiences])

  const handleLanguageChange = React.useCallback(
    value => {
      const nextLangIsEnglish = value === Language.EN;
      const audienceIDs = nextLangIsEnglish ? [swedenJobId] : [];
      internalForm.setFieldsValue({ audienceIDs });
      setEnglish(nextLangIsEnglish);
    },
    [internalForm, swedenJobId],
  );

  const curAudienceOptions = React.useMemo<Option[]>(() => {
    if (!audiences) {
      return [];
    }

    return getAudienceOptions(audiences)
      .map(audience => {
        if (isEnglish) {
          return { ...audience, disabled: true };
        }

        if (audience.value === swedenJobId) {
          return { ...audience, disabled: true };
        }

        return audience;
      });
  }, [audiences, isEnglish, swedenJobId]);

  return (
    <Form {...layout} name="basic" form={form} initialValues={initialValues}>
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: 'Please input title!' }]}
      >
        <Input
          autoFocus
          autoComplete="off"
          disabled={isSubmitting}
          placeholder="Please input title"
        />
      </Form.Item>

      <Form.Item label="Language" name="language">
        <Select
          disabled={isSubmitting}
          options={langOptions}
          onChange={handleLanguageChange}
        />
      </Form.Item>

      <Spin spinning={getAudiencesStatus.loading}>
        <Form.Item
          label={
            <>
              Needs&nbsp;
              <Tooltip title="You can only choose 'Sweden Job' when the Language is English. But if the Language is Sweeden you can't choose 'Sweden Job'">
                <QuestionCircleOutlined />
              </Tooltip>
            </>
          }
          name="audienceIDs"
          rules={[{ required: true, message: 'Please select at least 1 audience!' }]}
        >
          <Checkbox.Group>
            <Row gutter={[0, 5]}>
              {curAudienceOptions.map(option => (
                <Col key={option.label} span={12}>
                  <Checkbox disabled={option.disabled} value={option.value}>
                    {option.label}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>
      </Spin>

      <Form.Item label="Description" name="description">
        <Input.TextArea
          rows={4}
          disabled={isSubmitting}
          placeholder="Please input description"
        />
      </Form.Item>
    </Form>
  );
};

export default CreateSubjectForm;
