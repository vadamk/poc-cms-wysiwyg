import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Form, Input, Select, Button, Space, Checkbox, InputNumber } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { Link } from 'react-router-dom';
// import slugify from 'slugify';

import { FormProps } from 'core/models';
import {
  langOptions,
  audienceOptions,
  editionOptions,
  Language,
  Audiences,
} from 'core/global';
import { GET_SUBJECTS_LIST } from 'components/Subjects';
import RadioButtons from 'components/RadioButtons';
import ImageUpload from 'components/ImageUpload';

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 12 },
};

const tailLayout = {
  wrapperCol: { offset: 3, span: 12 },
};

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
    return (subjectsStatus.data?.getSubjectList || [])
      .filter(subject =>
        isEnglish ? subject.language === Language.EN : subject.language === Language.SV,
      )
      .map(({ title, id }) => ({ label: title, value: id }));
  }, [isEnglish, subjectsStatus.data]);

  const curAudienceOptions = React.useMemo(() => {
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
      {...layout}
      name="basic"
      initialValues={initialValues}
      form={internalForm}
      onFinish={handleSubmit}
    >
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
        rules={[{ required: true, message: 'Please input link!' }]}
      >
        <Input disabled={isSubmitting} placeholder="Please input link" />
      </Form.Item>

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
        <Checkbox.Group options={curAudienceOptions} />
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

      {mode === 'create' && (
        <Form.Item
          label="Number of steps"
          name="stepCount"
          rules={[{ required: true, message: 'Please set count of steps!' }]}
        >
          <InputNumber min={1} max={5} disabled={isSubmitting} />
        </Form.Item>
      )}

      {mode === 'create' && (
        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
            <Link to="/guides">
              <Button type="default">Cancel</Button>
            </Link>
          </Space>
        </Form.Item>
      )}
    </Form>
  );
};

export default GuideForm;
