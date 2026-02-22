# 最终部署步骤

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

## 步骤3：SSH连接VPS并部署
```bash
ssh root@your-vps-ip

# 安装依赖（使用apt，不会冲突）
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

## 步骤4：更新Caddyfile
```bash
# 备份现有配置
cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak

# 覆盖新配置
cp /opt/index-api/Caddyfile /etc/caddy/Caddyfile

# 验证配置
caddy validate --config /etc/caddy/Caddyfile

# 重载Caddy
caddy reload --config /etc/caddy/Caddyfile
```

## 步骤5：测试
```bash
# 测试API
curl https://mlyr.top:4099/api/count

# 查看日志
tail -f /opt/index-api/customer.log
```

## 完成！
打开浏览器访问 https://mlyr.top，查看页面底部访问总量。
