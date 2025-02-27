import React, { useState } from 'react';
import { Layout, Menu, theme, Typography } from 'antd';
import { 
  TeamOutlined, 
  BarChartOutlined, 
  UserOutlined, 
  DashboardOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/">仪表盘</Link>,
    },
    {
      key: 'students',
      icon: <TeamOutlined />,
      label: <Link to="/students">学生管理</Link>,
    },
    {
      key: 'portrait',
      icon: <UserOutlined />,
      label: <Link to="/portrait">学生画像</Link>,
    },
    {
      key: 'analysis',
      icon: <BarChartOutlined />,
      label: <Link to="/analysis">数据分析</Link>,
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: <Link to="/system">系统管理</Link>,
    },
  ];

  // 根据路径确定当前选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/') return ['dashboard'];
    const key = path.split('/')[1];
    return [key];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px', background: '#001529' }}>
        <Title level={4} style={{ color: 'white', margin: 0 }}>学生用户画像系统</Title>
      </Header>
      
      <Layout>
        <Sider 
          width={200} 
          collapsible 
          collapsed={collapsed} 
          onCollapse={setCollapsed}
        >
          <Menu
            mode="inline"
            selectedKeys={getSelectedKey()}
            style={{ height: '100%', borderRight: 0 }}
            theme="dark"
            items={menuItems}
          />
        </Sider>
        
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;