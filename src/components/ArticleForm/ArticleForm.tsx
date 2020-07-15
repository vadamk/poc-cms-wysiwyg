import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Form, Input, Select, Button, Space, Checkbox } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { Link } from 'react-router-dom';

import { FormProps } from 'core/models';
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
import UploadImage from 'components/UploadImage';

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 12 },
};

const tailLayout = {
  wrapperCol: { offset: 3, span: 12 },
};

export interface ArticleFormProps extends FormProps {
  mode?: 'create' | 'update';
}

const randomImageId = Math.round(Math.random() * 50) + 1000;

const ArticleForm: React.FC<ArticleFormProps> = ({
  form,
  initialValues = {
    language: Language.SV,
    image: `https://picsum.photos/id/${randomImageId}/400/250`
  },
  mode = 'create',
  isSubmitting = false,
  onSubmit = () => null,
}) => {
  const [internalForm] = useForm(form);

  const [isEnglish, setEnglish] = React.useState(initialValues.language === Language.EN);
  const subjectsStatus = useQuery(GET_SUBJECTS_LIST);

  const subjectOptions = React.useMemo(() => {
    return (subjectsStatus.data?.getSubjectList || [])
      .filter(
        subject => isEnglish 
          ? subject.language === Language.EN
          : subject.language === Language.SV
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

  const handleLangChange = ({ target }) => {
    const nextIsEnglish = target.value === Language.EN;
    const audiences = nextIsEnglish ? [Audiences.SWEDEN_JOB] : [];
    internalForm.setFieldsValue({ audiences });
    setEnglish(nextIsEnglish);
  }

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={initialValues}
      form={internalForm}
      onFinish={onSubmit}
    >
      <Form.Item
        wrapperCol={{ span: 21 }}
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

      <Form.Item
        wrapperCol={{ span: 21 }}
        label="Content"
        name="content"
        rules={[{ required: true, message: 'Please input title!' }]}
      >
        <RichEditor />
      </Form.Item>

      <Form.Item label="Subtitle" name="subTitle">
        <Input.TextArea
          rows={4}
          disabled={isSubmitting} 
          placeholder="Please input subtitle"
        />
      </Form.Item>

      <Form.Item
        label="Image"
        name="image"
        rules={[{ required: true, message: 'Please add image!' }]}
      >
        {/* <Input autoComplete="off" disabled={isSubmitting} /> */}
        <UploadImage />
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
        rules={[{ required: true, message: 'Please choose subject!' }]}>
        <Select
          showSearch
          disabled={isSubmitting}
          loading={subjectsStatus.loading}
          options={subjectOptions}
          placeholder="Please choose subject"
          filterOption={(input, option) => 
            String(option?.label)
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
        />
      </Form.Item>

      <Form.Item label="Editions" name="editions">
        <Checkbox.Group options={editionOptions} />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" htmlType="submit">
            {mode === 'create' ? 'Create' : 'Update'}
          </Button>
          <Link to="/articles">
            <Button type="default">Cancel</Button>
          </Link>
        </Space>
      </Form.Item>

    </Form>
  );
};

export default ArticleForm;
