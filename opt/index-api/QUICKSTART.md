# 快速部署命令

## 一、VPS端部署

```bash
# 1. 进入目录
cd /opt/index-api

# 2. 安装依赖
pip3 install Flask==3.0.0 flask-cors==4.0.0

# 3. 配置服务
cp index-api.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable index-api.service
systemctl start index-api.service

# 4. 验证
systemctl status index-api.service
curl http://localhost:5099/api/count
```

## 二、Caddy配置

在你现有的Caddyfile中添加：

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

然后重载：
```bash
caddy reload --config /etc/caddy/Caddyfile
# 或者
systemctl reload caddy
```

## 三、验证

```bash
# 测试HTTPS
curl https://mlyr.top:4099/api/count

# 查看日志
tail -f /opt/index-api/customer.log
```

## 四、维护

```bash
# 重启
systemctl restart index-api.service

# 日志
journalctl -u index-api.service -f

# 修改计数
echo "1000" > /opt/index-api/num.txt
```
