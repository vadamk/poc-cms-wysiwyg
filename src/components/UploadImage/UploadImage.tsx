import React from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Upload, message } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import reqwest from 'reqwest';

import { UploadFolder } from 'global';

const uploadToTheServer = (
  url: string,
  file: UploadFile,
  callback: () => void = () => null
) => {
  const formData = new FormData();
  formData.append(file.name, file as any);

  reqwest({
    url,
    method: 'post',
    processData: false,
    data: formData,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    success: () => {
      message.success('Upload successfully.');
      callback();
    },
    error: (err) => {
      message.error('Upload failed.', err);
      callback();
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
  onChange?: (imageURL: string) => void;
}

const UploadImage = React.forwardRef<Upload, UploadImageProps>(
  ({ onChange = () => null }, ref) => {
    const [file, setFile] = React.useState<UploadFile>();
    const [fileURL, setFileURL] = React.useState<string>();
    const [isLoading, setLoading] = React.useState(false);

    const [getUploadUrl, { called, refetch }] = useLazyQuery(GET_UPLOAD_URL, {
      variables: { folder: UploadFolder.CMS },
      onCompleted: (data) => {
        const { uploadUrl, path, exp } = data.getUploadUrl;

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

    const beforeUpload = (file) => {  
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
