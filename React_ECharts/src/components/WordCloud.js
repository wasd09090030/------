import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, Spin, Alert, Row, Col, Statistic, Select, Slider, Button } from 'antd';
import { CloudOutlined, FileTextOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { dataAPI } from '../services/api';
import 'echarts-wordcloud';

const { Option } = Select;

const WordCloud = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [shape, setShape] = useState('circle');
  const [maxWords, setMaxWords] = useState(60);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dataAPI.getWordCloudData();
      
      if (response.success && response.data) {
        setData(response.data);
        setStats({
          totalReasons: response.total_reasons,
          totalWords: response.total_words,
          topWord: response.data[0]?.name || '无数据'
        });
      } else {
        throw new Error(response.error || '没有找到词云数据');
      }
    } catch (err) {
      setError(err.message);
      console.error('加载词云数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const getOption = () => {
    const displayData = data.slice(0, maxWords);
    
    return {
      backgroundColor: 'transparent',
      tooltip: {
        formatter: function(params) {
          const percent = ((params.value / stats.totalReasons) * 100).toFixed(2);
          return `
            <div style="padding: 12px; background: linear-gradient(45deg, #667eea, #764ba2); color: white; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
              <strong>词汇:</strong> ${params.name}<br/>
              <strong>频次:</strong> ${params.value}<br/>
              <strong>占比:</strong> ${percent}%
            </div>
          `;
        }
      },
      series: [{
        type: 'wordCloud',
        shape: shape,
        keepAspect: false,
        left: 'center',
        top: 'center',
        width: '90%',
        height: '90%',
        sizeRange: [14, 80],
        rotationRange: [-45, 45],
        rotationStep: 15,
        gridSize: 8,
        drawOutOfBound: false,
        layoutAnimation: true,
        textStyle: {
          fontFamily: 'Microsoft YaHei, Arial, sans-serif',
          fontWeight: function (params) {
            return params.value > 100 ? 'bold' : params.value > 50 ? '600' : 'normal';
          },
          color: function () {
            const colors = [
              '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
              '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
              '#10ac84', '#ee5a6f', '#60a3bc', '#778ca3', '#4b6584',
              '#f8b500', '#eb4d4b', '#6c5ce7', '#a29bfe', '#fd79a8',
              '#e17055', '#00b894', '#0984e3', '#b2bec3', '#ddd'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
          }
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            shadowBlur: 15,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            textBorderColor: 'rgba(255, 255, 255, 0.5)',
            textBorderWidth: 2
          }
        },
        data: displayData
      }]
    };
  };

  const randomizeWordCloud = () => {
    const shapes = ['circle', 'cardioid', 'diamond', 'triangle-forward', 'pentagon', 'star'];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const randomWords = Math.floor(Math.random() * 80) + 20;
    
    setShape(randomShape);
    setMaxWords(randomWords);
  };

  const resetWordCloud = () => {
    setShape('circle');
    setMaxWords(60);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: '#666' }}>正在加载词云数据...</p>
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
          <Button type="primary" onClick={loadData}>
            重试
          </Button>
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
              title="推荐理由总数"
              value={stats.totalReasons}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="词汇种类"
              value={stats.totalWords}
              prefix={<CloudOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="最高频词汇"
              value={stats.topWord}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 控制面板 */}
      <Card title="🎨 词云控制面板" style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <div>
              <label style={{ fontWeight: 'bold', marginRight: 8 }}>词云形状：</label>
              <Select
                value={shape}
                onChange={setShape}
                style={{ width: '100%' }}
              >
                <Option value="circle">圆形</Option>
                <Option value="cardioid">心形</Option>
                <Option value="diamond">菱形</Option>
                <Option value="triangle-forward">三角形</Option>
                <Option value="pentagon">五边形</Option>
                <Option value="star">星形</Option>
              </Select>
            </div>
          </Col>
          <Col span={6}>
            <div>
              <label style={{ fontWeight: 'bold', marginBottom: 8, display: 'block' }}>
                显示词数：{maxWords}
              </label>
              <Slider
                min={20}
                max={100}
                value={maxWords}
                onChange={setMaxWords}
              />
            </div>
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={randomizeWordCloud} style={{ marginRight: 8 }}>
              🎲 随机生成
            </Button>
            <Button onClick={resetWordCloud}>
              🔄 重置样式
            </Button>
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={loadData}>
              刷新数据
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 词云图 */}
      <Card title="推荐理由词云分析">
        <ReactECharts
          option={getOption()}
          style={{ height: '600px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </Card>

      {/* 高频词汇排行榜 */}
      <Card title="🏆 高频词汇排行榜（前20名）" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          {data.slice(0, 20).map((item, index) => (
            <Col span={6} key={item.name}>
              <Card 
                size="small" 
                style={{ 
                  background: index < 3 ? 
                    `linear-gradient(45deg, ${['#ff6b6b', '#4ecdc4', '#45b7d1'][index]}, ${['#ff9ff3', '#96ceb4', '#feca57'][index]})` : 
                    '#f8f9fa',
                  color: index < 3 ? 'white' : 'inherit'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold' }}>
                    {index + 1}. {item.name}
                  </span>
                  <span style={{ 
                    fontWeight: 'bold',
                    background: index < 3 ? 'rgba(255,255,255,0.3)' : '#1890ff',
                    color: index < 3 ? 'white' : 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
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

export default WordCloud;
