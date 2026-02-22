# Index API 部署指南

## VPS环境
- 已安装 Python3
- 已安装 Caddy
- Debian 12, 1核1G

## 快速部署

### 1. 上传文件到VPS
将本地 `opt/index-api/` 目录上传到 VPS 的 `/opt/index-api/`

### 2. 安装Python依赖
```bash
cd /opt/index-api
pip3 install Flask==3.0.0 flask-cors==4.0.0
```

### 3. 配置systemd服务
```bash
cp /opt/index-api/index-api.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable index-api.service
systemctl start index-api.service
systemctl status index-api.service
```

### 4. 配置Caddy
将以下内容添加到你现有的Caddyfile中：
```
mlyr.top:4099 {
    reverse_proxy localhost:5099
    header {
        Access-Control-Allow-Origin "https://mlyr.top"
        Access-Control-Allow-Methods "GET, POST, OPTIONS"
        Access-Control-Allow-Headers "Content-Type"
    }
    @options method OPTIONS
    respond @options 204
}
```

然后重载Caddy：
```bash
caddy reload --config /path/to/your/Caddyfile
```

### 5. 验证
```bash
# 测试Flask
curl http://localhost:5099/api/count

# 测试Caddy
curl https://mlyr.top:4099/api/count

# 查看日志
tail -f /opt/index-api/customer.log
```

## 维护命令
```bash
# 重启服务
systemctl restart index-api.service

# 查看日志
journalctl -u index-api.service -f
tail -f /opt/index-api/customer.log

# 手动设置访问量
echo "1000" > /opt/index-api/num.txt
```
