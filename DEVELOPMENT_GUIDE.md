# 开发环境配置指南

本指南将帮助您快速搭建和配置项目的开发环境，确保团队成员拥有一致的开发体验。

## 目录

- [系统要求](#系统要求)
- [环境搭建](#环境搭建)
- [项目初始化](#项目初始化)
- [开发工具配置](#开发工具配置)
- [数据库配置](#数据库配置)
- [环境变量配置](#环境变量配置)
- [开发流程](#开发流程)
- [常用命令](#常用命令)
- [故障排除](#故障排除)
- [性能优化](#性能优化)

## 系统要求

### 必需软件

| 软件 | 版本要求 | 说明 |
|------|----------|------|
| **Node.js** | >= 18.17.0 | JavaScript 运行时 |
| **npm** | >= 9.0.0 | 包管理器（推荐使用 pnpm） |
| **Git** | >= 2.30.0 | 版本控制 |
| **VS Code** | 最新版本 | 推荐的代码编辑器 |

### 推荐软件

| 软件 | 说明 |
|------|------|
| **pnpm** | 更快的包管理器 |
| **Docker** | 容器化开发环境 |
| **PostgreSQL** | 数据库（如果使用本地数据库） |
| **Redis** | 缓存服务 |

### 操作系统支持

- ✅ macOS 10.15+
- ✅ Windows 10/11
- ✅ Ubuntu 20.04+
- ✅ 其他 Linux 发行版

## 环境搭建

### 1. 安装 Node.js

#### 方式一：官方安装包

1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载 LTS 版本
3. 按照安装向导完成安装

#### 方式二：使用 nvm（推荐）

```bash
# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重启终端或执行
source ~/.bashrc

# 安装最新 LTS 版本
nvm install --lts
nvm use --lts

# 设置默认版本
nvm alias default node
```

#### 方式三：使用 Homebrew（macOS）

```bash
# 安装 Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Node.js
brew install node
```

### 2. 安装包管理器

#### 安装 pnpm（推荐）

```bash
# 使用 npm 安装
npm install -g pnpm

# 或使用 Homebrew（macOS）
brew install pnpm

# 验证安装
pnpm --version
```

#### 配置 npm 镜像（可选）

```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com/

# 或使用 pnpm
pnpm config set registry https://registry.npmmirror.com/
```

### 3. 安装 Git

#### macOS
```bash
# 使用 Homebrew
brew install git

# 或使用 Xcode Command Line Tools
xcode-select --install
```

#### Windows
1. 下载 [Git for Windows](https://git-scm.com/download/win)
2. 按照安装向导完成安装

#### Linux
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install git

# CentOS/RHEL
sudo yum install git
```

### 4. 配置 Git

```bash
# 设置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 设置默认分支名
git config --global init.defaultBranch main

# 设置编辑器
git config --global core.editor "code --wait"

# 启用颜色输出
git config --global color.ui auto

# 设置换行符处理（Windows）
git config --global core.autocrlf true

# 设置换行符处理（macOS/Linux）
git config --global core.autocrlf input
```

## 项目初始化

### 1. 克隆项目

```bash
# 克隆仓库
git clone https://github.com/your-org/siteframe.git
cd siteframe

# 或使用 SSH
git clone git@github.com:your-org/siteframe.git
cd siteframe
```

### 2. 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 3. 环境变量配置

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑环境变量
code .env.local
```

### 4. 启动开发服务器

```bash
# 启动开发服务器
pnpm dev

# 或
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 开发工具配置

### VS Code 配置

#### 必需扩展

创建 `.vscode/extensions.json`：

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "ms-vscode.vscode-css-peek",
    "zignd.html-css-class-completion"
  ]
}
```

#### 工作区设置

创建 `.vscode/settings.json`：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/dist": true,
    "**/build": true
  },
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/.next": true
  }
}
```

#### 调试配置

创建 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### 其他编辑器

#### WebStorm

1. 安装 Prettier 插件
2. 配置 ESLint：`Settings > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint`
3. 配置 Prettier：`Settings > Languages & Frameworks > JavaScript > Prettier`

#### Vim/Neovim

```vim
" 安装相关插件
Plug 'neoclide/coc.nvim', {'branch': 'release'}
Plug 'prettier/vim-prettier', { 'do': 'yarn install' }
Plug 'dense-analysis/ale'
```

## 数据库配置

### PostgreSQL 本地安装

#### macOS
```bash
# 使用 Homebrew
brew install postgresql
brew services start postgresql

# 创建数据库
createdb siteframe_dev
```

#### Windows
1. 下载 [PostgreSQL 安装包](https://www.postgresql.org/download/windows/)
2. 按照安装向导完成安装
3. 使用 pgAdmin 创建数据库

#### Linux
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# 启动服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 创建数据库
sudo -u postgres createdb siteframe_dev
```

### Docker 方式（推荐）

创建 `docker-compose.yml`：

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: siteframe_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

启动服务：

```bash
# 启动数据库服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 停止服务
docker-compose down
```

### 数据库迁移

```bash
# 运行数据库迁移
pnpm db:migrate

# 生成测试数据
pnpm db:seed

# 重置数据库
pnpm db:reset
```

## 环境变量配置

### 环境变量文件

```bash
# .env.local（本地开发）
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# 数据库配置
DATABASE_URL="postgresql://postgres:password@localhost:5432/siteframe_dev"

# 认证配置
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL=http://localhost:3000

# 第三方服务
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# 邮件服务
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password

# 文件上传
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# 分析服务
GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"

# 开发工具
ANALYZE=false
```

### 环境变量验证

创建 `src/lib/env.ts`：

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  DATABASE_URL: z.string(),
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

## 开发流程

### 1. 功能开发流程

```bash
# 1. 同步最新代码
git checkout develop
git pull origin develop

# 2. 创建功能分支
git checkout -b feature/user-authentication

# 3. 开发功能
# ... 编写代码 ...

# 4. 运行测试
pnpm test
pnpm lint
pnpm type-check

# 5. 提交代码
git add .
git commit -m "feat: add user authentication"

# 6. 推送分支
git push origin feature/user-authentication

# 7. 创建 Pull Request
```

### 2. 代码质量检查

```bash
# 代码格式化
pnpm format

# 代码检查
pnpm lint
pnpm lint:fix

# 类型检查
pnpm type-check

# 运行测试
pnpm test
pnpm test:watch
pnpm test:coverage

# 构建检查
pnpm build
```

### 3. Git Hooks 配置

安装 Husky：

```bash
# 安装 Husky
pnpm add -D husky lint-staged

# 初始化 Husky
npx husky install

# 添加 pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

# 添加 commit-msg hook
npx husky add .husky/commit-msg 'npx commitlint --edit $1'
```

配置 `package.json`：

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

## 常用命令

### 开发命令

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查和格式化
pnpm lint
pnpm lint:fix
pnpm format
pnpm type-check

# 测试
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm test:e2e

# 数据库操作
pnpm db:migrate
pnpm db:seed
pnpm db:reset
pnpm db:studio

# 依赖管理
pnpm install
pnpm add <package>
pnpm add -D <package>
pnpm remove <package>
pnpm update

# 清理
pnpm clean
pnpm clean:deps
```

### 自定义脚本

在 `package.json` 中添加：

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "db:init": "tsx scripts/init-supabase.ts",
"db:seed": "tsx scripts/init-supabase.ts",
"supabase:types": "supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > lib/supabase-types.ts"
    "clean": "rm -rf .next out dist",
    "clean:deps": "rm -rf node_modules pnpm-lock.yaml && pnpm install",
    "analyze": "ANALYZE=true next build"
  }
}
```

## 故障排除

### 常见问题

#### 1. 端口被占用

```bash
# 查找占用端口的进程
lsof -ti:3000

# 杀死进程
kill -9 $(lsof -ti:3000)

# 或使用不同端口
pnpm dev -- -p 3001
```

#### 2. 依赖安装失败

```bash
# 清理缓存
pnpm store prune
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 使用不同镜像源
pnpm install --registry https://registry.npmjs.org/
```

#### 3. TypeScript 错误

```bash
# 重启 TypeScript 服务
# VS Code: Ctrl+Shift+P -> "TypeScript: Restart TS Server"

# 清理 TypeScript 缓存
rm -rf .next/cache

# 检查 tsconfig.json 配置
pnpm type-check
```

#### 4. ESLint 错误

```bash
# 自动修复
pnpm lint:fix

# 忽略特定规则
// eslint-disable-next-line @typescript-eslint/no-unused-vars

# 重新安装 ESLint 配置
pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

#### 5. 数据库连接问题

```bash
# 检查数据库服务状态
docker-compose ps

# 查看数据库日志
docker-compose logs postgres

# 重启数据库服务
docker-compose restart postgres

# 测试数据库连接
pnpm db:studio
```

### 性能问题

#### 1. 开发服务器慢

```bash
# 增加 Node.js 内存限制
NODE_OPTIONS="--max-old-space-size=4096" pnpm dev

# 禁用某些功能
NEXT_TELEMETRY_DISABLED=1 pnpm dev
```

#### 2. 构建慢

```bash
# 分析构建
pnpm analyze

# 使用 SWC 编译器（Next.js 12+）
# 在 next.config.js 中启用
module.exports = {
  swcMinify: true,
}
```

## 性能优化

### 开发环境优化

#### 1. 启用快速刷新

```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: true,
  },
};
```

#### 2. 优化 TypeScript 编译

```json
// tsconfig.json
{
  "compilerOptions": {
    "incremental": true,
    "skipLibCheck": true
  },
  "exclude": [
    "node_modules",
    ".next",
    "**/*.test.ts",
    "**/*.test.tsx"
  ]
}
```

#### 3. 配置 IDE 性能

```json
// .vscode/settings.json
{
  "typescript.preferences.includePackageJsonAutoImports": "off",
  "typescript.suggest.autoImports": false,
  "search.exclude": {
    "**/node_modules": true,
    "**/.next": true
  }
}
```

### 监控和调试

#### 1. 性能监控

```bash
# 安装性能监控工具
pnpm add -D @next/bundle-analyzer

# 分析包大小
ANALYZE=true pnpm build
```

#### 2. 调试工具

```bash
# 启用调试模式
DEBUG=* pnpm dev

# React 开发者工具
# 浏览器扩展：React Developer Tools

# Next.js 调试
NODE_OPTIONS='--inspect' pnpm dev
```

---

## 团队协作

### 1. 代码审查清单

- [ ] 代码遵循项目规范
- [ ] 通过所有测试
- [ ] 没有 TypeScript 错误
- [ ] 没有 ESLint 警告
- [ ] 性能影响评估
- [ ] 安全性检查
- [ ] 文档更新

### 2. 发布检查清单

- [ ] 功能测试完成
- [ ] 性能测试通过
- [ ] 安全扫描通过
- [ ] 文档更新
- [ ] 版本号更新
- [ ] 变更日志更新

### 3. 紧急修复流程

```bash
# 1. 从 main 分支创建热修复分支
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix

# 2. 修复问题
# ... 编写修复代码 ...

# 3. 测试修复
pnpm test
pnpm build

# 4. 提交并合并
git commit -m "fix: resolve critical security issue"
git push origin hotfix/critical-bug-fix

# 5. 创建紧急 PR 并立即合并
# 6. 部署到生产环境
# 7. 将修复合并回 develop 分支
```

---

遵循这个开发环境配置指南可以确保：

1. **环境一致性** - 所有团队成员使用相同的开发环境
2. **开发效率** - 自动化工具提高开发速度
3. **代码质量** - 自动检查确保代码质量
4. **问题预防** - 早期发现和解决问题
5. **团队协作** - 标准化的流程促进协作

如果遇到任何问题，请参考故障排除部分或联系团队技术负责人。