# 开发环境配置指南

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 环境配置
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，配置数据库连接
# DATABASE_URL="postgresql://username:password@localhost:5432/siteframe"
```

### 3. 数据库初始化
```bash
# 初始化 Supabase 数据库
npm run db:init

# 启动开发服务器
npm run dev
```

## 开发工具

### 数据库管理
```bash
# 生成 TypeScript 类型定义
npm run supabase:types

# 重新初始化数据库数据
npm run db:seed
```

### 代码质量
```bash
# 代码检查
npm run lint

# 代码格式化
npm run format

# 类型检查
npm run type-check
```

## 项目结构

```
siteframe/
├── database/
│   └── schema.sql       # 数据库架构
├── scripts/
│   └── init-supabase.ts # 数据库初始化脚本
├── src/
│   ├── app/            # Next.js App Router
│   ├── components/     # React 组件
│   ├── lib/           # 工具库
│   └── types/         # TypeScript 类型定义
├── public/            # 静态资源
└── 配置文件...
```

## 常见问题

### TypeScript 错误
如果遇到 Supabase 连接错误：
1. 确保 `.env` 文件中的 Supabase 配置正确
2. 检查 Supabase 项目是否已创建并运行
3. 重启 TypeScript 服务器

### 数据库连接问题
1. 检查 `.env` 文件中的 `DATABASE_URL` 配置
2. 确保数据库服务正在运行
3. 验证数据库用户权限

### 端口冲突
如果 3000 端口被占用：
```bash
npm run dev -- -p 3001
```

## 部署准备

### 生产构建
```bash
npm run build
npm start
```

### 数据库迁移
```bash
# 创建迁移文件
npm run db:migrate:dev

# 部署迁移
npm run db:migrate:deploy
```

## 开发规范

### Git 提交规范
- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

### 代码风格
- 使用 Prettier 进行代码格式化
- 遵循 ESLint 规则
- 组件使用 PascalCase 命名
- 文件使用 kebab-case 命名

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **数据库**: Supabase (PostgreSQL)
- **样式**: Tailwind CSS
- **代码质量**: ESLint + Prettier
- **部署**: Vercel (推荐)

## 获取帮助

- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)