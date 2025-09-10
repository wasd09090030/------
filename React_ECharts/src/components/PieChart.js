import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, Spin, Alert, Row, Col, Statistic } from 'antd';
import { PieChartOutlined, EnvironmentOutlined, FileTextOutlined } from '@ant-design/icons';
import { dataAPI } from '../services/api';

const PieChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dataAPI.getPublishLocationData();
      
      if (response.success) {
        setData(response.data);
        setStats({
          totalRegions: response.data.length,
          totalVideos: response.total,
          topRegion: response.data[0]?.name || '无数据'
        });
      } else {
        throw new Error(response.error || '数据加载失败');
      }
    } catch (err) {
      setError(err.message);
      console.error('加载饼图数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const getOption = () => {
    return {
      title: {
        text: '投稿地区分布',
        subtext: '数据来源：publish_location_count 表',
        left: 'center',
        textStyle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#333'
        },
        subtextStyle: {
          fontSize: 14,
          color: '#666'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          const percent = ((params.value / stats.totalVideos) * 100).toFixed(1);
          return `
            <div style="padding: 10px;">
              <strong>${params.name}</strong><br/>
              投稿数量: <span style="color: #1890ff; font-weight: bold;">${params.value}</span><br/>
              占比: <span style="color: #52c41a; font-weight: bold;">${percent}%</span>
            </div>
          `;
        }
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        data: data.map(item => item.name),
        textStyle: {
          fontSize: 12
        }
      },
      series: [
        {
          name: '投稿地区分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold',
              formatter: function(params) {
                const percent = ((params.value / stats.totalVideos) * 100).toFixed(1);
                return `${params.name}\n${params.value}\n${percent}%`;
              }
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          labelLine: {
            show: false
          },
          data: data,
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      ],
      color: [
        '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
        '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#d4a677',
        '#5fb3d4', '#b6a2de', '#ffb248', '#7fbe9e', '#ea9999',
        '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9'
      ]
    };
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: '#666' }}>正在加载饼图数据...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="数据加载失败"
        description={error}
        type="error"
        showIcon
        action={
          <button 
            onClick={loadData}
            style={{
              background: '#1890ff',
              color: 'white',
              border: 'none',
              padding: '4px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            重试
          </button>
        }
      />
    );
  }

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="地区数量"
              value={stats.totalRegions}
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="总投稿数"
              value={stats.totalVideos}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="投稿最多地区"
              value={stats.topRegion}
              prefix={<PieChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 饼图 */}
      <Card 
        title="投稿地区分布饼图" 
        extra={
          <button 
            onClick={loadData}
            style={{
              background: '#1890ff',
              color: 'white',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            刷新数据
          </button>
        }
      >
        <ReactECharts
          option={getOption()}
          style={{ height: '600px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
          theme="default"
        />
      </Card>

      {/* 排行榜 */}
      <Card title="投稿数量排行榜（前20名）" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          {data.slice(0, 20).map((item, index) => (
            <Col span={6} key={item.name}>
              <Card size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: '#333' }}>
                    {index + 1}. {item.name}
                  </span>
                  <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
                    {item.value}
                  </span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default PieChart;
