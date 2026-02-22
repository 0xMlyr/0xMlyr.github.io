# Index API - 访问统计系统

## 文件说明

### 核心文件（必需）
- `app.py` - Flask后端服务
- `num.txt` - 访问计数存储（初始值：0）
- `customer.log` - 访问日志（空文件）
- `index-api.service` - systemd服务配置

### 配置文件
- `Caddyfile` - 完整Caddy配置（包含所有现有服务）
- `requirements.txt` - Python依赖（仅供参考，建议用apt安装）

### 辅助文件
- `deploy.sh` - 快速部署脚本
- `DEPLOY-DOCKER.md` - 详细部署文档
- `README.md` - 本文件

---

## 快速部署

### 1. 上传文件到VPS
```bash
scp -r opt/index-api root@your-vps-ip:/opt/
```

### 2. 部署后端
```bash
ssh root@your-vps-ip
cd /opt/index-api

# 使用apt安装依赖
apt update
apt install -y python3-flask python3-flask-cors

# 配置服务
cp index-api.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable index-api.service
systemctl start index-api.service

# 验证
systemctl status index-api.service
curl http://localhost:5099/api/count
```

### 3. 更新Caddy配置
```bash
# 备份现有配置
cp /path/to/your/Caddyfile /path/to/your/Caddyfile.bak

# 覆盖新配置
cp /opt/index-api/Caddyfile /path/to/your/Caddyfile

# 重启Caddy Docker
docker restart caddy
```

### 4. 验证
```bash
curl https://vps.mlyr.top:4099/api/count
tail -f /opt/index-api/customer.log
```

---

## API说明

- `GET /api/count` - 获取访问总量
- `POST /api/visit` - 记录访问（参数：`{ip: "xxx"}`)

---

## 维护命令

```bash
# 服务管理
systemctl status index-api.service
systemctl restart index-api.service
journalctl -u index-api.service -f

# 查看日志
tail -f /opt/index-api/customer.log

# 手动设置访问量
echo "1000" > /opt/index-api/num.txt
systemctl restart index-api.service
```

---

## 架构

```
浏览器 → vps.mlyr.top:4099 → Caddy Docker → host.docker.internal:5099 → Flask
```
