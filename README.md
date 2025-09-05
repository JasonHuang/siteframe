# SiteFrame

一个现代化的网站框架，基于 Next.js 13+ 和 TypeScript 构建，提供完整的前端解决方案。

## ✨ 特性

- 🚀 **现代技术栈** - Next.js 13+, TypeScript, Tailwind CSS
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🎨 **美观界面** - 现代化的 UI 设计和用户体验
- 🔧 **模块化组件** - 可复用的 React 组件架构
- 📊 **数据库集成** - Supabase 后端服务支持
- 🛡️ **类型安全** - 完整的 TypeScript 类型定义
- 📝 **完整文档** - 详细的开发指南和代码规范

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