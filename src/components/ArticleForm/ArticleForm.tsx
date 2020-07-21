import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Form, Input, Select, Checkbox, Card, Row, Col } from 'antd';
import { useForm } from 'antd/lib/form/Form';

import { FormProps, Option } from 'core/models';
import {
  langOptions,
  audienceOptions,
  editionOptions,
  Language,
  Audiences,
} from 'core/global';
import { GET_SUBJECTS_LIST } from 'components/Subjects';
import RichEditor from 'components/RichEditor';
import RadioButtons from 'components/RadioButtons';
import ImageUpload from 'components/ImageUpload';

export interface ArticleFormProps extends FormProps { }

const ArticleForm: React.FC<ArticleFormProps> = ({
  form,
  initialValues = {
    language: Language.SV,
  },
  isSubmitting = false,
  onSubmit = () => null,
}) => {
  const [internalForm] = useForm(form);

  const [isEnglish, setEnglish] = React.useState(initialValues.language === Language.EN);
  const subjectsStatus = useQuery(GET_SUBJECTS_LIST);

  const subjectOptions = React.useMemo(() => {
    return (subjectsStatus.data?.getSubjectList || [])
      .filter(subject =>
        isEnglish ? subject.language === Language.EN : subject.language === Language.SV,
      )
      .map(({ title, id }) => ({ label: title, value: id }));
  }, [isEnglish, subjectsStatus.data]);

  const curAudienceOptions = React.useMemo<Option[]>(() => {
    return audienceOptions.map(audience => {
      if (isEnglish) {
        return { ...audience, disabled: true };
      }

      if (audience.value === Audiences.SWEDEN_JOB) {
        return { ...audience, disabled: true };
      }

      return audience;
    });
  }, [isEnglish]);

  const handleLangChange = ({ target }) => {
    const nextIsEnglish = target.value === Language.EN;
    const audiences = nextIsEnglish ? [Audiences.SWEDEN_JOB] : [];
    internalForm.setFieldsValue({ audiences });
    setEnglish(nextIsEnglish);
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
                    rows={4}
                    disabled={isSubmitting}
                    placeholder="Please input subtitle"
                  />
                </Form.Item>
              </Card>
            </Col>
              
            <Col span={24}>
              <Form.Item
                name="content"
                rules={[{ required: true, message: 'Please input content!' }]}
              >
                <RichEditor />
              </Form.Item>
            </Col>
          </Row>
        </Col>

        <Col span={6}>
          <Card>
            <Form.Item
              label="Image"
              name="image"
              rules={[{ required: true, message: 'Please add image!' }]}
            >
              <ImageUpload />
            </Form.Item>
            <Form.Item label="Language" name="language">
              <RadioButtons
                disabled={isSubmitting}
                options={langOptions}
                onChange={handleLangChange}
              />
            </Form.Item>
            <Form.Item
              label="Audiences"
              name="audiences"
              rules={[{ required: true, message: 'Please select at least 1 audience!' }]}
            >
              <Checkbox.Group>
                <Row gutter={[0, 5]}>
                  {curAudienceOptions.map(option => (
                    <Col key={option.label} span={12}>
                      <Checkbox
                        disabled={option.disabled}
                        value={option.value}
                      >
                        {option.label}
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item
              label="Subject"
              name="subjectId"
              rules={[{ required: true, message: 'Please choose subject!' }]}
            >
              <Select
                showSearch
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
