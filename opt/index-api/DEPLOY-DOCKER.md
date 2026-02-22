# 部署步骤（Caddy Docker版）

## 环境
- VPS: Debian 12, 1核1G
- Python3 + Flask (通过apt安装)
- Caddy (Docker运行)
- 域名: vps.mlyr.top

---

## 部署步骤

### 1. 上传文件
```bash
scp -r opt/index-api root@your-vps-ip:/opt/
```

### 2. 安装依赖
```bash
ssh root@your-vps-ip
apt update
apt install -y python3-flask python3-flask-cors
```

### 3. 配置服务
```bash
cd /opt/index-api
cp index-api.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable index-api.service
systemctl start index-api.service
systemctl status index-api.service
```

### 4. 测试后端
```bash
curl http://localhost:5099/api/count
# 预期: {"count":0,"success":true}
```

### 5. 更新Caddyfile
```bash
# 备份
cp /path/to/your/Caddyfile /path/to/your/Caddyfile.bak

# 覆盖（Caddyfile已包含所有现有服务）
cp /opt/index-api/Caddyfile /path/to/your/Caddyfile

# 重启Caddy
docker restart caddy
docker logs caddy
```

### 6. 测试API
```bash
curl https://vps.mlyr.top:4099/api/count
curl -X POST https://vps.mlyr.top:4099/api/visit -H "Content-Type: application/json" -d '{"ip":"test"}'
tail -f /opt/index-api/customer.log
```

### 7. 浏览器测试
访问 https://mlyr.top，查看页面底部"访问总量"。

---

## 快速部署（推荐）
```bash
cd /opt/index-api
chmod +x deploy.sh
./deploy.sh
# 然后手动更新Caddyfile并重启Caddy
```

---

## 维护

```bash
# 服务
systemctl restart index-api.service
journalctl -u index-api.service -f

# Caddy
docker restart caddy
docker logs caddy -f

# 日志
tail -f /opt/index-api/customer.log
cat /opt/index-api/num.txt

# 设置访问量
echo "1000" > /opt/index-api/num.txt
systemctl restart index-api.service
```

---

## 架构

```
浏览器 (https://mlyr.top)
    ↓
vps.mlyr.top:4099 (HTTPS)
    ↓
宿主机 4099 → Caddy Docker 4099
    ↓
host.docker.internal:5099
    ↓
宿主机 Flask (5099)
    ↓
num.txt + customer.log
```

---

## 故障排查

### 后端无响应
```bash
systemctl status index-api.service
journalctl -u index-api.service -xe
netstat -tlnp | grep 5099
```

### Caddy无法访问
```bash
docker ps | grep caddy
docker logs caddy
docker exec caddy ping host.docker.internal
```

### CORS错误
```bash
curl -I https://vps.mlyr.top:4099/api/count
# 应看到: Access-Control-Allow-Origin: *
```

---

## 完成！
