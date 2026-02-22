# Index API 访问统计系统部署指南

## 系统架构
- 前端：JavaScript (utils-defer.js) 通过 HTTPS 请求 4099 端口
- 反向代理：Caddy Docker 监听 4099 端口，匹配 SSL 证书，转发到本机 5099
- 后端：Python Flask 监听 5099 端口
- 数据存储：num.txt (访问计数) + customer.log (访问日志)

## 部署步骤

### 1. 上传文件到VPS
```bash
# 将 opt/index-api 目录上传到 VPS 的 /opt/index-api/
scp -r opt/index-api root@your-vps-ip:/opt/
```

### 2. 安装Python依赖
```bash
ssh root@your-vps-ip
cd /opt/index-api
pip3 install -r requirements.txt
```

### 3. 配置Caddy (如果尚未配置)
```bash
# 如果使用 Caddy Docker，创建 docker-compose.yml
cat > /opt/caddy/docker-compose.yml <<EOF
version: '3.7'
services:
  caddy:
    image: caddy:latest
    container_name: caddy
    restart: unless-stopped
    ports:
      - "4099:4099"
    volumes:
      - /opt/index-api/Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
      - /var/log/caddy:/var/log/caddy
    network_mode: host

volumes:
  caddy_data:
  caddy_config:
EOF

# 启动 Caddy
cd /opt/caddy
docker-compose up -d
```

### 4. 配置systemd服务
```bash
# 复制服务文件
cp /opt/index-api/index-api.service /etc/systemd/system/

# 重载systemd
systemctl daemon-reload

# 启用并启动服务
systemctl enable index-api.service
systemctl start index-api.service

# 检查服务状态
systemctl status index-api.service
```

### 5. 验证部署
```bash
# 测试本地API
curl http://localhost:5099/api/count

# 测试通过Caddy的HTTPS访问
curl https://mlyr.top:4099/api/count

# 查看日志
tail -f /opt/index-api/customer.log
journalctl -u index-api.service -f
```

### 6. 部署前端代码
```bash
# 将更新后的 JS/utils-defer.js 上传到网站目录
# 确保 index.html 第371行的 xxxxx 保持不变（会被JS动态替换）
```

## 快速部署（推荐）
```bash
# 使用部署脚本一键部署
chmod +x /opt/index-api/deploy.sh
/opt/index-api/deploy.sh
```

## 文件说明
- `app.py` - Flask后端主程序
- `requirements.txt` - Python依赖
- `num.txt` - 访问计数存储（第一行为数字）
- `customer.log` - 访问日志（时间+IP）
- `index-api.service` - systemd服务配置
- `Caddyfile` - Caddy反向代理配置
- `deploy.sh` - 一键部署脚本

## 日志格式
```
[2025-02-22 10:47:32] IP: 192.168.1.1
[2025-02-22 10:47:35] IP: 203.0.113.45
[2025-02-22 10:47:40] ERROR: Connection timeout
```

## 常用命令
```bash
# 查看服务状态
systemctl status index-api.service

# 重启服务
systemctl restart index-api.service

# 查看实时日志
journalctl -u index-api.service -f

# 查看访问日志
tail -f /opt/index-api/customer.log

# 手动修改访问计数
echo "1000" > /opt/index-api/num.txt
systemctl restart index-api.service

# 清空访问日志
> /opt/index-api/customer.log
```

## 防火墙配置
```bash
# 确保5099端口只允许本地访问（安全）
iptables -A INPUT -p tcp --dport 5099 -s 127.0.0.1 -j ACCEPT
iptables -A INPUT -p tcp --dport 5099 -j DROP

# 允许4099端口外部访问（Caddy）
iptables -A INPUT -p tcp --dport 4099 -j ACCEPT
```

## 故障排查
1. 服务无法启动：检查 `journalctl -u index-api.service -xe`
2. API无响应：检查 `netstat -tlnp | grep 5099`
3. HTTPS访问失败：检查 Caddy 日志 `docker logs caddy`
4. 前端无法获取数据：检查浏览器控制台和网络请求

## 性能优化
- 1核1G VPS 足够支撑中小流量
- 如需高并发，考虑使用 gunicorn：
```bash
pip3 install gunicorn
gunicorn -w 2 -b 0.0.0.0:5099 app:app
```

## 备份建议
```bash
# 定期备份访问数据
0 2 * * * cp /opt/index-api/num.txt /opt/backup/num_$(date +\%Y\%m\%d).txt
0 2 * * * cp /opt/index-api/customer.log /opt/backup/customer_$(date +\%Y\%m\%d).log
```
