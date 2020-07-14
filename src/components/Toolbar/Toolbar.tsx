import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';

import sty from './Toolbar.module.scss';

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
          <Link to="/">Dashboard</Link>
        </Breadcrumb.Item>
        {breadcrumbs.map(b => (
          <Breadcrumb.Item key={b.path}>
            <Link to={b.path}>{b.title}</Link>
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
