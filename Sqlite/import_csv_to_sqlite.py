import sqlite3
import csv
import os
from pathlib import Path

def get_column_names_and_create_table(cursor, table_name, header):
    """根据 CSV 的 header 创建表，所有列默认 TEXT 类型"""
    columns = ", ".join([f'"{col}" TEXT' for col in header])
    create_table_sql = f'CREATE TABLE IF NOT EXISTS "{table_name}" ({columns})'
    cursor.execute(create_table_sql)

def insert_csv_data(cursor, table_name, rows, header):
    """批量插入数据"""
    placeholders = ", ".join(["?"] * len(header))
    insert_sql = f'INSERT INTO "{table_name}" VALUES ({placeholders})'
    cursor.executemany(insert_sql, rows)

def import_csv_to_sqlite(csv_dir, db_path):
    """主函数：导入目录下所有 CSV 到 SQLite"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    csv_path = Path(csv_dir)
    if not csv_path.exists():
        print(f"目录不存在: {csv_dir}")
        return

    for csv_file in csv_path.glob("*.csv"):
        table_name = csv_file.stem  # 文件名（不含扩展名）作为表名

        print(f"正在处理: {csv_file.name} -> 表: {table_name}")

        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            try:
                header = next(reader)  # 第一行为列名
            except StopIteration:
                print(f"  ⚠️ 文件为空: {csv_file.name}")
                continue

            # 创建表
            get_column_names_and_create_table(cursor, table_name, header)

            # 读取所有行
            rows = list(reader)

            if not rows:
                print(f"  ⚠️ 无数据行: {csv_file.name}")
                continue

            # 插入数据
            insert_csv_data(cursor, table_name, rows, header)
            print(f"  ✅ 导入完成，共 {len(rows)} 行")

    conn.commit()
    conn.close()
    print(f"\n🎉 所有 CSV 文件已导入到 {db_path}")

if __name__ == "__main__":
    # 配置部分
    CSV_DIRECTORY = "csv_files"   # CSV 文件所在目录
    DATABASE_PATH = "data.db"     # 输出的 SQLite 数据库文件

    import_csv_to_sqlite(CSV_DIRECTORY, DATABASE_PATH)