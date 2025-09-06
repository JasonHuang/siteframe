# SiteFrame - Modern Theme System

一个现代化、可扩展的主题系统框架，支持动态组件加载、主题切换和自定义配置。

## 🚀 特性

- **动态主题加载**: 支持运行时动态加载和切换主题
- **组件化架构**: 基于 React 的模块化组件系统
- **TypeScript 支持**: 完整的类型定义和类型安全
- **热重载开发**: 开发时支持热重载和实时预览
- **主题市场**: 支持主题打包、分发和安装
- **自定义配置**: 灵活的主题配置和个性化选项
- **性能优化**: 代码分割、懒加载和缓存优化
- **响应式设计**: 支持多设备和屏幕尺寸适配

## 📦 安装

```bash
# 使用 npm
npm install siteframe

# 使用 yarn
yarn add siteframe

# 使用 pnpm
pnpm add siteframe
```

## 🛠️ 开发

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0
- TypeScript >= 4.5.0

### 开发设置

```bash
# 克隆项目
git clone https://github.com/your-username/siteframe.git
cd siteframe

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 运行测试
npm test

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

### 开发脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run test` - 运行测试套件
- `npm run lint` - 运行 ESLint 检查
- `npm run type-check` - 运行 TypeScript 类型检查
- `npm run format` - 格式化代码
- `npm run docs:dev` - 启动文档开发服务器
- `npm run docs:build` - 构建文档

## 🧪 测试

```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行特定测试文件
npm test -- --testPathPattern=theme-engine

# 监听模式运行测试
npm run test:watch
```

## 📦 构建和发布

```bash
# 构建库文件
npm run build:lib

# 构建示例主题
npm run build:examples

# 构建文档
npm run build:docs

# 发布到 npm
npm publish
```

## 🤝 贡献

我们欢迎所有形式的贡献！请阅读 [贡献指南](CONTRIBUTING.md) 了解如何参与项目开发。

### 贡献流程

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 代码规范

- 使用 TypeScript 进行开发
- 遵循 ESLint 和 Prettier 配置
- 编写单元测试覆盖新功能
- 更新相关文档
- 遵循语义化版本规范

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和社区成员。

## 📞 支持

- 📧 邮箱: support@siteframe.dev
- 💬 讨论: [GitHub Discussions](https://github.com/your-username/siteframe/discussions)
- 🐛 问题报告: [GitHub Issues](https://github.com/your-username/siteframe/issues)
- 📖 文档: [官方文档](https://siteframe.dev/docs)

## 🗺️ 路线图

### v1.0.0 (当前)
- ✅ 核心主题引擎
- ✅ 动态组件加载
- ✅ 基础示例主题
- ✅ TypeScript 支持
- ✅ 开发工具

### v1.1.0 (计划中)
- 🔄 主题市场集成
- 🔄 可视化主题编辑器
- 🔄 更多内置组件
- 🔄 国际化支持

### v1.2.0 (未来)
- 📋 插件系统
- 📋 主题分析工具
- 📋 性能监控
- 📋 A/B 测试支持

## 🌟 Star History

如果这个项目对你有帮助，请给我们一个 ⭐️！

[![Star History Chart](https://api.star-history.com/svg?repos=your-username/siteframe&type=Date)](https://star-history.com/#your-username/siteframe&Date)

---

<div align="center">
  <p>用 ❤️ 构建，为了更好的主题开发体验</p>
  <p>© 2024 SiteFrame. All rights reserved.</p>
</div>

## 🏗️ 项目结构

```
siteframe/
├── lib/                    # 核心库文件
│   ├── components/         # 核心组件
│   ├── services/          # 服务层
│   ├── types/             # 类型定义
│   └── utils/             # 工具函数
├── examples/              # 示例主题
│   └── minimal-theme/     # 最小化主题示例
├── docs/                  # 文档
│   ├── MODERN_THEME_SYSTEM_GUIDE.md
│   ├── THEME_API_REFERENCE.md
│   └── THEME_BEST_PRACTICES.md
├── tools/                 # 开发工具
└── tests/                 # 测试文件
```

## 🚀 快速开始

### 1. 创建基础应用

```tsx
import React from 'react';
import { ThemeProvider, ModernThemeEngine } from 'siteframe';
import { MinimalTheme } from 'siteframe/examples/minimal-theme';

const App: React.FC = () => {
  const themeEngine = new ModernThemeEngine();
  
  return (
    <ThemeProvider engine={themeEngine} theme={MinimalTheme}>
      <div className="app">
        <h1>欢迎使用 SiteFrame</h1>
        <p>现代化主题系统框架</p>
      </div>
    </ThemeProvider>
  );
};

export default App;
```

### 2. 使用主题组件

```tsx
import { useTheme, DynamicComponent } from 'siteframe';

const MyPage: React.FC = () => {
  const { theme, switchTheme } = useTheme();
  
  return (
    <div>
      <DynamicComponent 
        type="layout" 
        name="DefaultLayout"
        props={{
          header: <DynamicComponent type="block" name="Header" />,
          footer: <DynamicComponent type="block" name="Footer" />
        }}
      >
        <DynamicComponent type="block" name="PostCard" props={{
          title: "示例文章",
          excerpt: "这是一个示例文章摘要",
          date: new Date()
        }} />
      </DynamicComponent>
    </div>
  );
};
```

### 3. 创建自定义主题

```tsx
import { ThemeConfig } from 'siteframe';

const MyCustomTheme: ThemeConfig = {
  name: 'my-custom-theme',
  version: '1.0.0',
  displayName: '我的自定义主题',
  description: '一个自定义主题示例',
  
  layouts: {
    default: {
      type: 'layout',
      component: 'DefaultLayout'
    }
  },
  
  blocks: {
    header: {
      type: 'block',
      component: 'Header'
    },
    footer: {
      type: 'block', 
      component: 'Footer'
    }
  },
  
  styles: {
    colors: {
      primary: '#007bff',
      secondary: '#6c757d'
    },
    fonts: {
      body: 'Inter, sans-serif',
      heading: 'Inter, sans-serif'
    }
  },
  
  settings: {
    darkMode: true,
    responsive: true
  }
};

export default MyCustomTheme;
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

- [现代化主题系统指南](./docs/MODERN_THEME_SYSTEM_GUIDE.md) - 完整的系统架构和使用指南
- [API 参考文档](./docs/THEME_API_REFERENCE.md) - 详细的 API 接口说明
- [最佳实践](./docs/THEME_BEST_PRACTICES.md) - 主题开发最佳实践

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