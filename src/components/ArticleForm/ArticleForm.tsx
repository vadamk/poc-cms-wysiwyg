import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
  Form,
  Input,
  Select,
  Checkbox,
  Card,
  Row,
  Col,
  Switch,
  InputNumber,
} from 'antd';
import { gql } from 'apollo-boost';
import { useForm } from 'antd/lib/form/Form';

import { FormProps, Language } from 'core/models';
import { langOptions, editionOptions } from 'core/global';
import { SubjectFragment } from 'core/graphql/fragments';

import RichEditor from 'components/RichEditor';
import RadioButtons from 'components/RadioButtons';
import ImageUpload from 'components/ImageUpload';

export const GET_SUBJECTS = gql`
  query GetSubjectListForBothLang {
    enSubjects: getSubjects(language: "en") {
      ...SubjectFragment
    }
    svSubjects: getSubjects(language: "sv") {
      ...SubjectFragment
    }
  }
  ${SubjectFragment}
`;

export interface ArticleFormProps extends FormProps {}

const ArticleForm: React.FC<ArticleFormProps> = ({
  form,
  initialValues = {
    language: Language.SV,
    readDuration: 10,
  },
  isSubmitting = false,
  onSubmit = () => null,
}) => {
  const [internalForm] = useForm(form);

  const [isEnglish, setEnglish] = React.useState(initialValues.language === Language.EN);
  const subjectsStatus = useQuery(GET_SUBJECTS);

  const subjectOptions = React.useMemo(() => {
    const subjects = isEnglish
      ? subjectsStatus.data?.enSubjects
      : subjectsStatus.data?.svSubjects;
    return (subjects || []).map(sbj => ({ label: sbj.title, value: sbj.id }));
  }, [isEnglish, subjectsStatus.data]);

  const handleLangChange = ({ target }) => {
    setEnglish(target.value === Language.EN);
    internalForm.setFieldsValue({ subjectIDs: [] });
  };

  return (
    <Form
      name="basic"
      layout="vertical"
      initialValues={initialValues}
      form={internalForm}
      onFinish={onSubmit}
    >
      <Row gutter={[20, 20]}>
        <Col span={18}>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Card>
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
                <Form.Item label="Subtitle" name="subTitle">
                  <Input.TextArea
                    rows={2}
                    disabled={isSubmitting}
                    placeholder="Please input subtitle"
                  />
                </Form.Item>
                <Form.Item
                  label="Content"
                  name="content"
                  rules={[{ required: true, message: 'Please input content!' }]}
                >
                  <RichEditor />
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col span={6}>
          <Card>
            <Form.Item label="Public" name="isPublished" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item
              label="Header Image"
              name="headerImage"
              rules={[{ required: true, message: 'Please add header image!' }]}
            >
              <ImageUpload />
            </Form.Item>

            <Form.Item
              label="Preview Image"
              name="image"
              rules={[{ required: true, message: 'Please add preview image!' }]}
            >
              <ImageUpload />
            </Form.Item>

            <Form.Item
              label="Minutes Read"
              name="readDuration"
              rules={[{ required: true, message: 'Please set duration!' }]}
            >
              <InputNumber min={1} max={200} disabled={isSubmitting} />
            </Form.Item>

            <Form.Item label="Language" name="language">
              <RadioButtons
                disabled={isSubmitting}
                options={langOptions}
                onChange={handleLangChange}
              />
            </Form.Item>
            <Form.Item label="Subject" name="subjectIDs">
              <Select
                showSearch
                mode="multiple"
                disabled={isSubmitting}
                loading={subjectsStatus.loading}
                options={subjectOptions}
                placeholder="Please choose subject"
                filterOption={(input, option) =>
                  String(option?.label).toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              />
            </Form.Item>
            <Form.Item label="Editions" name="editions">
              <Checkbox.Group options={editionOptions} />
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default ArticleForm;
