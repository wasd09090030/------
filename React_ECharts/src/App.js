import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppLayout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ApiDocs from './pages/ApiDocs';
import LineChartPage from './pages/LineChartPage';
import BarChartPage from './pages/BarChartPage';
import PieChart from './components/PieChart';
import WordCloud from './components/WordCloud';
import './App.css';

// 自定义主题配置
const theme = {
  token: {
    colorPrimary: '#667eea',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    borderRadius: 8,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "微软雅黑"',
  },
  components: {
    Card: {
      borderRadius: 12,
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    },
    Button: {
      borderRadius: 8,
    },
  },
};

function App() {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pie-chart" element={<PieChart />} />
            <Route path="/word-cloud" element={<WordCloud />} />
            <Route path="/line-chart" element={<LineChartPage />} />
            <Route path="/bar-chart" element={<BarChartPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/api-docs" element={<ApiDocs />} />
          </Routes>
        </AppLayout>
      </Router>
    </ConfigProvider>
  );
}

export default App;
