# 最终部署步骤（Caddy Docker版）

## 步骤1：本地推送代码
```bash
cd c:\Users\Ramitd\Documents\GitHub\0xMlyr.github.io
git add .
git commit -m "Add visit counter"
git push
```

## 步骤2：上传文件到VPS
```bash
scp -r "c:\Users\Ramitd\Documents\GitHub\0xMlyr.github.io\opt\index-api" root@your-vps-ip:/opt/
```

## 步骤3：SSH连接VPS并部署后端
```bash
ssh root@your-vps-ip

# 安装依赖
apt update
apt install -y python3-flask python3-flask-cors

# 配置服务
cd /opt/index-api
cp index-api.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable index-api.service
systemctl start index-api.service

# 验证
systemctl status index-api.service
curl http://localhost:5099/api/count
```

## 步骤4：更新Caddy配置
```bash
# 找到你的Caddy配置文件位置（通常是挂载到Docker的）
# 例如：/opt/caddy/Caddyfile 或 /etc/caddy/Caddyfile

# 备份
cp /path/to/your/Caddyfile /path/to/your/Caddyfile.bak

# 覆盖新配置
cp /opt/index-api/Caddyfile /path/to/your/Caddyfile

# 重启Caddy Docker
docker restart caddy
```

## 步骤5：验证
```bash
# 测试API
curl https://vps.mlyr.top:4099/api/count

# 查看日志
tail -f /opt/index-api/customer.log
```

## 步骤6：浏览器测试
打开 https://mlyr.top，查看页面底部访问总量。

## 关键配置说明

### Caddyfile配置
- 域名：`vps.mlyr.top:4099`
- 反向代理：`host.docker.internal:5099`（Docker访问宿主机）
- 已启用CORS

### 前端JS
- API地址：`https://vps.mlyr.top:4099`

### 端口映射
- 宿主机5099 ← Flask监听
- 宿主机4099 → Caddy Docker 4099
- Caddy Docker 4099 → 宿主机5099（通过host.docker.internal）

## 完成！
