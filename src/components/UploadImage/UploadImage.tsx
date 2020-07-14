import React from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Upload, message } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import reqwest from 'reqwest';

import { UploadFolder } from 'global';

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const uploadToTheServer = (url: string, file: UploadFile) => {
  console.log('file: ', file);
  const formData = new FormData();
  formData.append(file.name, file as any);

  reqwest({
    url,
    method: 'post',
    processData: false,
    data: formData,
    success: () => {
      message.success('Upload successfully.');
    },
    error: () => {
      message.error('Upload failed.');
    },
  });
}

export const GET_UPLOAD_URL = gql`
  query GetUploadUrl($folder: UPLOAD_FOLDER!) {
    getUploadUrl(folder: $folder) {
      uploadUrl
      path
      exp
    }
  }
`;

export interface UploadImageProps {
  name: string;
}

const UploadImage = React.forwardRef<Upload, UploadImageProps>(
  ({ name = 'image' }, ref) => {
  const [file, setFile] = React.useState<UploadFile>();
  const [isLoading, setLoading] = React.useState(false);

  const [getUploadUrl, { called, refetch }] = useLazyQuery(GET_UPLOAD_URL, {
    variables: { folder: UploadFolder.CMS },
    onCompleted: (data) => {
      const { uploadUrl, path, exp } = data.getUploadUrl;

      if (file) {
        uploadToTheServer(uploadUrl, file);
      }
    },
    onError: (err) => {
      console.log('err: ', err);
    }
  });

  const beforeUpload = (file) => {  
    console.log('beforeUpload: ', file);
    if (['image/jpeg', 'image/png'].includes(file.type)) {
      setFile(file);
      called ? refetch() : getUploadUrl();
    } else {
      message.error('You can only upload JPG/PNG file!');
    }

    return false;
  }

  return (
    <Upload
      name={name}
      listType="picture-card"
      style={{ width: '128px', height: '128px' }}
      showUploadList={false}
      beforeUpload={beforeUpload}
      fileList={file ? [file] : []}
    >
      {/* {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
      ) : (
        <div>
          {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
          <div className="ant-upload-text">Upload</div>
        </div>
      )} */}

      {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </Upload>
  );
});

export default UploadImage;
