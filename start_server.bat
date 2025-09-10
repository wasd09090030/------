@echo off
echo 启动数据可视化服务器...
echo.
echo 服务器地址: http://localhost:8000
echo 按 Ctrl+C 停止服务器
echo.
cd /d "%~dp0"
python app.py
pause
