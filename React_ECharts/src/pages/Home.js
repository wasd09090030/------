import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import { PieChartOutlined, CloudOutlined, ApiOutlined, DashboardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <PieChartOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      title: '投稿地区分布饼图',
      description: '基于SQLite数据库的地理分布可视化分析',
      path: '/pie-chart',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: <CloudOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
      title: '推荐理由词云分析',
      description: '基于2280条推荐理由的文本挖掘和词频分析',
      path: '/word-cloud',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: <DashboardOutlined style={{ fontSize: '48px', color: '#faad14' }} />,
      title: '综合仪表板',
      description: '多图表组合展示，全面的数据分析视图',
      path: '/dashboard',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: <ApiOutlined style={{ fontSize: '48px', color: '#f5222d' }} />,
      title: 'API文档',
      description: '查看数据接口文档和实时数据状态',
      path: '/api-docs',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
  ];

  return (
    <div style={{ padding: '40px 0' }}>
      {/* 头部介绍 */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          📊 数据可视化仪表板
        </h1>
        <p style={{ 
          fontSize: '20px', 
          color: '#666', 
          maxWidth: '800px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          基于 React + ECharts + FastAPI + SQLite 构建的现代化数据可视化平台
          <br />
          提供交互式图表、实时数据分析和美观的用户界面
        </p>
      </div>

      {/* 功能卡片 */}
      <Row gutter={[32, 32]} justify="center">
        {features.map((feature, index) => (
          <Col key={index} xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{
                height: '320px',
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                background: feature.color,
                color: 'white',
                transition: 'all 0.3s ease'
              }}
              bodyStyle={{ 
                padding: '30px', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onClick={() => navigate(feature.path)}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '20px' }}>
                  {feature.icon}
                </div>
                <h3 style={{ 
                  color: 'white', 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  marginBottom: '16px'
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  fontSize: '14px',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {feature.description}
                </p>
              </div>
              <Button 
                type="default" 
                size="large" 
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.2)',
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(feature.path);
                }}
              >
                立即查看
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 技术栈介绍 */}
      <div style={{ 
        marginTop: '80px', 
        padding: '40px', 
        background: 'rgba(255,255,255,0.9)', 
        borderRadius: '16px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '30px' }}>
          🛠️ 技术栈
        </h2>
        <Row gutter={16} justify="center">
          <Col span={6}>
            <div style={{ padding: '20px' }}>
              <h4 style={{ color: '#1890ff', fontSize: '18px' }}>前端技术</h4>
              <p style={{ color: '#666' }}>React 18 + Ant Design + ECharts</p>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ padding: '20px' }}>
              <h4 style={{ color: '#52c41a', fontSize: '18px' }}>后端技术</h4>
              <p style={{ color: '#666' }}>FastAPI + SQLite + Python</p>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ padding: '20px' }}>
              <h4 style={{ color: '#faad14', fontSize: '18px' }}>数据处理</h4>
              <p style={{ color: '#666' }}>文本分析 + 词频统计 + 地理分布</p>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ padding: '20px' }}>
              <h4 style={{ color: '#f5222d', fontSize: '18px' }}>可视化</h4>
              <p style={{ color: '#666' }}>饼图 + 词云 + 交互式图表</p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;
