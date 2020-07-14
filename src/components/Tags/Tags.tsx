import React from 'react';
import { Tag } from 'antd';
import { Audiences } from 'global';
import { Option } from 'models';

import sty from './Tags.module.scss';

export interface TagsProps {
  options?: Option[];
  color?: string;
}

const Tags: React.FC<TagsProps> = ({ options = [], color = 'purple' }) => (
  <div className={sty.list}>
    {options.map(({ value, label }) => (
      <Tag key={String(value)} color={color} className={sty.tag}>
        {label}
      </Tag>
    ))}
  </div>
);

export default Tags;
