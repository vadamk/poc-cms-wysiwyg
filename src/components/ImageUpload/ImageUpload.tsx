import React from 'react';
import axios from 'axios';
import { gql } from 'apollo-boost';
import { Upload, message } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';

import { useImperativeQuery } from 'core/hooks/apollo';
import {
  GetUploadUrlQuery,
  GetUploadUrlQueryVariables,
  Upload_Folder,
  UploadOutput,
} from 'core/models/generated';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import sty from './ImageUpload.module.scss';

const uploadToTheServer = (
  url: string,
  file: UploadFile,
  onSuccess: () => void = () => null,
  onError: () => void = () => null,
) => {
  const formData = new FormData();
  formData.append(file.name, file as any);

  const headers = {
    'Access-Control-Allow-Origin': '*',
  };

  axios
    .put(url, file, { headers })
    .then(onSuccess)
    .catch(onError);
}

export const GET_UPLOAD_URL = gql`
  query GetUploadUrl($folder: UPLOAD_FOLDER!, $filename: String!) {
    getUploadUrl(folder: $folder, filename: $filename) {
      uploadUrl
      path
      exp
    }
  }
`;

export interface ImageUploadProps {
  value?: string;
  onChange?: (value?: string) => void,
}

const ImageUpload = React.forwardRef<Upload, ImageUploadProps>(({
  value,
  onChange = () => null,
}, ref) => {
  const [requstData, setRequstData] = React.useState<UploadOutput>();
  const [imageURL, setImageURL] = React.useState<string | null>(value as string);
  const [isLoading, setLoading] = React.useState(false);

  const getUploadUrl = useImperativeQuery<
    GetUploadUrlQuery,
    GetUploadUrlQueryVariables
  >(GET_UPLOAD_URL);

  const getAction = async (file: any) => {

    const { data } = await getUploadUrl({
      folder: Upload_Folder.Cms,
      filename: file.name,
    });

    setLoading(true);
    setImageURL(null);
    setRequstData(data.getUploadUrl);

    return data.getUploadUrl.uploadUrl;
  }

  const handleChange = ({ file }: UploadChangeParam) => {
    if (file.status === 'done') {
      setLoading(false);
      setImageURL(requstData?.path as string);
      onChange(requstData?.path);
      return;
    }
  }

  const handleCustomRequest = ({ action, file, onSuccess, onError }) => {
    uploadToTheServer(action, file, onSuccess, onError)
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }

    return isJpgOrPng;
  }

  const uploadButton = (
    <div>
      {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <Upload
      ref={ref}
      method="PUT"
      action={getAction}
      customRequest={handleCustomRequest}
      beforeUpload={beforeUpload}
      showUploadList={false}
      listType="picture-card"
      className={sty.uploader}
      onChange={handleChange}
    >
      {imageURL ? <img src={imageURL} alt="upload preview" /> : uploadButton}
    </Upload>
  );
});

export default ImageUpload;
