import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, Button, Input, Select, message } from 'antd';
import { BarChartOutlined, SearchOutlined, ReloadOutlined, FireOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { dataAPI } from '../services/api';

const { Search } = Input;
const { Option } = Select;

const BarChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(20);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await dataAPI.getThemeNameData();
      console.log('主题数据:', response);
      if (response.success) {
        setData(response);
      } else {
        message.error('数据加载失败: ' + response.error);
      }
    } catch (error) {
      console.error('获取主题数据失败:', error);
      message.error('网络请求失败');
    } finally {
      setLoading(false);
    }
  };

  const filterData = React.useCallback(() => {
    if (!data || !data.data) return;
    
    let filtered = data.data;
    
    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 限制显示数量
    filtered = filtered.slice(0, displayCount);
    
    setFilteredData(filtered);
  }, [data, searchTerm, displayCount]);

  useEffect(() => {
    if (data && data.data) {
      filterData();
    }
  }, [data, searchTerm, displayCount, filterData]);

  const getChartOption = () => {
    if (!filteredData || filteredData.length === 0) return {};

    // 准备数据
    const themes = filteredData.map(item => item.name);
    const values = filteredData.map(item => item.value);

    return {
      title: {
        text: `📊 主题分布统计 (显示前 ${filteredData.length} 个)`,
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params) {
          const data = params[0];
          return `
            <div style="padding: 8px;">
              <strong>${data.name}</strong><br/>
              数量: <span style="color: #1890ff;">${data.value}</span><br/>
              占比: <span style="color: #52c41a;">${((data.value / data.data.total_count) * 100).toFixed(2)}%</span>
            </div>
          `;
        }
      },
      grid: {
        left: '15%',
        right: '8%',
        top: '10%',
        bottom: '8%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '数量',
        nameTextStyle: {
          color: '#666',
          fontSize: 12
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        axisLabel: {
          color: '#666',
          fontSize: 11
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#eee'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: themes.reverse(), // 反转以便最大值在上方
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        axisLabel: {
          color: '#666',
          fontSize: 11,
          width: 100,
          overflow: 'truncate',
          ellipsis: '...'
        },
        axisTick: {
          show: false
        }
      },
      series: [{
        type: 'bar',
        data: values.reverse(), // 对应反转
        itemStyle: {
          color: function(params) {
            // 根据数值大小设置颜色梯度
            const colors = [
              '#ff4d4f', // 红色 - 最高
              '#fa8c16', // 橙色
              '#faad14', // 黄色
              '#52c41a', // 绿色
              '#1890ff', // 蓝色
              '#722ed1'  // 紫色 - 最低
            ];
            const index = Math.floor((params.dataIndex / filteredData.length) * colors.length);
            return colors[Math.min(index, colors.length - 1)];
          },
          borderRadius: [0, 4, 4, 0]
        },
        label: {
          show: true,
          position: 'right',
          color: '#666',
          fontSize: 11,
          formatter: '{c}'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)'
          }
        },
        animationDelay: function (idx) {
          return idx * 10; // 延迟动画效果
        }
      }],
      animationEasing: 'elasticOut',
      animationDelayUpdate: function (idx) {
        return idx * 5;
      }
    };
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <p style={{ marginTop: 20, fontSize: 16, color: '#666' }}>正在加载主题统计数据...</p>
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
              title="主题总数"
              value={data.total_themes || 0}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="内容总量"
              value={data.total_count?.toLocaleString() || 0}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="最热门主题"
              value={data.top_theme || ''}
              valueStyle={{ color: '#fa8c16', fontSize: 16 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="数量范围"
              value={data.theme_range ? `${data.theme_range.max} ~ ${data.theme_range.min}` : ''}
              valueStyle={{ color: '#722ed1', fontSize: 16 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 控制面板 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Search
              placeholder="搜索主题名称"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={setSearchTerm}
              style={{ width: '100%' }}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              value={displayCount}
              onChange={setDisplayCount}
              style={{ width: '100%' }}
            >
              <Option value={10}>显示前10个</Option>
              <Option value={20}>显示前20个</Option>
              <Option value={30}>显示前30个</Option>
              <Option value={50}>显示前50个</Option>
              <Option value={99}>显示全部</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={fetchData}
              loading={loading}
              style={{ width: '100%' }}
            >
              刷新数据
            </Button>
          </Col>
          <Col xs={24} md={10}>
            <div style={{ color: '#666', fontSize: 14 }}>
              共 {data.total_themes} 个主题，当前显示 {filteredData.length} 个
              {searchTerm && ` (搜索: "${searchTerm}")`}
            </div>
          </Col>
        </Row>
      </Card>

      {/* 图表卡片 */}
      <Card 
        title={
          <span style={{ fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>
            📊 主题分布横向柱状图
          </span>
        }
        style={{ marginBottom: 24 }}
      >
        <div style={{ height: Math.max(400, filteredData.length * 25 + 100) }}>
          <ReactECharts
            option={getChartOption()}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
          />
        </div>
      </Card>

      {/* 详细排行榜 */}
      <Row gutter={24}>
        <Col xs={24} lg={12}>
          <Card 
            title="🏆 TOP 20 热门主题" 
            style={{ height: 500 }}
            bodyStyle={{ padding: '16px', overflowY: 'auto', maxHeight: 400 }}
          >
            {data.data.slice(0, 20).map((item, index) => (
              <div 
                key={item.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid #f0f0f0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    display: 'inline-block',
                    width: 24,
                    height: 24,
                    lineHeight: '24px',
                    textAlign: 'center',
                    borderRadius: '50%',
                    background: index < 3 ? '#ff4d4f' : index < 10 ? '#fa8c16' : '#1890ff',
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 'bold',
                    marginRight: 12
                  }}>
                    {index + 1}
                  </span>
                  <span style={{ color: '#333', fontWeight: index < 3 ? 'bold' : 'normal' }}>
                    {item.name}
                  </span>
                </div>
                <span style={{ 
                  color: '#1890ff', 
                  fontWeight: 'bold',
                  fontSize: 16
                }}>
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="📈 数据洞察" 
            style={{ height: 500 }}
            bodyStyle={{ padding: '16px' }}
          >
            <div style={{ lineHeight: '2em', color: '#666' }}>
              <p>🏆 <strong>最热门主题:</strong> {data.top_theme} ({data.theme_range?.max} 个内容)</p>
              <p>📊 <strong>主题多样性:</strong> 共有 {data.total_themes} 个不同主题分类</p>
              <p>📈 <strong>内容总量:</strong> {data.total_count?.toLocaleString()} 个主题内容</p>
              <p>🎯 <strong>分布特点:</strong></p>
              <ul style={{ marginLeft: 20 }}>
                <li>头部主题集中度较高</li>
                <li>长尾主题分布广泛</li>
                <li>主题分类层次丰富</li>
                <li>内容生态多元化发展</li>
              </ul>
              <p>💡 <strong>优化建议:</strong></p>
              <ul style={{ marginLeft: 20 }}>
                <li>重点运营热门主题</li>
                <li>挖掘潜力主题机会</li>
                <li>平衡内容分布结构</li>
                <li>培育新兴主题类别</li>
              </ul>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BarChart;
