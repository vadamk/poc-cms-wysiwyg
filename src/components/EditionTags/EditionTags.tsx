import React from 'react';
import { Tag } from 'antd';
import { Edition } from 'global';

const labels = {
  [Edition.BEGINNER]: 'Beginer',
  [Edition.BOSS]: 'Boss',
  [Edition.GOVERNMENT]: 'Government',
}

const tagStyles: React.CSSProperties = {
  marginBottom: 4,
  marginRight: 4,
  fontSize: 11,
  lineHeight: '18px',
  display: 'block',
};

export interface EditionTagsProps {
  items: { type: Edition }[]
}

const EditionTags: React.FC<EditionTagsProps> = ({ items = [] }) => (
  <div>
    {items.map(({ type }) => (
      <Tag key={type} color="magenta" style={tagStyles}>{labels[type]}</Tag>
    ))}
  </div>
);

export default EditionTags;
