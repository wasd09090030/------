from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
import sqlite3
import json
from pathlib import Path
import re
from collections import Counter

app = FastAPI(title="数据可视化API", description="使用FastAPI和ECharts展示数据")

# 允许跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载静态文件
app.mount("/static", StaticFiles(directory="static"), name="static")

# 数据库路径
DB_PATH = "Sqlite/data.db"

def get_db_connection():
    """获取数据库连接"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # 使结果可以通过列名访问
    return conn

@app.get("/")
async def root():
    """根路径，返回主页"""
    return HTMLResponse("""
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>数据可视化平台</title>
        <style>
            body {
                font-family: 'Arial', '微软雅黑', sans-serif;
                margin: 0;
                padding: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container {
                text-align: center;
                background: white;
                padding: 50px;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                max-width: 600px;
            }
            .title {
                font-size: 36px;
                color: #333;
                margin-bottom: 20px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            }
            .subtitle {
                font-size: 18px;
                color: #666;
                margin-bottom: 40px;
            }
            .nav-buttons {
                display: flex;
                flex-direction: column;
                gap: 20px;
                align-items: center;
            }
            .nav-btn {
                display: block;
                padding: 15px 30px;
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                text-decoration: none;
                border-radius: 25px;
                font-size: 18px;
                font-weight: bold;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                min-width: 250px;
            }
            .nav-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            }
            .wordcloud-btn {
                background: linear-gradient(45deg, #f093fb, #f5576c);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="title">📊 数据可视化平台</div>
            <div class="subtitle">基于SQLite数据库的ECharts可视化展示</div>
            <div class="nav-buttons">
                <a href="/static/pie_chart.html" class="nav-btn">
                    🥧 投稿地区分布饼图
                </a>
                <a href="/wordcloud" class="nav-btn wordcloud-btn">
                    ☁️ 推荐理由词云分析
                </a>
                <a href="/api/publish-location-data" class="nav-btn" style="background: linear-gradient(45deg, #4facfe, #00f2fe);">
                    🔗 地区数据API
                </a>
                <a href="/api/recommend-reason-wordcloud" class="nav-btn" style="background: linear-gradient(45deg, #43e97b, #38f9d7);">
                    🔗 词云数据API
                </a>
            </div>
        </div>
    </body>
    </html>
    """)

@app.get("/api/publish-location-data")
async def get_publish_location_data():
    """获取发布地点统计数据"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 查询所有发布地点数据
        cursor.execute("SELECT * FROM publish_location_count")
        rows = cursor.fetchall()
        
        # 转换为前端需要的格式
        data = []
        for row in rows:
            # 这个表结构很特殊，数据存储在两列中
            # 第一列是地区名，第二列是数量
            location = str(row[0]) if row[0] else "未知"
            count_str = str(row[1]) if row[1] else "0"
            
            try:
                count = int(count_str)
            except ValueError:
                count = 0
            
            print(f"处理数据: {location} = {count}")
            
            if location and location != "未知":  # 只添加有效的地区名
                data.append({"name": location, "value": count})
        
        # 按数量降序排列
        data.sort(key=lambda x: x["value"], reverse=True)
        
        conn.close()
        
        print(f"总共处理了 {len(data)} 条数据")
        if data:
            print(f"前3条数据: {data[:3]}")
        
        return {
            "success": True,
            "data": data,
            "total": sum(item["value"] for item in data)
        }
        
    except Exception as e:
        print(f"API错误: {e}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e),
            "data": []
        }

@app.get("/wordcloud")
async def wordcloud_page():
    """词云页面"""
    return FileResponse("static/wordcloud.html")

@app.get("/api/recommend-reason-wordcloud")
async def get_recommend_reason_wordcloud():
    """获取推荐理由词云数据"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 查询所有推荐理由数据
        cursor.execute("SELECT recommend_reason FROM recommend_reason_count WHERE recommend_reason IS NOT NULL AND recommend_reason != ''")
        rows = cursor.fetchall()
        
        # 提取所有文本
        all_text = []
        for row in rows:
            text = str(row[0]).strip()
            if text:
                all_text.append(text)
        
        # 进行词频统计
        word_count = Counter()
        
        # 定义常见的停用词
        stop_words = {
            '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', 
            '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好',
            '这', '那', '来', '个', '为', '与', '及', '等', '更', '最', '非常', '特别',
            '真的', '特别', '超级', '绝对', '完全', '太', '很多', '许多', '大量'
        }
        
        for text in all_text:
            # 简单的词汇分割处理
            # 对于中文，我们主要基于标点符号和特殊字符进行分割
            words = re.findall(r'[\u4e00-\u9fff]+|[a-zA-Z]+|\d+', text)
            
            for word in words:
                word = word.strip()
                if len(word) >= 2 and word not in stop_words:  # 只保留长度>=2的词且不在停用词中
                    word_count[word] += 1
        
        # 获取最频繁的词汇，转换为ECharts词云格式
        most_common_words = word_count.most_common(100)  # 取前100个高频词
        
        wordcloud_data = []
        for word, count in most_common_words:
            wordcloud_data.append({
                "name": word,
                "value": count
            })
        
        conn.close()
        
        print(f"处理了 {len(all_text)} 条推荐理由")
        print(f"生成了 {len(wordcloud_data)} 个词汇")
        if wordcloud_data:
            print(f"前10个高频词: {wordcloud_data[:10]}")
        
        return {
            "success": True,
            "data": wordcloud_data,
            "total_reasons": len(all_text),
            "total_words": len(wordcloud_data)
        }
        
    except Exception as e:
        print(f"词云API错误: {e}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e),
            "data": []
        }

@app.get("/api/health")
async def health_check():
    """健康检查接口"""
    return {"status": "healthy", "message": "API运行正常"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
