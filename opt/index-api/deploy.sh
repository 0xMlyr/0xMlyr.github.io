#!/bin/bash

echo "=== Index API 快速部署 ==="

# 1. 安装Python依赖
echo "[1/3] 安装Python依赖..."
pip3 install Flask==3.0.0 flask-cors==4.0.0

# 2. 配置systemd服务
echo "[2/3] 配置服务..."
cp /opt/index-api/index-api.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable index-api.service
systemctl restart index-api.service

# 3. 验证
echo "[3/3] 验证服务..."
sleep 2
systemctl status index-api.service --no-pager
curl -s http://localhost:5099/api/count

echo ""
echo "=== 部署完成 ==="
echo "请手动将 caddy-snippet.txt 内容添加到你的 Caddyfile 中"
echo "然后执行: caddy reload --config /path/to/your/Caddyfile"
