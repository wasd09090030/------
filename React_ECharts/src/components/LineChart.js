import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, Button, Select, message } from 'antd';
import { ClockCircleOutlined, CalendarOutlined, BarChartOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { dataAPI } from '../services/api';

const { Option } = Select;

const LineChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [currentChart, setCurrentChart] = useState('hourly');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await dataAPI.getVideoPublishTimes();
      console.log('时间分布数据:', response);
      if (response.success) {
        setData(response);
      } else {
        message.error('数据加载失败: ' + response.error);
      }
    } catch (error) {
      console.error('获取时间分布数据失败:', error);
      message.error('网络请求失败');
    } finally {
      setLoading(false);
    }
  };

  const getChartOption = () => {
    if (!data) return {};

    const commonOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        textStyle: {
          fontSize: 14
        }
      },
      legend: {
        data: [getChartTitle()],
        top: 10,
        textStyle: {
          fontSize: 14
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        top: '15%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {
            title: '保存图片'
          },
          dataZoom: {
            title: {
              zoom: '区域缩放',
              back: '区域缩放还原'
            }
          },
          restore: {
            title: '还原'
          }
        },
        right: 20
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100,
          height: 30,
          bottom: 20
        }
      ]
    };

    const currentData = data.data[currentChart];
    
    if (currentChart === 'hourly') {
      return {
        ...commonOption,
        title: {
          text: '📊 24小时投稿分布趋势',
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: currentData.categories,
          axisLabel: {
            fontSize: 12,
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '投稿数量',
          nameTextStyle: {
            color: '#666'
          },
          axisLabel: {
            fontSize: 12,
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#eee'
            }
          }
        },
        series: [{
          name: '投稿数量',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 3,
            color: '#1890ff'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(24, 144, 255, 0.3)'
              }, {
                offset: 1, color: 'rgba(24, 144, 255, 0.05)'
              }]
            }
          },
          data: currentData.series,
          markPoint: {
            data: [
              { type: 'max', name: '最高峰' },
              { type: 'min', name: '最低谷' }
            ],
            itemStyle: {
              color: '#ff4d4f'
            }
          },
          markLine: {
            data: [
              { type: 'average', name: '平均值' }
            ],
            lineStyle: {
              color: '#faad14'
            }
          }
        }]
      };
    } else if (currentChart === 'daily') {
      return {
        ...commonOption,
        title: {
          text: '📅 每日投稿数量趋势',
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: currentData.categories,
          axisLabel: {
            fontSize: 10,
            rotate: 45,
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '投稿数量',
          nameTextStyle: {
            color: '#666'
          },
          axisLabel: {
            fontSize: 12,
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#eee'
            }
          }
        },
        series: [{
          name: '每日投稿',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: {
            width: 2,
            color: '#52c41a'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(82, 196, 26, 0.3)'
              }, {
                offset: 1, color: 'rgba(82, 196, 26, 0.05)'
              }]
            }
          },
          data: currentData.series,
          markLine: {
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
        }]
      };
    } else if (currentChart === 'weekday') {
      return {
        ...commonOption,
        title: {
          text: '📊 星期分布规律',
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333'
          }
        },
        xAxis: {
          type: 'category',
          data: currentData.categories,
          axisLabel: {
            fontSize: 12,
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '投稿数量',
          nameTextStyle: {
            color: '#666'
          },
          axisLabel: {
            fontSize: 12,
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#eee'
            }
          }
        },
        series: [{
          name: '星期分布',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            width: 3,
            color: '#722ed1'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(114, 46, 209, 0.3)'
              }, {
                offset: 1, color: 'rgba(114, 46, 209, 0.05)'
              }]
            }
          },
          data: currentData.series,
          markPoint: {
            data: [
              { type: 'max', name: '最高' },
              { type: 'min', name: '最低' }
            ]
          }
        }]
      };
    }
  };

  const getChartTitle = () => {
    const titles = {
      hourly: '24小时分布',
      daily: '每日趋势',
      weekday: '星期分布'
    };
    return titles[currentChart];
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <p style={{ marginTop: 20, fontSize: 16, color: '#666' }}>正在加载时间分布数据...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p style={{ fontSize: 16, color: '#999' }}>数据加载失败，请重试</p>
        <Button type="primary" onClick={fetchData}>重新加载</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 统计卡片 */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="视频总数"
              value={data.total_videos?.toLocaleString() || 0}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="投稿高峰时段"
              value={`${data.peak_hour || 0}:00`}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="最活跃星期"
              value={data.peak_weekday || '周一'}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="数据时间范围"
              value={data.date_range ? `${data.date_range.start.slice(5)} ~ ${data.date_range.end.slice(5)}` : ''}
              valueStyle={{ color: '#fa8c16', fontSize: 16 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表控制卡片 */}
      <Card 
        title={
          <span style={{ fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>
            📈 投稿时间分布分析
          </span>
        }
        extra={
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Select
              value={currentChart}
              onChange={setCurrentChart}
              style={{ width: 150 }}
            >
              <Option value="hourly">24小时分布</Option>
              <Option value="daily">每日趋势</Option>
              <Option value="weekday">星期分布</Option>
            </Select>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={fetchData}
              loading={loading}
            >
              刷新数据
            </Button>
          </div>
        }
        style={{ marginBottom: 24 }}
      >
        <div style={{ height: 450 }}>
          <ReactECharts
            option={getChartOption()}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
          />
        </div>
      </Card>

      {/* 数据解读卡片 */}
      <Row gutter={24}>
        <Col xs={24} lg={12}>
          <Card 
            title="📊 数据洞察" 
            style={{ height: 300 }}
            bodyStyle={{ padding: '16px' }}
          >
            <div style={{ lineHeight: '2em', color: '#666' }}>
              {currentChart === 'hourly' && (
                <>
                  <p>🕐 <strong>投稿高峰时段:</strong> {data.peak_hour}:00 - {(data.peak_hour + 1) % 24}:00</p>
                  <p>📊 该时段投稿数量最多，建议在此时发布内容以获得更多曝光</p>
                  <p>🌙 深夜和凌晨时段投稿相对较少</p>
                  <p>☀️ 白天时段（9:00-18:00）通常是投稿活跃期</p>
                </>
              )}
              {currentChart === 'daily' && (
                <>
                  <p>📅 <strong>数据时间跨度:</strong> {data.date_range?.start} 到 {data.date_range?.end}</p>
                  <p>📈 显示最近30天的投稿趋势变化</p>
                  <p>⚡ 可以观察到投稿量的周期性波动</p>
                  <p>📊 建议关注高峰日期的内容策略</p>
                </>
              )}
              {currentChart === 'weekday' && (
                <>
                  <p>🏆 <strong>最活跃星期:</strong> {data.peak_weekday}</p>
                  <p>📊 工作日 vs 周末的投稿习惯存在明显差异</p>
                  <p>⏰ 建议在活跃度高的星期发布重要内容</p>
                  <p>🎯 了解用户的周期性行为模式</p>
                </>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="🎯 优化建议" 
            style={{ height: 300 }}
            bodyStyle={{ padding: '16px' }}
          >
            <div style={{ lineHeight: '2em', color: '#666' }}>
              <p>🚀 <strong>内容发布策略:</strong></p>
              <p>• 选择高峰时段发布重要内容</p>
              <p>• 避开低谷期，减少资源浪费</p>
              <p>• 根据星期规律制定发布计划</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LineChart;
