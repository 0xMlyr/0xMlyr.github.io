# 文件清单

## /opt/index-api/ 目录结构

```
/opt/index-api/
├── app.py                    # Flask后端服务（必需）
├── num.txt                   # 访问计数存储（必需，初始值：0）
├── customer.log              # 访问日志（必需，空文件）
├── index-api.service         # systemd服务配置（必需）
├── Caddyfile                 # 完整Caddy配置（必需）
├── requirements.txt          # Python依赖列表（参考）
├── deploy.sh                 # 快速部署脚本（可选）
├── README.md                 # 项目说明（参考）
├── DEPLOY-DOCKER.md          # 部署文档（参考）
└── FILE-LIST.md              # 本文件（参考）
```

---

## 文件说明

### 核心运行文件（5个）

1. **app.py** (1.8KB)
   - Flask后端主程序
   - 提供 /api/visit 和 /api/count 接口
   - 监听 0.0.0.0:5099

2. **num.txt** (2B)
   - 存储访问计数
   - 初始内容：`0`
   - 每次访问自动+1

3. **customer.log** (0B)
   - 访问日志文件
   - 记录格式：`[时间] IP: xxx.xxx.xxx.xxx`
   - 初始为空文件

4. **index-api.service** (0.3KB)
   - systemd服务配置
   - 需复制到 /etc/systemd/system/
   - 实现开机自启和自动重启

5. **Caddyfile** (0.8KB)
   - 完整Caddy配置
   - 包含所有现有服务（4140/4766/4055/4244/4876）
   - 新增4099端口用于访问统计API

---

### 辅助文件（4个）

6. **requirements.txt** (0.03KB)
   - Python依赖列表
   - 仅供参考，建议使用apt安装

7. **deploy.sh** (0.5KB)
   - 自动化部署脚本
   - 包含依赖安装、服务配置、验证

8. **README.md** (1.2KB)
   - 项目说明和快速开始

9. **DEPLOY-DOCKER.md** (1.5KB)
   - 详细部署步骤
   - 故障排查指南

---

## 部署时需要的文件

### 必须上传到VPS的文件：
- ✅ app.py
- ✅ num.txt
- ✅ customer.log
- ✅ index-api.service
- ✅ Caddyfile

### 可选文件：
- deploy.sh（如果想用自动部署）
- README.md（参考文档）
- DEPLOY-DOCKER.md（参考文档）

### 不需要上传的文件：
- requirements.txt（直接用apt安装）
- FILE-LIST.md（本文件，仅供本地参考）

---

## 文件完整性检查

```bash
cd /opt/index-api
ls -lh

# 应该看到：
# app.py (约1.8KB)
# num.txt (2字节，内容：0)
# customer.log (0字节，空文件)
# index-api.service (约0.3KB)
# Caddyfile (约0.8KB)
```

---

## 备份建议

```bash
# 备份整个目录
tar -czf index-api-backup-$(date +%Y%m%d).tar.gz /opt/index-api/

# 仅备份数据文件
cp /opt/index-api/num.txt /opt/backup/
cp /opt/index-api/customer.log /opt/backup/
```

---

## 总结

- **总文件数**: 9个
- **核心文件**: 5个（必需）
- **辅助文件**: 4个（可选）
- **总大小**: 约6KB（不含日志）
