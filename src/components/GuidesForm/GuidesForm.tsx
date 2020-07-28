import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  Checkbox,
  InputNumber,
  Switch,
  Card,
  Col,
  Row,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { Link } from 'react-router-dom';
// import slugify from 'slugify';

import { FormProps, Option } from 'core/models';
import {
  langOptions,
  audienceOptions,
  editionOptions,
  Language,
  Audiences,
} from 'core/global';
import { GET_SUBJECTS_LIST } from 'components/ArticleForm';
import RadioButtons from 'components/RadioButtons';
import ImageUpload from 'components/ImageUpload';

export interface GuideFormProps extends FormProps {
  mode?: 'create' | 'update';
}

const GuideForm: React.FC<GuideFormProps> = ({
  form,
  initialValues = {
    language: Language.SV,
    stepCount: 3,
  },
  mode = 'create',
  isSubmitting = false,
  onSubmit = () => null,
}) => {
  const [internalForm] = useForm(form);

  const [isEnglish, setEnglish] = React.useState(initialValues.language === Language.EN);
  // const [title, setTitle] = React.useState(initialValues.title);
  const subjectsStatus = useQuery(GET_SUBJECTS_LIST);

  const subjectOptions = React.useMemo(() => {
    const { data } = subjectsStatus;
    return (isEnglish ? data?.enSubjects : data?.svSubjects) || []
      .map(({ title, id }) => ({ label: title, value: id }));
  }, [isEnglish, subjectsStatus]);

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

  // const slug = React.useMemo(() => {
  //   return slugify(title || '', {
  //     lower: true,
  //     locale: isEnglish ? 'en' : 'sv'
  //   });
  // }, [isEnglish, title]);

  const handleLangChange = ({ target }) => {
    const nextIsEnglish = target.value === Language.EN;
    const audiences = nextIsEnglish ? [Audiences.SWEDEN_JOB] : [];
    internalForm.setFieldsValue({ audiences });
    setEnglish(nextIsEnglish);
  };

  const handleSubmit = values => {
    onSubmit(values);
  };

  // const handleChange = ({ target }) => {
  //   setTitle(target.value);
  // };

  return (
    <Form
      name="basic"
      layout="vertical"
      initialValues={initialValues}
      form={internalForm}
      onFinish={handleSubmit}
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
                    // onChange={handleChange}
                  />
                </Form.Item>

                <Form.Item
                  label="Link"
                  name="link"
                >
                  <Input disabled={isSubmitting} placeholder="Please input link" />
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col span={6}>
          <Card>
            {mode !== 'create' && (
              <Form.Item
                label="Published"
                name="isPublished">
                <Switch />
              </Form.Item>
            )}

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
                      <Checkbox disabled={option.disabled} value={option.value}>
                        {option.label}
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item
              label="Subject"
              name="subjectIDs"
              rules={[{ required: true, message: 'Please choose subject!' }]}
            >
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

            {mode === 'create' && (
              <Form.Item
                label="Number of steps"
                name="stepCount"
                rules={[{ required: true, message: 'Please set count of steps!' }]}
              >
                <InputNumber min={1} max={5} disabled={isSubmitting} />
              </Form.Item>
            )}
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default GuideForm;
