# React 数据可视化仪表板

这是一个使用 React + ECharts + Ant Design 构建的现代化数据可视化平台，提供交互式图表展示和数据分析功能。

## 🌟 功能特性

### 📊 数据可视化
- **投稿地区分布饼图**: 基于地理位置的数据分析
- **推荐理由词云分析**: 文本挖掘和词频统计
- **综合仪表板**: 多图表组合展示
- **实时数据更新**: 与后端API实时同步

### 🎨 用户界面
- **现代化设计**: 使用渐变色彩和毛玻璃效果
- **响应式布局**: 适配桌面端和移动端
- **交互式图表**: 鼠标悬停、点击等交互效果
- **动画效果**: 平滑的页面切换和图表动画

### 🛠️ 技术栈
- **前端框架**: React 18
- **UI组件库**: Ant Design 5.x
- **图表库**: ECharts + ECharts-for-React
- **路由**: React Router v6
- **HTTP客户端**: Axios
- **样式**: CSS3 + 渐变动画

## 📦 项目结构

```
src/
├── components/           # 可复用组件
│   ├── Layout.js        # 应用布局组件
│   ├── PieChart.js      # 饼图组件
│   └── WordCloud.js     # 词云组件
├── pages/               # 页面组件
│   ├── Home.js          # 首页
│   ├── Dashboard.js     # 仪表板页面
│   └── ApiDocs.js       # API文档页面
├── services/            # 服务层
│   └── api.js           # API接口封装
├── App.js               # 主应用组件
├── App.css              # 全局样式
└── index.js             # 应用入口
```

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 启动开发服务器
```bash
npm start
# 或
yarn start
```

项目将在 http://localhost:3000 启动

### 构建生产版本
```bash
npm run build
# 或
yarn build
```

## 🔧 配置说明

### API代理配置
在 `package.json` 中配置了代理：
```json
{
  "proxy": "http://localhost:8000"
}
```

这样前端请求会自动转发到后端API服务器。

### 主题配置
在 `App.js` 中自定义了Ant Design主题：
```javascript
const theme = {
  token: {
    colorPrimary: '#667eea',
    borderRadius: 8,
    fontFamily: '微软雅黑'
  }
};
```

## 📱 页面说明

### 🏠 首页 (/)
- 项目介绍和功能导航
- 技术栈展示
- 快速访问各个功能模块

### 🥧 饼图分析 (/pie-chart)
- 投稿地区分布可视化
- 统计数据展示
- 排行榜列表
- 交互式图表操作

### ☁️ 词云分析 (/word-cloud)
- 推荐理由词频分析
- 多种词云形状选择
- 可调节显示参数
- 高频词汇排行榜

### 📊 综合仪表板 (/dashboard)
- 多图表组合展示
- 一站式数据分析视图

### 🔗 API文档 (/api-docs)
- 后端接口说明
- 实时服务状态监控
- 接口测试功能

## 🎯 核心功能

### 数据获取
使用Axios封装的API服务：
```javascript
import { dataAPI } from './services/api';

// 获取地区数据
const locationData = await dataAPI.getPublishLocationData();

// 获取词云数据
const wordCloudData = await dataAPI.getWordCloudData();
```

### 图表渲染
使用ECharts-for-React组件：
```javascript
<ReactECharts
  option={chartOption}
  style={{ height: '600px' }}
  opts={{ renderer: 'canvas' }}
/>
```

### 响应式设计
使用Ant Design的栅格系统：
```javascript
<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} lg={6}>
    <Card>...</Card>
  </Col>
</Row>
```

## 🔍 开发说明

### 代码规范
- 使用函数式组件和Hooks
- 统一的错误处理机制
- 组件懒加载优化
- CSS-in-JS样式管理

### 性能优化
- React.memo缓存组件
- 图表懒加载
- 代码分割
- 静态资源优化

### 浏览器兼容性
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🐛 常见问题

### API连接失败
确保后端FastAPI服务器在 http://localhost:8000 正常运行。

### 图表不显示
检查ECharts相关依赖是否正确安装：
```bash
npm install echarts echarts-for-react echarts-wordcloud
```

### 样式异常
清除浏览器缓存或使用无痕模式测试。

## 📄 开源协议

MIT License

## 👥 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

## 🔗 相关链接

- [ECharts官网](https://echarts.apache.org/)
- [Ant Design官网](https://ant.design/)
- [React官网](https://reactjs.org/)

---

🎉 感谢使用我们的数据可视化平台！
