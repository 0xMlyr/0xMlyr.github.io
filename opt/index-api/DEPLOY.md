# 完整部署步骤（使用现有Python3和Caddy）

## 准备工作
- ✅ VPS已安装Python3
- ✅ VPS已安装Caddy
- ✅ 本地代码已更新

---

## 步骤1：本地推送代码

```bash
cd c:\Users\Ramitd\Documents\GitHub\0xMlyr.github.io
git add .
git commit -m "Add visit counter feature"
git push origin main
```

---

## 步骤2：上传后端文件到VPS

使用SCP或SFTP工具上传：
```bash
scp -r "c:\Users\Ramitd\Documents\GitHub\0xMlyr.github.io\opt\index-api" root@your-vps-ip:/opt/
```

或使用WinSCP/FileZilla等工具，将本地 `opt/index-api` 目录上传到VPS的 `/opt/index-api`

---

## 步骤3：SSH连接VPS并部署

```bash
# 连接VPS
ssh root@your-vps-ip

# 进入目录
cd /opt/index-api

# 安装Python依赖
pip3 install Flask==3.0.0 flask-cors==4.0.0

# 配置systemd服务
cp index-api.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable index-api.service
systemctl start index-api.service

# 检查服务状态
systemctl status index-api.service

# 测试API
curl http://localhost:5099/api/count
```

预期输出：`{"count":0,"success":true}`

---

## 步骤4：配置Caddy

### 方法1：手动编辑Caddyfile

找到你的Caddyfile（通常在 `/etc/caddy/Caddyfile`），添加以下内容：

```
mlyr.top:4099 {
    reverse_proxy localhost:5099
    
    header {
        Access-Control-Allow-Origin "https://mlyr.top"
        Access-Control-Allow-Methods "GET, POST, OPTIONS"
        Access-Control-Allow-Headers "Content-Type"
    }
    
    @options {
        method OPTIONS
    }
    respond @options 204
}
```

### 方法2：使用提供的配置片段

```bash
cat /opt/index-api/caddy-snippet.txt >> /etc/caddy/Caddyfile
```

### 重载Caddy

```bash
# 检查配置语法
caddy validate --config /etc/caddy/Caddyfile

# 重载配置
caddy reload --config /etc/caddy/Caddyfile

# 或者使用systemctl
systemctl reload caddy
```

---

## 步骤5：验证部署

```bash
# 测试HTTPS API
curl https://mlyr.top:4099/api/count

# 测试POST请求
curl -X POST https://mlyr.top:4099/api/visit \
  -H "Content-Type: application/json" \
  -d '{"ip":"test"}'

# 查看日志
tail -f /opt/index-api/customer.log
```

---

## 步骤6：浏览器测试

1. 打开浏览器访问 `https://mlyr.top`
2. 按F12打开开发者工具
3. 切换到"网络"标签
4. 刷新页面
5. 检查是否有以下请求：
   - `https://mlyr.top:4099/api/count` (状态200)
   - `https://mlyr.top:4099/api/visit` (状态200)
6. 查看页面底部是否显示"访问总量：1"

---

## 常用维护命令

```bash
# 查看服务状态
systemctl status index-api.service

# 重启服务
systemctl restart index-api.service

# 查看实时日志
journalctl -u index-api.service -f

# 查看访问日志
tail -f /opt/index-api/customer.log

# 手动设置访问量
echo "1000" > /opt/index-api/num.txt
systemctl restart index-api.service

# 清空日志
> /opt/index-api/customer.log
```

---

## 故障排查

### 问题1：服务启动失败
```bash
journalctl -u index-api.service -xe
# 检查Python和依赖是否正确安装
python3 --version
pip3 list | grep -i flask
```

### 问题2：端口被占用
```bash
netstat -tlnp | grep 5099
# 如果被占用，kill掉占用进程或更换端口
```

### 问题3：Caddy无法访问
```bash
# 检查Caddy状态
systemctl status caddy

# 查看Caddy日志
journalctl -u caddy -f

# 测试配置
caddy validate --config /etc/caddy/Caddyfile
```

### 问题4：CORS错误
```bash
# 检查响应头
curl -I https://mlyr.top:4099/api/count

# 应该看到：
# Access-Control-Allow-Origin: https://mlyr.top
```

### 问题5：前端显示"加载中..."
- 检查浏览器控制台是否有错误
- 检查网络请求是否成功
- 确认API返回正确的JSON格式

---

## 文件清单

VPS端 `/opt/index-api/` 目录：
- ✅ app.py
- ✅ requirements.txt
- ✅ num.txt (内容：0)
- ✅ customer.log (空文件)
- ✅ index-api.service
- ✅ caddy-snippet.txt
- ✅ deploy.sh
- ✅ README.md
- ✅ QUICKSTART.md

---

## 完成！

部署完成后，每次有人访问你的网站，访问量都会自动增加并记录到日志中。
