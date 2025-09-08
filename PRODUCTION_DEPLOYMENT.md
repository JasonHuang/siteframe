# SiteFrame 生产环境部署指南

## 📋 目录

- [前置要求](#前置要求)
- [快速部署](#快速部署)
- [详细配置](#详细配置)
- [安全配置](#安全配置)
- [性能优化](#性能优化)
- [监控和日志](#监控和日志)
- [备份策略](#备份策略)
- [故障排除](#故障排除)
- [维护指南](#维护指南)

## 🚀 前置要求

### 系统要求

- **操作系统**: AlmaLinux 8 64 Bit / CentOS 8+ / RHEL 8+
- **内存**: 最少 4GB，推荐 8GB+
- **存储**: 最少 50GB 可用空间
- **网络**: 公网 IP 地址
- **域名**: 已配置 DNS 解析

### 软件依赖

```bash
# 更新系统包
sudo dnf update -y

# 安装基础工具
sudo dnf install -y curl wget git unzip tar gzip

# 安装 EPEL 仓库
sudo dnf install -y epel-release

# 安装 Podman
sudo dnf install -y podman podman-compose

# 安装 Node.js 18+
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

# 安装 PostgreSQL 客户端（用于备份）
sudo dnf install -y postgresql

# 安装 Nginx（可选，如果不使用容器化 Nginx）
sudo dnf install -y nginx

# 启用并启动必要服务
sudo systemctl enable podman
sudo systemctl start podman

# 验证安装
podman --version
podman-compose --version
```

### 外部服务

- **Supabase**: 数据库服务
- **域名**: 已配置的域名和 DNS
- **SSL 证书**: Let's Encrypt 或其他 CA 证书

## ⚡ 快速部署

### 1. 克隆项目

```bash
git clone <your-repository-url>
cd siteframe
```

### 2. 配置环境变量

```bash
# 复制生产环境配置模板
cp .env.production .env.production.local

# 编辑配置文件
vim .env.production.local
```

**必须配置的环境变量**:

```bash
# Supabase 配置
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE_ROLE_KEY]"

# 应用配置
NEXTAUTH_URL="https://yourdomain.com"
APP_URL="https://yourdomain.com"

# 安全密钥（使用 openssl rand -base64 32 生成）
NEXTAUTH_SECRET="[32字符随机密钥]"
CSRF_SECRET="[32字符随机密钥]"
ENCRYPTION_KEY="[32字符随机密钥]"
JWT_SECRET="[32字符随机密钥]"
```

### 3. 一键部署

```bash
# 给部署脚本执行权限
chmod +x deploy-production.sh

# 执行完整部署
./deploy-production.sh setup
```

### 4. 验证部署

```bash
# 检查服务状态
./deploy-production.sh status

# 健康检查
./deploy-production.sh health

# 查看日志
./deploy-production.sh logs
```

## 🔧 详细配置

### 环境变量详解

#### 数据库配置

```bash
# Supabase 数据库连接
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"

# Supabase API 配置
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[从 Supabase 项目设置获取]"
SUPABASE_SERVICE_ROLE_KEY="[从 Supabase 项目设置获取]"
```

#### 应用配置

```bash
# 应用基本信息
APP_NAME="SiteFrame"
APP_URL="https://yourdomain.com"
APP_ENV="production"

# Next.js 配置
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"
NEXT_PUBLIC_DEBUG="false"
```

#### 邮件配置

```bash
# SMTP 配置（推荐使用 SendGrid）
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="[SendGrid API Key]"
SMTP_FROM="noreply@yourdomain.com"
```

### SSL 证书配置

#### 使用 Let's Encrypt

```bash
# 安装 Certbot
sudo apt install certbot

# 获取证书
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# 复制证书到项目目录
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem

# 设置权限
sudo chown $USER:$USER nginx/ssl/*.pem
chmod 600 nginx/ssl/*.pem
```

#### 自动续期

```bash
# 添加到 crontab
0 12 * * * /usr/bin/certbot renew --quiet && ./deploy-production.sh restart
```

## 🔒 安全配置

### 防火墙设置

```bash
# 配置 firewalld 防火墙
sudo systemctl enable firewalld
sudo systemctl start firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --remove-port=3000/tcp  # 禁止直接访问应用端口
sudo firewall-cmd --permanent --remove-port=6379/tcp  # 禁止直接访问 Redis
sudo firewall-cmd --reload
```

### 系统安全

```bash
# 禁用 root SSH 登录
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# 配置 fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 容器安全

- 使用非 root 用户运行容器
- 启用只读文件系统
- 限制容器资源使用
- 禁用不必要的权限

## ⚡ 性能优化

### 系统优化

```bash
# 优化内核参数
echo 'net.core.somaxconn = 65535' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_max_syn_backlog = 65535' >> /etc/sysctl.conf
echo 'vm.swappiness = 10' >> /etc/sysctl.conf
sudo sysctl -p
```

### 应用优化

- **启用 Gzip 压缩**: Nginx 配置中已启用
- **静态资源缓存**: 设置长期缓存头
- **CDN 集成**: 配置 CDN 加速静态资源
- **数据库优化**: 使用连接池和查询优化

### 监控指标

- **响应时间**: < 200ms
- **内存使用**: < 80%
- **CPU 使用**: < 70%
- **磁盘使用**: < 80%

## 📊 监控和日志

### 健康检查

```bash
# 应用健康检查
curl -f http://localhost:3000/api/health

# 自动监控脚本
./deploy-production.sh monitor
```

### 日志管理

```bash
# 查看应用日志
podman-compose -f podman-compose.production.yml logs siteframe-app

# 查看 Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# 查看系统日志
journalctl -u podman
```

### 日志轮转

```bash
# 配置 logrotate
sudo tee /etc/logrotate.d/siteframe << EOF
/var/log/siteframe/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
}
EOF
```

## 💾 备份策略

### 自动备份

```bash
# 每日备份脚本
./deploy-production.sh backup

# 添加到 crontab
0 2 * * * /path/to/siteframe/deploy-production.sh backup
```

### 备份内容

- **应用数据**: 上传文件、配置文件
- **数据库**: Supabase 自动备份
- **Redis 数据**: 持久化数据
- **SSL 证书**: 证书文件

### 恢复流程

```bash
# 从备份恢复
./deploy-production.sh restore /path/to/backup.tar.gz
```

## 🔧 故障排除

### 常见问题

#### 1. 容器启动失败

```bash
# 检查日志
podman-compose -f podman-compose.production.yml logs

# 检查配置
podman-compose -f podman-compose.production.yml config
```

#### 2. 数据库连接失败

```bash
# 检查环境变量
echo $DATABASE_URL

# 测试连接
psql $DATABASE_URL -c "SELECT 1;"
```

#### 3. SSL 证书问题

```bash
# 检查证书有效性
openssl x509 -in nginx/ssl/cert.pem -text -noout

# 测试 HTTPS
curl -I https://yourdomain.com
```

#### 4. 性能问题

```bash
# 检查资源使用
podman stats

# 检查系统负载
top
htop
iotop
```

### 紧急恢复

```bash
# 快速回滚
git checkout HEAD~1
./deploy-production.sh update

# 从备份恢复
./deploy-production.sh restore /path/to/last-good-backup.tar.gz
```

## 🔄 维护指南

### 定期维护任务

#### 每日
- 检查服务状态
- 查看错误日志
- 验证备份完成

#### 每周
- 更新系统包
- 检查磁盘空间
- 分析性能指标

#### 每月
- 更新应用依赖
- 安全扫描
- 备份测试恢复

### 更新流程

```bash
# 1. 备份当前版本
./deploy-production.sh backup

# 2. 拉取最新代码
git pull origin main

# 3. 更新应用
./deploy-production.sh update

# 4. 验证部署
./deploy-production.sh health
```

### 扩容指南

#### 垂直扩容
```bash
# 增加容器资源限制
# 编辑 podman-compose.production.yml
# 重启服务
./deploy-production.sh restart
```

#### 水平扩容
```bash
# 使用负载均衡器
# 部署多个应用实例
# 配置数据库读写分离
```

## 📞 支持和联系

- **文档**: [项目文档](./docs/)
- **问题反馈**: [GitHub Issues](https://github.com/your-repo/issues)
- **安全问题**: security@yourdomain.com

---

**注意**: 这是生产环境部署指南，请确保在部署前充分测试所有配置。建议先在测试环境中验证整个部署流程。