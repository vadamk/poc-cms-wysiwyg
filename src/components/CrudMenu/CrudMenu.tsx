import React from 'react';
import { Menu, Dropdown } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

export interface CrudMenuProps {
  data?: any,
  onEdit?: (data: any) => void,
  onDelete?: (data: any) => void,
  onPreview?: (data: any) => void,
}

const CrudMenu: React.FC<CrudMenuProps> = ({
  data,
  children,
  onEdit,
  onDelete,
  onPreview,
}) => {
  const handleEdit = () => {
    onEdit && onEdit(data);
  }
  
  const handleDelete = () => {
    onDelete && onDelete(data);
  }
  
  const handlePreview = () => {
    onPreview && onPreview(data);
  }
  
  return (
    <Dropdown
      trigger={['click']}
      overlay={(
        <Menu>
          {onEdit && (
            <Menu.Item icon={<EditOutlined />} onClick={handleEdit}>
              Edit
            </Menu.Item>
          )}
          {onDelete && (
            <Menu.Item icon={<DeleteOutlined />} onClick={handleDelete}>
              Delete
            </Menu.Item>
          )}
          {onPreview && (
            <Menu.Item icon={<EyeOutlined />} onClick={handlePreview}>
              Preview
            </Menu.Item>
          )}
        </Menu>
      )}
    >
      {children}
    </Dropdown>
  );
};

export default CrudMenu;
