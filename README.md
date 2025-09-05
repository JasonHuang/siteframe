# SiteFrame CMS

一个基于 Next.js 和 Supabase 构建的现代化内容管理系统。

## 功能特性

### 📝 内容管理
- 文章创建、编辑和发布
- 富文本编辑器支持
- 文章状态管理（草稿、已发布、已归档）
- 文章分类和标签
- SEO 优化支持

### 🖼️ 媒体管理
- 文件上传和管理
- 图片、视频、音频、文档支持
- 文件搜索和过滤
- 批量操作
- 云存储集成

### 👥 用户管理
- 用户注册和登录
- 角色权限管理
- 用户资料管理
- 社交登录支持（Google、GitHub）

### 🔐 权限系统
- 基于角色的访问控制（RBAC）
- 细粒度权限管理
- 权限检查组件
- 安全的 API 访问

## 技术栈

- **前端**: Next.js 14, React, TypeScript, Tailwind CSS
- **后端**: Supabase (PostgreSQL, Auth, Storage)
- **状态管理**: React Context
- **UI 组件**: 自定义组件库
- **编辑器**: 富文本编辑器

## 🏗️ 项目结构

```
siteframe/
├── app/                    # Next.js 13 App Router
│   ├── components/         # React 组件
│   │   ├── Header.tsx      # 导航栏组件
│   │   ├── HeroSection.tsx # 主要展示区域
│   │   ├── Features.tsx    # 特性展示
│   │   ├── About.tsx       # 关于我们
│   │   ├── Services.tsx    # 服务介绍
│   │   ├── Testimonials.tsx# 客户评价
│   │   ├── Contact.tsx     # 联系方式
│   │   └── Footer.tsx      # 页脚
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 首页
├── lib/                    # 工具库
│   └── supabase.ts         # Supabase 配置
├── database/               # 数据库相关
│   └── schema.sql          # 数据库架构
├── docs/                   # 项目文档
└── scripts/                # 脚本文件
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.17.0
- npm >= 9.0.0
- Git >= 2.30.0

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/JasonHuang/siteframe.git
   cd siteframe
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **环境配置**
   ```bash
   # 复制环境变量模板
   cp .env.example .env
   
   # 编辑 .env 文件，配置必要的环境变量
   # 如果使用 Supabase，需要配置数据库连接信息
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📋 可用脚本

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 代码格式化
npm run format

# 类型检查
npm run type-check

# 数据库初始化（如果使用 Supabase）
npm run db:init
```

## 🗄️ 数据库配置

项目支持 Supabase 作为后端数据库服务：

1. 创建 Supabase 项目
2. 配置环境变量
3. 运行数据库初始化脚本

### 管理员账号

系统会自动创建一个默认的超级管理员账号：

- **邮箱**: `admin@example.com`
- **角色**: 超级管理员 (ADMIN)
- **权限**: 完整的系统管理权限

**首次使用步骤**：
1. 运行数据库初始化：`DOTENV_CONFIG_PATH=.env.local npm run db:init`
2. 访问注册页面：`/auth/signup`
3. 使用邮箱 `admin@example.com` 进行注册
4. 系统会自动关联到管理员权限

> ⚠️ **安全提醒**：首次登录后请立即修改管理员邮箱和密码，确保系统安全。

详细配置请参考 [数据库设置指南](docs/database-setup.md)

## 📚 文档

- [开发环境配置](DEVELOPMENT_SETUP.md)
- [开发指南](DEVELOPMENT_GUIDE.md)
- [代码规范](CODING_STANDARDS.md)
- [Git 工作流](GIT_WORKFLOW.md)
- [项目结构说明](PROJECT_STRUCTURE.md)
- [代码审查清单](CODE_REVIEW_CHECKLIST.md)

## 🛠️ 技术栈

- **前端框架**: Next.js 13+
- **开发语言**: TypeScript
- **样式方案**: Tailwind CSS
- **后端服务**: Supabase
- **代码规范**: ESLint + Prettier
- **版本控制**: Git

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

请确保遵循项目的代码规范和提交信息规范。

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 创建 [Issue](https://github.com/JasonHuang/siteframe/issues)
- 发送邮件到项目维护者

---

⭐ 如果这个项目对你有帮助，请给它一个星标！