# 数据可视化项目 - 投稿地区分布饼图 & 推荐理由词云

这个项目使用 FastAPI 后端连接 SQLite 数据库，并使用 ECharts 在前端展示数据可视化图表。

## 项目结构

```
PyBigData/
├── app.py                         # FastAPI 后端应用
├── requirements.txt               # Python 依赖包
├── start_server.bat              # Windows 启动脚本
├── standalone_pie_chart.html     # 独立的饼图HTML（推荐）
├── standalone_wordcloud.html     # 独立的词云HTML（推荐）
├── static/
│   ├── pie_chart.html            # 动态饼图（需要服务器）
│   └── wordcloud.html            # 动态词云（需要服务器）
└── Sqlite/
    └── data.db                   # SQLite 数据库文件
```

## 功能特性

### 📊 投稿地区分布饼图
- 基于 `publish_location_count` 表数据
- 交互式饼图展示投稿地区分布
- 统计信息显示：地区数量、总投稿数、投稿最多地区
- 前20名地区详细列表

### ☁️ 推荐理由词云分析
- 基于 `recommend_reason_count` 表的2280条推荐理由
- 智能词频统计和文本处理
- 多种词云形状选择（圆形、心形、菱形等）
- 可调节显示词汇数量
- 高频词汇排行榜
- 随机生成和重置功能

## 使用方法

### 方法一：独立HTML文件（推荐）

1. **饼图**: 直接双击打开 `standalone_pie_chart.html`
2. **词云**: 直接双击打开 `standalone_wordcloud.html`
3. 无需启动服务器，可直接在浏览器中查看

### 方法二：使用FastAPI服务器

1. **安装依赖**：
   ```bash
   pip install fastapi uvicorn
   ```

2. **启动服务器**：
   - 双击运行 `start_server.bat`
   - 或者在命令行中运行：
     ```bash
     python app.py
     ```

3. **查看可视化**：
   - 主页：http://localhost:8000
   - 饼图：http://localhost:8000/static/pie_chart.html
   - 词云：http://localhost:8000/wordcloud

## API接口

### GET /api/publish-location-data
返回投稿地区分布数据

**响应格式：**
```json
{
    "success": true,
    "data": [
        {"name": "广东", "value": 780},
        {"name": "浙江", "value": 617}
    ],
    "total": 7053
}
```

### GET /api/recommend-reason-wordcloud
返回推荐理由词云数据

**响应格式：**
```json
{
    "success": true,
    "data": [
        {"name": "百万播放", "value": 867},
        {"name": "万点赞", "value": 741}
    ],
    "total_reasons": 2280,
    "total_words": 100
}
```

## 数据源说明

### 投稿地区分布数据
- **表名**: `publish_location_count`
- **数据量**: 58个地区，7053个投稿
- **热门地区**: 广东(780)、浙江(617)、北京(582)

### 推荐理由词云数据
- **表名**: `recommend_reason_count` 
- **数据量**: 2280条推荐理由
- **高频词汇**: 百万播放(867次)、万点赞(741次)、人气飙升(315次)

## 技术特点

### 后端技术
- 🚀 FastAPI 高性能后端
- 💾 SQLite 数据库连接
- 🔤 智能中文文本处理
- 📊 词频统计算法

### 前端技术
- 📱 响应式设计，支持移动端
- 🎨 美观的现代化UI界面
- ⚡ ECharts 高性能图表渲染
- 🌈 渐变色彩和动画效果
- 🎭 多种词云形状和样式

### 词云处理算法
- 中文文本智能分词
- 停用词过滤
- 高频词汇提取
- 词频权重计算

## 浏览器兼容性

支持所有现代浏览器：
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 使用技巧

### 词云交互
- 🖱️ 鼠标悬停查看词频详情
- 🎲 点击"随机生成"体验不同样式
- 📊 调节滑块控制显示词汇数量
- 🎭 切换不同形状查看效果

### 性能优化
- 独立HTML版本加载更快
- 服务器版本支持实时数据更新
- 响应式设计适配各种屏幕

## 开发者信息

- **后端**: FastAPI + SQLite + Python文本处理
- **前端**: HTML + JavaScript + ECharts + ECharts-WordCloud
- **样式**: CSS3 渐变和动画效果
- **数据处理**: 中文分词 + 词频统计
