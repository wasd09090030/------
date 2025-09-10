import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'http://localhost:8000' : '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log('发送请求:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log('收到响应:', response.data);
    return response.data;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// API接口函数
export const dataAPI = {
  // 获取地区分布数据
  getPublishLocationData: () => {
    return api.get('/api/publish-location-data');
  },

  // 获取词云数据
  getWordCloudData: () => {
    return api.get('/api/recommend-reason-wordcloud');
  },

  // 获取投稿时间分布数据
  getVideoPublishTimes: () => {
    return api.get('/api/video-publish-times');
  },

  // 获取主题名称统计数据
  getThemeNameData: () => {
    return api.get('/api/theme-name-data');
  },

  // 健康检查
  healthCheck: () => {
    return api.get('/api/health');
  },
};

export default api;
