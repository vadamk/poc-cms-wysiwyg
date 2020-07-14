import React from 'react';

import sty from './Toolbar.module.scss';
import { Breadcrumb } from 'antd';

export interface Breadcrumb {
  path: string;
  title: string;
}

export interface ToolbarProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
}

const Toolbar: React.FC<ToolbarProps> = ({
  title,
  breadcrumbs = [],
  children,
}) => {
  return (
    <div className={sty.toolbar}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href="/">Dashboard</a>
        </Breadcrumb.Item>
        {breadcrumbs.map(b => (
          <Breadcrumb.Item key={b.path}>
            <a href={b.path}>{b.title}</a>
          </Breadcrumb.Item>
        ))}
        <Breadcrumb.Item>
          {title}
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className={sty.rightContent}>
        {children}
      </div>
    </div>
  );
};

export default Toolbar;
