# 📊 PyBigData - 综合数据可视化平台

一个现代化的数据可视化平台，基于 React + FastAPI + ECharts 构建，提供多种交互式图表展示和数据分析功能。

## ✨ 项目特色

- 🎨 **现代化UI** - 基于 React 18 和 Ant Design 的美观界面
- 📈 **多种图表** - 支持饼图、词云、折线图、横向柱状图
- 🔍 **智能搜索** - 实时搜索和过滤功能
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🚀 **高性能** - FastAPI 后端 + ECharts 渲染
- 💾 **SQLite 数据库** - 轻量级本地数据存储

## 🏗️ 项目架构

```
PyBigData/
├── app.py                         # FastAPI 后端服务器
├── requirements.txt               # Python 依赖包
├── start_server.bat              # Windows 启动脚本
├── React_ECharts/                 # React 前端应用
│   ├── public/
│   │   └── index.html            # HTML 模板
│   ├── src/
│   │   ├── components/           # React 组件
│   │   │   ├── BarChart.js       # 横向柱状图组件
│   │   │   ├── PieChart.js       # 饼图组件
│   │   │   ├── LineChart.js      # 折线图组件
│   │   │   ├── WordCloud.js      # 词云组件
│   │   │   └── Layout.js         # 布局组件
│   │   ├── pages/                # 页面组件
│   │   │   ├── Dashboard.js      # 主仪表板
│   │   │   ├── BarChartPage.js   # 主题统计页面
│   │   │   ├── Home.js           # 首页
│   │   │   └── ApiDocs.js        # API 文档页面
│   │   ├── services/
│   │   │   └── api.js            # API 服务层
│   │   ├── App.js                # 主应用组件
│   │   └── index.js              # 应用入口
│   └── package.json              # 前端依赖配置
└── Sqlite/
    ├── data.db                   # SQLite 数据库
    └── import_csv_to_sqlite.py   # 数据导入脚本
```

## 🎯 功能特性

### 📊 主题统计分析 (BarChart)
- 基于 `theme_name_count` 表数据展示99个主题
- 横向柱状图按数量降序排列
- 实时搜索和过滤功能
- 统计卡片显示总数和热门主题
- 支持滚动查看完整数据

### 🥧 地区分布统计 (PieChart)
- 基于 `publish_location_count` 表数据
- 交互式饼图展示投稿地区分布
- 统计信息：59个地区，7000+投稿
- 热门地区：广东(780)、浙江(617)、北京(582)

### ☁️ 推荐理由词云 (WordCloud)
- 基于 `recommend_reason_count` 表的2280条数据
- 智能中文分词和词频统计
- 高频词汇：百万播放(867)、万点赞(741)、人气飙升(315)
- 多种形状和样式选择

### 📈 时间分布分析 (LineChart)
- 基于 `video_publish_times` 表数据
- 展示7000条视频的发布时间分布
- 小时分布和日期范围统计
- 发布高峰时段分析

## 🚀 快速开始

### 环境要求

- **Python**: 3.8+
- **Node.js**: 16+
- **npm**: 7+

