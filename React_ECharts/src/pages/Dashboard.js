import React from 'react';
import { Row, Col, Card } from 'antd';
import PieChart from '../components/PieChart';
import WordCloud from '../components/WordCloud';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';

const Dashboard = () => {
  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        }}>
          📊 综合数据仪表板
        </h1>
        <p style={{ fontSize: '16px', color: '#666' }}>
          多维度数据可视化分析 - 地理分布 & 文本挖掘 & 时间趋势 & 主题统计
        </p>
      </div>

      <Row gutter={[24, 24]}>
        {/* 饼图部分 */}
        <Col span={24}>
          <Card 
            title="🥧 投稿地区分布分析" 
            style={{ marginBottom: '24px' }}
            headStyle={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            <PieChart />
          </Card>
        </Col>

        {/* 时间趋势部分 */}
        <Col span={24}>
          <Card 
            title="📈 投稿时间趋势分析" 
            style={{ marginBottom: '24px' }}
            headStyle={{ 
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            <LineChart />
          </Card>
        </Col>

        {/* 主题统计部分 */}
        <Col span={24}>
          <Card 
            title="📊 主题分布统计分析" 
            style={{ marginBottom: '24px' }}
            headStyle={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            <BarChart />
          </Card>
        </Col>

        {/* 词云部分 */}
        <Col span={24}>
          <Card 
            title="☁️ 推荐理由词云分析" 
            headStyle={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            <WordCloud />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
