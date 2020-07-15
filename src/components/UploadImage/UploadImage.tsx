import React from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Upload, message } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

import { UploadFolder } from 'core/global';

const uploadToTheServer = (
  url: string,
  file: UploadFile,
  callback: () => void = () => null
) => {
  const formData = new FormData();
  formData.append(file.name, file as any);

  axios.put(url, file, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  }).then(() => {
    message.success('Upload successfully.');
    callback();
  }).catch(() => {
    message.error('Upload error.');
  });
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

export interface UploadImageProps {
  value?: string;
  onChange?: (imageURL: string) => void;
}

const UploadImage = React.forwardRef<Upload, UploadImageProps>(
  ({ value, onChange = () => null }, ref) => {
    const [file, setFile] = React.useState<UploadFile>();
    const [fileURL, setFileURL] = React.useState<string>(value || '');
    const [isLoading, setLoading] = React.useState(false);

    const [getUploadUrl, { called, refetch }] = useLazyQuery(GET_UPLOAD_URL, {
      onCompleted: (data) => {
        const { uploadUrl, path, exp } = data.getUploadUrl;
        console.log('uploadUrl, path, exp: ', uploadUrl, path, exp);

        if (file) {
          uploadToTheServer(uploadUrl, file, () => {
            onChange(path);
            setFileURL(path);
          });
        }
      },
      onError: (err) => {
        console.log('err: ', err);
      }
    });

    const beforeUpload = (file: UploadFile) => {  
      if (['image/jpeg', 'image/png'].includes(file.type)) {
        setFile(file);
        called ? refetch() : getUploadUrl({ variables: {
          folder: UploadFolder.CMS,
          filename: file.name,
        }});
      } else {
        message.error('You can only upload JPG/PNG file!');
      }

      return false;
    }

    return (
      <Upload
        ref={ref}
        listType="picture-card"
        style={{ width: '128px', height: '128px' }}
        showUploadList={false}
        beforeUpload={beforeUpload}
        fileList={file ? [file] : []}
      >
        {fileURL ? (
          <img src={fileURL} alt="avatar" style={{ width: '100%' }} />
        ) : (
          <>
            {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className="ant-upload-text">Upload</div>
          </>
        )}
      </Upload>
    );
  }
);

export default UploadImage;
