#!/bin/bash

echo "=== 开始部署 Index API 服务 ==="

# 1. 安装Python依赖
echo "[1/5] 安装Python依赖..."
pip3 install -r /opt/index-api/requirements.txt

# 2. 设置文件权限
echo "[2/5] 设置文件权限..."
chmod +x /opt/index-api/app.py
chmod 644 /opt/index-api/num.txt
chmod 644 /opt/index-api/customer.log

# 3. 配置systemd服务
echo "[3/5] 配置systemd服务..."
cp /opt/index-api/index-api.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable index-api.service
systemctl restart index-api.service

# 4. 检查服务状态
echo "[4/5] 检查服务状态..."
sleep 2
systemctl status index-api.service --no-pager

# 5. 测试API
echo "[5/5] 测试API..."
sleep 1
curl -s http://localhost:5099/api/count

echo ""
echo "=== 部署完成 ==="
echo "服务状态: systemctl status index-api.service"
echo "查看日志: journalctl -u index-api.service -f"
echo "访问日志: tail -f /opt/index-api/customer.log"
