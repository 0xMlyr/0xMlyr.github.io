# 快速部署命令清单

## 一、VPS端部署（SSH连接到VPS后执行）

### 1. 安装依赖
```bash
pip3 install Flask==3.0.0 flask-cors==4.0.0
```

### 2. 配置systemd服务
```bash
cp /opt/index-api/index-api.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable index-api.service
systemctl start index-api.service
```

### 3. 验证服务
```bash
systemctl status index-api.service
curl http://localhost:5099/api/count
```

### 4. 配置Caddy（如果还没配置）
```bash
# 将 Caddyfile 放到 Caddy 配置目录
# 重启 Caddy Docker
docker restart caddy
```

### 5. 测试完整链路
```bash
curl https://mlyr.top:4099/api/count
```

## 二、本地端操作

### 1. 提交代码到GitHub
```bash
cd c:\Users\Ramitd\Documents\GitHub\0xMlyr.github.io
git add .
git commit -m "Add visit counter feature"
git push
```

### 2. 上传后端文件到VPS
```bash
scp -r opt/index-api root@your-vps-ip:/opt/
```

## 三、验证功能

1. 打开浏览器访问 https://mlyr.top
2. 打开浏览器控制台（F12）查看网络请求
3. 查看页面底部"xxxxx"是否显示为"访问总量: X"
4. 在VPS上查看日志：`tail -f /opt/index-api/customer.log`

## 四、常用维护命令

```bash
# 查看服务状态
systemctl status index-api.service

# 重启服务
systemctl restart index-api.service

# 查看访问日志
tail -f /opt/index-api/customer.log

# 查看系统日志
journalctl -u index-api.service -f

# 手动设置访问量
echo "1000" > /opt/index-api/num.txt

# 清空日志
> /opt/index-api/customer.log
```

## 五、文件清单

### VPS端 (/opt/index-api/)
- app.py - 后端主程序
- requirements.txt - Python依赖
- num.txt - 访问计数（初始值：0）
- customer.log - 访问日志（空文件）
- index-api.service - systemd服务配置
- Caddyfile - Caddy反向代理配置
- deploy.sh - 一键部署脚本
- README.md - 详细部署文档

### 本地端
- JS/utils-defer.js - 已更新，包含访问统计功能
- index.html - 第371行保持"xxxxx"（会被JS替换）

## 六、端口说明
- 5099：Flask后端监听端口（仅本地访问）
- 4099：Caddy监听端口（HTTPS，外部访问）
- 前端通过 https://mlyr.top:4099 访问API

## 七、故障排查
1. 前端显示"访问总量: undefined" → 检查API是否正常
2. API无响应 → 检查服务状态和端口
3. HTTPS证书错误 → 检查Caddy配置和证书
4. 日志无记录 → 检查文件权限
