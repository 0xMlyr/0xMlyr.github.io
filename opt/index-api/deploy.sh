#!/bin/bash

echo "=== Index API 快速部署 ==="

# 安装依赖
echo "[1/3] 安装依赖..."
apt update
apt install -y python3-flask python3-flask-cors

# 配置服务
echo "[2/3] 配置服务..."
cp /opt/index-api/index-api.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable index-api.service
systemctl restart index-api.service

# 验证
echo "[3/3] 验证..."
sleep 2
systemctl status index-api.service --no-pager
curl -s http://localhost:5099/api/count

echo ""
echo "=== 部署完成 ==="
echo "请更新Caddyfile并重启Caddy Docker"
