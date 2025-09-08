# SiteFrame Podman 部署指南

本指南介绍如何使用 Podman 部署 SiteFrame 项目。

## 前置要求

- Podman 已安装
- podman-compose 已安装 (`pip install podman-compose`)
- Node.js 18+ (用于本地开发)

## 快速开始

### 1. 环境配置

复制环境变量模板：
```bash
cp .env.podman .env
```

编辑 `.env` 文件，更新必要的配置：
- `NEXTAUTH_SECRET`: 生成一个安全的密钥
- `CSRF_SECRET`: 生成一个安全的密钥
- `ENCRYPTION_KEY`: 生成一个32字符的加密密钥

### 2. 构建和启动

使用提供的脚本：
```bash
# 构建应用镜像
./podman-scripts.sh build

# 启动所有服务
./podman-scripts.sh up
```

或者手动执行：
```bash
# 构建镜像
podman build -t siteframe-app .

# 启动服务
podman-compose up -d
```

### 3. 访问应用

应用将在以下地址可用：
- **Web 应用**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 管理脚本使用

项目提供了 `podman-scripts.sh` 脚本来简化管理：

```bash
# 查看帮助
./podman-scripts.sh help

# 构建镜像
./podman-scripts.sh build

# 启动服务
./podman-scripts.sh up

# 停止服务
./podman-scripts.sh down

# 重启服务
./podman-scripts.sh restart

# 查看日志
./podman-scripts.sh logs

# 查看应用日志
./podman-scripts.sh logs-app

# 查看数据库日志
./podman-scripts.sh logs-db

# 查看容器状态
./podman-scripts.sh status

# 进入应用容器
./podman-scripts.sh shell

# 进入数据库
./podman-scripts.sh db-shell

# 清理所有容器和卷
./podman-scripts.sh clean
```

## 服务架构

部署包含以下服务：

1. **siteframe-app**: Next.js 应用 (端口 3000)
2. **postgres**: PostgreSQL 数据库 (端口 5432)
3. **redis**: Redis 缓存 (端口 6379)

## 数据持久化

以下数据会持久化存储：
- PostgreSQL 数据: `postgres_data` 卷
- Redis 数据: `redis_data` 卷

## 网络配置

所有服务运行在 `siteframe-network` 网络中，服务间可以通过服务名互相访问。

## 与宿主机 Caddy 集成

如果你在宿主机上运行 Caddy，可以配置反向代理：

```caddyfile
# Caddyfile
your-domain.com {
    reverse_proxy localhost:3000
}
```

## 故障排除

### 查看日志
```bash
# 查看所有服务日志
./podman-scripts.sh logs

# 查看特定服务日志
podman logs siteframe-app
podman logs siteframe-postgres
podman logs siteframe-redis
```

### 重置数据库
```bash
# 停止服务
./podman-scripts.sh down

# 删除数据库卷
podman volume rm siteframe_postgres_data

# 重新启动
./podman-scripts.sh up
```

### 重建镜像
```bash
# 停止服务
./podman-scripts.sh down

# 重建镜像
./podman-scripts.sh build

# 启动服务
./podman-scripts.sh up
```

## 生产环境注意事项

1. **安全配置**:
   - 更改默认密码
   - 使用强密钥
   - 配置防火墙

2. **性能优化**:
   - 根据需要调整容器资源限制
   - 配置适当的日志轮转

3. **备份**:
   - 定期备份 PostgreSQL 数据
   - 备份环境配置文件

4. **监控**:
   - 监控容器健康状态
   - 监控资源使用情况

## 开发模式

对于开发，你可能想要：

1. 只运行数据库和 Redis：
```bash
podman-compose up -d postgres redis
```

2. 在宿主机运行 Next.js 开发服务器：
```bash
npm run dev
```

这样可以获得热重载和更好的开发体验。