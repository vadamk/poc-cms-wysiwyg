import React from 'react';
import { Layout, Menu } from 'antd';
import {
  ReadOutlined,
  InsertRowAboveOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

import sty from './CommonLayout.module.scss';

const { Header, Content, Footer, Sider } = Layout;

const layoutStyles: React.CSSProperties = {
  marginLeft: 200,
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
  return (
    <Layout>
      <Sider className={sty.sider}>
        <Link to="/">
          <div className={sty.logo} />
        </Link>
        <Menu theme="light" mode="inline" defaultSelectedKeys={['4']}>
          <Menu.Item key="1" icon={<InsertRowAboveOutlined />}>
            <Link to="/subjects">Subjects</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<ReadOutlined />}>
            <Link to="/articles">Articles</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<FileProtectOutlined />}>
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
