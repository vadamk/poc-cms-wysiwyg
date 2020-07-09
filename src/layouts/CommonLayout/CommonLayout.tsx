import React from 'react';
import { Layout, Menu } from 'antd';
import {
  ReadOutlined,
  InsertRowAboveOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

import Logo from 'icons/Logo';

import sty from './CommonLayout.module.scss';

const { Header, Content, Footer, Sider } = Layout;

const layoutStyles: React.CSSProperties = {
  marginLeft: 200,
  minHeight: '100vh',
};

const headerStyles: React.CSSProperties = {
  padding: 0,
};

const contentStyles: React.CSSProperties = {
  margin: '24px 16px 0',
  overflow: 'initial',
};

const footerStyles: React.CSSProperties = {
  textAlign: 'center',
};

const CommonLayout: React.FC = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <Layout>
      <Sider className={sty.sider}>
        <div className={sty.logo}>
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <Menu theme="light" mode="inline" defaultSelectedKeys={[pathname]}>
          <Menu.Item key="/subjects" icon={<InsertRowAboveOutlined />}>
            <Link to="/subjects">Subjects</Link>
          </Menu.Item>
          <Menu.Item key="/articles" icon={<ReadOutlined />}>
            <Link to="/articles">Articles</Link>
          </Menu.Item>
          <Menu.Item key="/guides" icon={<FileProtectOutlined />}>
            <Link to="/guides">Guides</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className={sty.siteLayout} style={layoutStyles}>
        <Header className={sty.siteLayoutBackground} style={headerStyles} />
        <Content style={contentStyles}>
          {children}
        </Content>
        <Footer style={footerStyles}>Next Big Thing AB ©</Footer>
      </Layout>
    </Layout>
  );
};

export default CommonLayout;
