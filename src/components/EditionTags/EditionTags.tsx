import React from 'react';
import { Tag } from 'antd';
import { Edition } from 'global';

const labels = {
  [Edition.BEGINNER]: 'Beginer',
  [Edition.BOSS]: 'Boss',
  [Edition.GOVERNMENT]: 'Government',
}

export interface EditionTagsProps {
  items: { type: Edition }[]
}

const EditionTags: React.FC<EditionTagsProps> = ({ items = [] }) => (
  <>
    {items.map(({ type }) => (
      <Tag key={type} color="magenta">{labels[type]}</Tag>
    ))}
  </>
);

export default EditionTags;
