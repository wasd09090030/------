from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import json
from pathlib import Path
import re
from collections import Counter

app = FastAPI(title="数据可视化API", description="基于React+ECharts+SQLite的数据可视化后端API服务")

# 允许跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据库路径
DB_PATH = "Sqlite/data.db"

def get_db_connection():
    """获取数据库连接"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # 使结果可以通过列名访问
    return conn

@app.get("/")
async def root():
    """根路径，返回API信息"""
    return {
        "message": "数据可视化API服务",
        "description": "基于React+ECharts+SQLite的数据可视化后端API服务",
        "frontend": "http://localhost:3000",
        "endpoints": [
            {"path": "/api/publish-location-data", "method": "GET", "description": "获取投稿地区分布数据"},
            {"path": "/api/recommend-reason-wordcloud", "method": "GET", "description": "获取推荐理由词云数据"},
            {"path": "/api/video-publish-times", "method": "GET", "description": "获取投稿时间分布数据"},
            {"path": "/api/theme-name-data", "method": "GET", "description": "获取主题分布统计数据"},
            {"path": "/api/health", "method": "GET", "description": "健康检查"}
        ]
    }

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
            '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一个', 
            '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好',
            '这', '那', '来', '个', '为', '与', '及', '等', '更', '最', '非常', '特别',
            '真的', '特别', '超级', '绝对', '完全', '太', '很多', '许多', '大量'
        }
        
        for text in all_text:
            # 简单的词汇分割处理
            words = re.findall(r'[\u4e00-\u9fffa-zA-Z]+|\d+', text)
            
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

@app.get("/api/theme-name-data")
async def get_theme_name_data():
    """获取主题名称统计数据"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 查询所有主题名称数据
        cursor.execute("SELECT themeName, count FROM theme_name_count WHERE themeName IS NOT NULL AND count IS NOT NULL")
        rows = cursor.fetchall()
        
        # 转换为前端需要的格式
        data = []
        for row in rows:
            theme_name = str(row[0]).strip() if row[0] else "未知主题"
            count_str = str(row[1]).strip() if row[1] else "0"
            
            try:
                count = int(count_str)
            except ValueError:
                count = 0
            
            if theme_name and theme_name != "未知主题":
                data.append({"name": theme_name, "value": count})
        
        # 按数量降序排列
        data.sort(key=lambda x: x["value"], reverse=True)
        
        conn.close()
        
        print(f"处理了 {len(data)} 条主题数据")
        if data:
            print(f"前5条数据: {data[:5]}")
            print(f"数量最多的主题: {data[0]['name']} ({data[0]['value']})")
        
        return {
            "success": True,
            "data": data,
            "total_themes": len(data),
            "total_count": sum(item["value"] for item in data),
            "top_theme": data[0]["name"] if data else "",
            "theme_range": {
                "max": data[0]["value"] if data else 0,
                "min": data[-1]["value"] if data else 0
            }
        }
        
    except Exception as e:
        print(f"主题名称API错误: {e}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e),
            "data": []
        }

@app.get("/api/video-publish-times")
async def get_video_publish_times():
    """获取视频投稿时间分布数据"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 查询所有投稿时间数据
        cursor.execute("SELECT publish_time FROM video_publish_times WHERE publish_time IS NOT NULL")
        rows = cursor.fetchall()
        
        # 处理时间数据，按小时统计分布
        from datetime import datetime
        from collections import defaultdict
        
        hour_count = defaultdict(int)  # 按小时统计
        date_count = defaultdict(int)  # 按日期统计
        weekday_count = defaultdict(int)  # 按星期统计
        
        for row in rows:
            try:
                # 解析ISO时间格式
                time_str = row[0].replace('.000Z', '')
                dt = datetime.fromisoformat(time_str.replace('Z', '+00:00'))
                
                # 按小时统计 (0-23)
                hour = dt.hour
                hour_count[hour] += 1
                
                # 按日期统计
                date = dt.strftime('%Y-%m-%d')
                date_count[date] += 1
                
                # 按星期几统计 (0=Monday, 6=Sunday)
                weekday = dt.weekday()
                weekday_names = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                weekday_count[weekday_names[weekday]] += 1
                
            except Exception as e:
                print(f"解析时间出错: {row[0]} - {e}")
                continue
        
        # 转换为前端图表格式
        
        # 1. 按小时分布（折线图）
        hourly_data = []
        hours_x = []
        hours_y = []
        for hour in range(24):
            hours_x.append(f"{hour:02d}:00")
            hours_y.append(hour_count[hour])
            hourly_data.append({"hour": f"{hour:02d}:00", "count": hour_count[hour]})
        
        # 2. 按日期分布（折线图，只取最近30天或数据最密集的时间段）
        sorted_dates = sorted(date_count.items())
        daily_x = []
        daily_y = []
        # 取最后30个有数据的日期
        recent_dates = sorted_dates[-30:] if len(sorted_dates) > 30 else sorted_dates
        for date, count in recent_dates:
            daily_x.append(date)
            daily_y.append(count)
        
        # 3. 按星期分布（柱状图数据也可用折线图显示）
        weekday_x = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        weekday_y = [weekday_count[day] for day in weekday_x]
        
        conn.close()
        
        print(f"处理了 {len(rows)} 条时间数据")
        print(f"小时分布: {dict(sorted(hour_count.items())[:5])}...")
        print(f"日期范围: {min(date_count.keys())} 到 {max(date_count.keys())}")
        
        return {
            "success": True,
            "data": {
                "hourly": {
                    "categories": hours_x,
                    "series": hours_y,
                    "raw_data": hourly_data
                },
                "daily": {
                    "categories": daily_x,
                    "series": daily_y,
                    "date_range": f"{min(date_count.keys())} 到 {max(date_count.keys())}"
                },
                "weekday": {
                    "categories": weekday_x,
                    "series": weekday_y
                }
            },
            "total_videos": len(rows),
            "date_range": {
                "start": min(date_count.keys()),
                "end": max(date_count.keys())
            },
            "peak_hour": max(hour_count.items(), key=lambda x: x[1])[0] if hour_count else 0,
            "peak_weekday": max(weekday_count.items(), key=lambda x: x[1])[0] if weekday_count else "周一"
        }
        
    except Exception as e:
        print(f"视频时间分布API错误: {e}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e),
            "data": {"hourly": {"categories": [], "series": []}, "daily": {"categories": [], "series": []}, "weekday": {"categories": [], "series": []}}
        }

@app.get("/api/health")
async def health_check():
    """健康检查接口"""
    return {"status": "healthy", "message": "API运行正常"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
