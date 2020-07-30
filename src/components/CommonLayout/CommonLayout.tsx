import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import cx from 'classnames';
import {
  ReadOutlined,
  InsertRowAboveOutlined,
  FileProtectOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import {
  saveInLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
} from 'core/services/browser';
import { localStorageKeys } from 'core/global';

import Logo from 'components/Logo';
import { SET_AUTHORIZED } from 'components/SignIn';

import sty from './CommonLayout.module.scss';

const { Header, Content, Sider } = Layout;

const contentStyles: React.CSSProperties = {
  margin: '24px 16px 0',
  overflow: 'initial',
};

const CommonLayout: React.FC = ({ children }) => {
  const [isCollapsed, setCollapsed] = React.useState(
    getFromLocalStorage(localStorageKeys.sidebarCollapsed),
  );

  const [setAuthorized] = useMutation(SET_AUTHORIZED);

  const { pathname } = useLocation();

  const selectedKeys = React.useMemo(() => {
    const match = pathname.match(/\/\w+/);
    return match || [];
  }, [pathname]);

  const layoutStyles = React.useMemo<React.CSSProperties>(
    () => ({
      marginLeft: isCollapsed ? 80 : 200,
      height: '100vh',
      transition: 'all 200ms',
    }),
    [isCollapsed],
  );

  const switchButtonStyles = React.useMemo<React.CSSProperties>(
    () => ({
      position: 'absolute',
      bottom: 0,
      display: 'block',
      width: '100%',
      paddingLeft: isCollapsed ? '32px' : '24px',
      textAlign: 'left',
    }),
    [isCollapsed],
  );

  const toggleCollapsed = () => {
    setCollapsed(!isCollapsed);
    saveInLocalStorage(localStorageKeys.sidebarCollapsed, !isCollapsed);
  };

  const logout = () => {
    setAuthorized({ variables: { isAuthorized: false } });
    removeFromLocalStorage(localStorageKeys.token);
  };

  return (
    <Layout>
      <Sider className={sty.sider} collapsed={isCollapsed}>
        <div className={cx(sty.logo, isCollapsed && sty.collapsed)}>
          <Link to="/subjects">
            <Logo />
          </Link>
        </div>
        <Menu theme="light" mode="inline" defaultSelectedKeys={selectedKeys}>
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
        <Button type="text" style={switchButtonStyles} onClick={toggleCollapsed}>
          {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </Sider>
      <Layout className={sty.siteLayout} style={layoutStyles}>
        <Header className={sty.header}>
          <Dropdown
            overlay={() => (
              <Menu>
                <Menu.Item icon={<LogoutOutlined />} onClick={logout}>
                  Logout
                </Menu.Item>
              </Menu>
            )}
          >
            <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
          </Dropdown>
        </Header>
        <Content style={contentStyles}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default CommonLayout;
