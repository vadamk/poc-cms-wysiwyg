import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Breadcrumb, PageHeader } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

import sty from './Toolbar.module.scss';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';

export interface Breadcrumb extends Route { }

export interface ToolbarProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
  extra?: React.ReactNode;
  footer?: React.ReactNode;
}

const Toolbar: React.FC<ToolbarProps> = ({
  title,
  breadcrumbs = [],
  extra,
  footer,
  children,
  }) => {
  let history = useHistory();

  const routes = React.useMemo<Breadcrumb[]>(() => [
    {
      path: '/',
      breadcrumbName: 'Dashboard',
    },
    ...breadcrumbs,
    {
      path: history.location.pathname,
      breadcrumbName: title,
    }
  ], [breadcrumbs, history.location.pathname, title]);

  return (
    <PageHeader
      backIcon={breadcrumbs.length ? <ArrowLeftOutlined /> : null}
      onBack={history.goBack}
      className={sty.header}
      title={title}
      breadcrumb={{
        routes,
        itemRender: (route) => (
          <Link to={route.path}>{route.breadcrumbName}</Link>
        )
      }}
      extra={extra}
      footer={footer}
    >
      {children}
    </PageHeader>
  );
};

export default Toolbar;
