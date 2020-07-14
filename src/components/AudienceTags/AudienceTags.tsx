import React from 'react';
import { Tag } from 'antd';
import { Audiences } from 'global';

const labels = {
  [Audiences.DEVELOP]: 'Develop',
  [Audiences.GIGGING]: 'Digging',
  [Audiences.HELP]: 'Help',
  [Audiences.NEW_JOB]: 'New Job',
  [Audiences.PROFILE]: 'Profile',
  [Audiences.SWEDEN_JOB]: 'Sweden Job',
}

export interface AudienceTagsProps {
  items: { type: Audiences }[]
}

const AudienceTags: React.FC<AudienceTagsProps> = ({ items = [] }) => (
  <>
    {items.map(({ type }) => (
      <Tag key={type} color="purple">{labels[type]}</Tag>
    ))}
  </>
);

export default AudienceTags;
