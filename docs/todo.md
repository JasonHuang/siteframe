# Monopoly 项目迁移计划

> 从 SiteFrame (Supabase) 迁移到 Monopoly (本地 PostgreSQL + Bun/Elysia)

## 项目架构

```
monopoly/
├── frontend/          # 前端网站 (React + Vite + shadcn/ui)
├── admin/             # 后端管理系统 (React + Vite + Ant Design)
├── api/               # API 服务 (Bun + Elysia + PostgreSQL)
├── shared/            # 共享代码 (类型定义、工具函数)
├── database/          # 数据库脚本
└── docker-compose.yml # Docker 部署配置
```

## 技术栈

| 子项目 | 框架 | UI 库 | 其他 |
|--------|------|-------|------|
| Frontend | React 19 + Vite | shadcn/ui + Radix + Lucide | TailwindCSS, React Router, TanStack Query |
| Admin | React 19 + Vite | Ant Design 5.x | React Router, TanStack Query |
| API | Bun + Elysia | - | Drizzle ORM, JWT, Swagger |
| Database | PostgreSQL 15+ | - | localhost:15432 |

## 数据库配置

- Host: localhost
- Port: 15432
- Database: monopoly
- User: smiley
- Password: smiley

---

## 第一阶段：基础设施 ✅

- [x] 1.1 创建项目根目录 monopoly/
- [x] 1.2 创建 PostgreSQL 数据库和用户
- [x] 1.3 初始化 monorepo (pnpm workspace)
- [x] 1.4 创建共享类型定义 shared/
- [x] 1.5 创建数据库 Schema 脚本

## 第二阶段：API 服务 (Bun + Elysia) ✅

- [x] 2.1 初始化 Bun 项目
- [x] 2.2 配置 Elysia 框架
- [x] 2.3 配置 Drizzle ORM 连接 PostgreSQL
- [x] 2.4 实现数据库表结构
- [x] 2.5 实现认证模块 (JWT)
- [x] 2.6 实现内容管理 API
- [x] 2.7 实现分类/标签 API
- [x] 2.8 实现媒体上传 API
- [x] 2.9 实现主题管理 API
- [x] 2.10 实现设置 API
- [x] 2.11 API 文档 (Swagger)

## 第三阶段：前端网站 (React + shadcn/ui) ✅

- [x] 3.1 初始化 Vite + React + TypeScript
- [x] 3.2 配置 TailwindCSS + shadcn/ui
- [x] 3.3 实现布局组件
- [x] 3.4 实现首页 (文章列表)
- [x] 3.5 实现文章详情页
- [x] 3.6 实现登录页面
- [x] 3.7 状态管理 (Zustand)

## 第四阶段：管理后台 (React + Ant Design) ✅

- [x] 4.1 初始化 Vite + React + TypeScript
- [x] 4.2 配置 Ant Design 5.x
- [x] 4.3 实现登录页面
- [x] 4.4 实现后台布局
- [x] 4.5 实现仪表盘
- [x] 4.6 实现内容管理
- [x] 4.7 实现分类管理
- [x] 4.8 实现标签管理
- [x] 4.9 实现主题管理
- [x] 4.10 实现系统设置

## 第五阶段：主题系统 ✅

- [x] 5.1 添加默认主题到数据库
- [x] 5.2 实现主题引擎核心
- [x] 5.3 实现主题选择器组件
- [x] 5.4 实现主题动态切换
- [x] 5.5 实现暗黑模式

## 第六阶段：Docker 部署 ✅

- [x] 6.1 创建 API Dockerfile
- [x] 6.2 创建前端/管理后台 Dockerfile
- [x] 6.3 创建 docker-compose.yml
- [x] 6.4 创建环境变量模板
- [x] 6.5 创建项目 README

---

## 进度追踪

| 阶段 | 状态 | 完成时间 |
|------|------|----------|
| 第一阶段：基础设施 | ✅ 完成 | 2025-01-07 |
| 第二阶段：API 服务 | ✅ 完成 | 2025-01-07 |
| 第三阶段：前端网站 | ✅ 完成 | 2025-01-07 |
| 第四阶段：管理后台 | ✅ 完成 | 2025-01-07 |
| 第五阶段：主题系统 | ✅ 完成 | 2025-01-07 |
| 第六阶段：Docker 部署 | ✅ 完成 | 2025-01-07 |

---

## 启动命令

### 本地开发

```bash
# 启动所有服务
cd /Users/yalehuang/Documents/dev/monopoly
pnpm dev

# 或分别启动
bun run api/src/index.ts     # API: http://localhost:3002
pnpm --filter frontend dev   # 前端: http://localhost:5173
pnpm --filter admin dev      # 管理后台: http://localhost:5174
```

### Docker 部署

```bash
cd /Users/yalehuang/Documents/dev/monopoly
cp .env.example .env
docker-compose up -d
```

## 测试账户

- 邮箱: `test@example.com`
- 密码: `test123456`
- 角色: `ADMIN`

---

## 备注

- 原项目路径: `/Users/yalehuang/Documents/dev/siteframe`
- 新项目路径: `/Users/yalehuang/Documents/dev/monopoly`
- 数据库: PostgreSQL localhost:15432
- API Swagger: http://localhost:3002/swagger
