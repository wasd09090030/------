import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import { 
  HomeOutlined, 
  PieChartOutlined, 
  CloudOutlined, 
  DashboardOutlined,
  ApiOutlined,
  MenuOutlined,
  GithubOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/pie-chart',
      icon: <PieChartOutlined />,
      label: '饼图分析',
    },
    {
      key: '/word-cloud',
      icon: <CloudOutlined />,
      label: '词云分析',
    },
    {
      key: '/line-chart',
      icon: <div>📈</div>,
      label: '时间趋势',
    },
    {
      key: '/bar-chart',
      icon: <div>📊</div>,
      label: '主题统计',
    },
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '综合仪表板',
    },
    {
      key: '/api-docs',
      icon: <ApiOutlined />,
      label: 'API文档',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
    setDrawerVisible(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            color: 'white', 
            fontSize: '20px', 
            fontWeight: 'bold',
            marginRight: '40px'
          }}>
            📊 数据可视化平台
          </div>
          
          {/* 桌面端菜单 */}
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ 
              background: 'transparent', 
              border: 'none',
              flex: 1,
              display: window.innerWidth > 768 ? 'flex' : 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button
            type="text"
            icon={<GithubOutlined />}
            style={{ color: 'white' }}
            onClick={() => window.open('https://github.com', '_blank')}
          >
            GitHub
          </Button>
          
          {/* 移动端菜单按钮 */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerVisible(true)}
            style={{ 
              color: 'white',
              display: window.innerWidth <= 768 ? 'inline-block' : 'none'
            }}
          />
        </div>
      </Header>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title="导航菜单"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={250}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Drawer>

      <Content style={{ 
        padding: '0 20px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: 'calc(100vh - 134px)'
      }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.9)', 
          padding: '24px', 
          borderRadius: '12px',
          margin: '24px 0',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          {children}
        </div>
      </Content>

      <Footer style={{ 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.15)'
      }}>
        <div>
          数据可视化平台 ©2024 Created with ❤️ by React + ECharts + FastAPI
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.8 }}>
          技术栈: React 18 | Ant Design | ECharts | FastAPI | SQLite
        </div>
      </Footer>
    </Layout>
  );
};

export default AppLayout;
