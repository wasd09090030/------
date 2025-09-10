import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Button, Alert, Descriptions, Typography, Space } from 'antd';
import { ApiOutlined, CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { dataAPI } from '../services/api';

const { Title, Text, Paragraph } = Typography;

const ApiDocs = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      setLoading(true);
      const response = await dataAPI.healthCheck();
      setHealthStatus({ status: 'success', data: response });
    } catch (error) {
      setHealthStatus({ status: 'error', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const apiEndpoints = [
    {
      method: 'GET',
      path: '/api/publish-location-data',
      title: '获取投稿地区分布数据',
      description: '返回所有地区的投稿数量统计数据',
      response: {
        success: true,
        data: [
          { name: "广东", value: 780 },
          { name: "浙江", value: 617 },
          { name: "北京", value: 582 }
        ],
        total: 7053
      }
    },
    {
      method: 'GET',
      path: '/api/recommend-reason-wordcloud',
      title: '获取推荐理由词云数据',
      description: '返回推荐理由的词频统计数据，用于生成词云图',
      response: {
        success: true,
        data: [
          { name: "百万播放", value: 867 },
          { name: "万点赞", value: 741 },
          { name: "人气飙升", value: 315 }
        ],
        total_reasons: 2280,
        total_words: 100
      }
    },
    {
      method: 'GET',
      path: '/api/video-publish-times',
      title: '获取投稿时间分布数据',
      description: '返回7000条视频投稿时间的分布统计数据，包括24小时、每日、星期分布',
      response: {
        success: true,
        data: {
          hourly: { categories: ["00:00", "01:00", "02:00"], series: [45, 32, 28] },
          daily: { categories: ["2023-11-01", "2023-11-02"], series: [156, 198] },
          weekday: { categories: ["周一", "周二", "周三"], series: [1200, 980, 1150] }
        },
        total_videos: 7000,
        peak_hour: 14,
        peak_weekday: "周一"
      }
    },
    {
      method: 'GET',
      path: '/api/health',
      title: '健康检查',
      description: '检查API服务器状态',
      response: {
        status: "healthy",
        message: "API运行正常"
      }
    }
  ];

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title level={1} style={{ 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🔗 API 接口文档
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          数据可视化平台的后端API接口说明和实时状态监控
        </Paragraph>
      </div>

      {/* 服务状态 */}
      <Card 
        title={
          <Space>
            <ApiOutlined />
            API 服务状态
          </Space>
        }
        extra={
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={checkHealth}
            loading={loading}
          >
            检查状态
          </Button>
        }
        style={{ marginBottom: '24px' }}
      >
        {healthStatus ? (
          <Alert
            message={
              healthStatus.status === 'success' ? (
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  服务运行正常
                </Space>
              ) : (
                <Space>
                  <CloseCircleOutlined style={{ color: '#f5222d' }} />
                  服务连接失败
                </Space>
              )
            }
            description={
              healthStatus.status === 'success' 
                ? `服务器响应: ${healthStatus.data.message}` 
                : `错误信息: ${healthStatus.error}`
            }
            type={healthStatus.status === 'success' ? 'success' : 'error'}
            showIcon
          />
        ) : (
          <Alert message="正在检查服务状态..." type="info" showIcon />
        )}
      </Card>

      {/* API 端点列表 */}
      <Row gutter={[24, 24]}>
        {apiEndpoints.map((endpoint, index) => (
          <Col span={24} key={index}>
            <Card 
              title={
                <Space>
                  <Tag color={endpoint.method === 'GET' ? 'green' : 'blue'}>
                    {endpoint.method}
                  </Tag>
                  <Text code>{endpoint.path}</Text>
                </Space>
              }
              style={{ marginBottom: '16px' }}
            >
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="接口名称">
                  <Text strong>{endpoint.title}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="接口描述">
                  {endpoint.description}
                </Descriptions.Item>
                <Descriptions.Item label="请求方式">
                  <Tag color={endpoint.method === 'GET' ? 'green' : 'blue'}>
                    {endpoint.method}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="完整URL">
                  <Text code>http://localhost:8000{endpoint.path}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="返回示例">
                  <div style={{ 
                    background: '#f6f8fa', 
                    padding: '12px', 
                    borderRadius: '6px',
                    fontFamily: 'Monaco, Consolas, monospace',
                    fontSize: '12px',
                    overflow: 'auto'
                  }}>
                    <pre style={{ margin: 0 }}>
                      {JSON.stringify(endpoint.response, null, 2)}
                    </pre>
                  </div>
                </Descriptions.Item>
              </Descriptions>
              
              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <Button 
                  type="primary" 
                  onClick={() => window.open(`http://localhost:8000${endpoint.path}`, '_blank')}
                >
                  测试接口
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 使用说明 */}
      <Card title="📝 使用说明" style={{ marginTop: '24px' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Title level={4}>前端集成</Title>
            <Paragraph>
              <Text code>axios</Text> 配置了代理，开发环境下会自动转发到后端服务器。
            </Paragraph>
            <div style={{ 
              background: '#f6f8fa', 
              padding: '12px', 
              borderRadius: '6px',
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: '12px'
            }}>
              <pre>{`import { dataAPI } from './services/api';

// 获取地区数据
const locationData = await dataAPI.getPublishLocationData();

// 获取词云数据  
const wordCloudData = await dataAPI.getWordCloudData();`}</pre>
            </div>
          </Col>
          <Col span={12}>
            <Title level={4}>直接访问</Title>
            <Paragraph>
              也可以直接在浏览器中访问API端点查看JSON数据。
            </Paragraph>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="link" 
                onClick={() => window.open('http://localhost:8000/api/publish-location-data', '_blank')}
              >
                🥧 查看地区分布数据
              </Button>
              <Button 
                type="link" 
                onClick={() => window.open('http://localhost:8000/api/recommend-reason-wordcloud', '_blank')}
              >
                ☁️ 查看词云数据
              </Button>
              <Button 
                type="link" 
                onClick={() => window.open('http://localhost:8000/api/health', '_blank')}
              >
                ❤️ 检查服务健康状态
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ApiDocs;
