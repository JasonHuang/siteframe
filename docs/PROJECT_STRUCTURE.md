# 项目结构规范

本文档定义了项目的目录结构、文件组织方式和命名规范，确保代码库的一致性和可维护性。

## 目录

- [整体架构](#整体架构)
- [目录结构](#目录结构)
- [文件命名规范](#文件命名规范)
- [组件组织](#组件组织)
- [样式组织](#样式组织)
- [资源管理](#资源管理)
- [配置文件](#配置文件)
- [最佳实践](#最佳实践)

## 整体架构

项目采用现代前端架构，支持以下特性：

- **模块化设计** - 功能按模块组织
- **组件化开发** - 可复用的 UI 组件
- **类型安全** - TypeScript 类型检查
- **样式隔离** - CSS Modules 或 Tailwind CSS
- **路径别名** - 简化导入路径
- **代码分割** - 按需加载优化性能

## 目录结构

```
siteframe/
├── .github/                    # GitHub 配置
│   ├── workflows/              # CI/CD 工作流
│   ├── ISSUE_TEMPLATE/         # Issue 模板
│   └── PULL_REQUEST_TEMPLATE.md # PR 模板
├── .next/                      # Next.js 构建输出（自动生成）
├── .vscode/                    # VS Code 配置
│   ├── settings.json           # 编辑器设置
│   ├── extensions.json         # 推荐扩展
│   └── launch.json             # 调试配置
├── docs/                       # 项目文档
│   ├── api/                    # API 文档
│   ├── deployment/             # 部署文档
│   └── development/            # 开发文档
├── public/                     # 静态资源
│   ├── images/                 # 图片资源
│   ├── icons/                  # 图标文件
│   ├── fonts/                  # 字体文件
│   ├── favicon.ico             # 网站图标
│   ├── robots.txt              # 搜索引擎配置
│   └── sitemap.xml             # 站点地图
├── src/                        # 源代码目录
│   ├── app/                    # Next.js App Router（Next.js 13+）
│   │   ├── (auth)/             # 路由组
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/        # 仪表板路由组
│   │   │   ├── admin/
│   │   │   └── user/
│   │   ├── api/                # API 路由
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   └── products/
│   │   ├── globals.css         # 全局样式
│   │   ├── layout.tsx          # 根布局
│   │   ├── loading.tsx         # 全局加载组件
│   │   ├── error.tsx           # 全局错误组件
│   │   ├── not-found.tsx       # 404 页面
│   │   └── page.tsx            # 首页
│   ├── components/             # 可复用组件
│   │   ├── ui/                 # 基础 UI 组件
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.module.css
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Card/
│   │   │   └── index.ts        # 统一导出
│   │   ├── forms/              # 表单组件
│   │   │   ├── LoginForm/
│   │   │   ├── ContactForm/
│   │   │   └── index.ts
│   │   ├── layout/             # 布局组件
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Sidebar/
│   │   │   ├── Navigation/
│   │   │   └── index.ts
│   │   ├── features/           # 功能组件
│   │   │   ├── auth/
│   │   │   │   ├── LoginButton/
│   │   │   │   ├── UserProfile/
│   │   │   │   └── index.ts
│   │   │   ├── products/
│   │   │   │   ├── ProductCard/
│   │   │   │   ├── ProductList/
│   │   │   │   └── index.ts
│   │   │   └── dashboard/
│   │   └── common/             # 通用组件
│   │       ├── Loading/
│   │       ├── ErrorBoundary/
│   │       ├── SEO/
│   │       └── index.ts
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── useAuth.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useFetch.ts
│   │   └── index.ts
│   ├── lib/                    # 核心库和配置
│   │   ├── auth.ts             # 认证配置
│   │   ├── database.ts         # 数据库配置
│   │   ├── email.ts            # 邮件服务
│   │   ├── storage.ts          # 存储服务
│   │   └── validations.ts      # 验证规则
│   ├── services/               # API 服务
│   │   ├── api.ts              # API 基础配置
│   │   ├── auth.service.ts     # 认证服务
│   │   ├── user.service.ts     # 用户服务
│   │   ├── product.service.ts  # 产品服务
│   │   └── index.ts
│   ├── stores/                 # 状态管理
│   │   ├── auth.store.ts       # 认证状态
│   │   ├── user.store.ts       # 用户状态
│   │   ├── ui.store.ts         # UI 状态
│   │   └── index.ts
│   ├── types/                  # TypeScript 类型定义
│   │   ├── auth.types.ts       # 认证相关类型
│   │   ├── user.types.ts       # 用户相关类型
│   │   ├── api.types.ts        # API 相关类型
│   │   ├── common.types.ts     # 通用类型
│   │   └── index.ts
│   ├── utils/                  # 工具函数
│   │   ├── format.ts           # 格式化函数
│   │   ├── validation.ts       # 验证函数
│   │   ├── date.ts             # 日期处理
│   │   ├── string.ts           # 字符串处理
│   │   ├── array.ts            # 数组处理
│   │   ├── object.ts           # 对象处理
│   │   ├── url.ts              # URL 处理
│   │   └── index.ts
│   ├── constants/              # 常量定义
│   │   ├── api.constants.ts    # API 常量
│   │   ├── app.constants.ts    # 应用常量
│   │   ├── routes.constants.ts # 路由常量
│   │   └── index.ts
│   ├── styles/                 # 样式文件
│   │   ├── globals.css         # 全局样式
│   │   ├── variables.css       # CSS 变量
│   │   ├── components.css      # 组件样式
│   │   ├── utilities.css       # 工具类样式
│   │   └── themes/             # 主题样式
│   │       ├── light.css
│   │       └── dark.css
│   └── middleware.ts           # Next.js 中间件
├── tests/                      # 测试文件
│   ├── __mocks__/              # Mock 文件
│   ├── components/             # 组件测试
│   ├── pages/                  # 页面测试
│   ├── utils/                  # 工具函数测试
│   ├── setup.ts                # 测试配置
│   └── jest.config.js          # Jest 配置
├── .env.local                  # 本地环境变量
├── .env.example                # 环境变量示例
├── .eslintrc.json              # ESLint 配置
├── .eslintignore               # ESLint 忽略文件
├── .gitignore                  # Git 忽略文件
├── .prettierrc                 # Prettier 配置
├── .prettierignore             # Prettier 忽略文件
├── .editorconfig               # 编辑器配置
├── next.config.js              # Next.js 配置
├── tailwind.config.js          # Tailwind CSS 配置
├── postcss.config.js           # PostCSS 配置
├── tsconfig.json               # TypeScript 配置
├── package.json                # 项目依赖
├── package-lock.json           # 依赖锁定文件
├── README.md                   # 项目说明
├── CHANGELOG.md                # 更新日志
├── CONTRIBUTING.md             # 贡献指南
├── LICENSE                     # 许可证
├── CODING_STANDARDS.md         # 编码规范
├── GIT_WORKFLOW.md             # Git 工作流
└── PROJECT_STRUCTURE.md        # 项目结构说明（本文件）
```

## 文件命名规范

### 组件文件

```
# React 组件 - PascalCase
UserProfile.tsx
NavigationBar.tsx
ProductCard.tsx

# 组件样式 - 与组件同名
UserProfile.module.css
NavigationBar.module.css

# 组件测试 - 与组件同名 + .test
UserProfile.test.tsx
NavigationBar.test.tsx

# 组件故事书 - 与组件同名 + .stories
UserProfile.stories.tsx
```

### 页面文件

```
# Next.js 页面 - kebab-case 或 camelCase
page.tsx                    # 首页
about/page.tsx             # 关于页面
user-profile/page.tsx      # 用户资料页面
product/[id]/page.tsx      # 动态路由
```

### 工具和服务文件

```
# 工具函数 - camelCase
formatDate.ts
validateEmail.ts
stringUtils.ts

# 服务文件 - camelCase + .service
auth.service.ts
user.service.ts
api.service.ts

# 类型定义 - camelCase + .types
user.types.ts
api.types.ts
common.types.ts

# 常量文件 - camelCase + .constants
api.constants.ts
app.constants.ts
```

### 配置文件

```
# 配置文件 - kebab-case 或特定格式
next.config.js
tailwind.config.js
postcss.config.js
jest.config.js

# 环境文件
.env.local
.env.development
.env.production
```

## 组件组织

### 组件目录结构

每个组件都应该有自己的目录，包含以下文件：

```
Button/
├── Button.tsx              # 组件主文件
├── Button.module.css       # 组件样式
├── Button.test.tsx         # 组件测试
├── Button.stories.tsx      # Storybook 故事
├── Button.types.ts         # 组件类型定义
├── hooks/                  # 组件专用 hooks
│   └── useButton.ts
├── utils/                  # 组件专用工具
│   └── buttonUtils.ts
└── index.ts                # 导出文件
```

### 组件导出规范

```typescript
// Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button.types';
export { useButton } from './hooks/useButton';
```

### 组件分类

#### 1. UI 组件 (`src/components/ui/`)

基础的、无业务逻辑的 UI 组件：

```
ui/
├── Button/
├── Input/
├── Modal/
├── Card/
├── Badge/
├── Avatar/
├── Spinner/
└── Tooltip/
```

#### 2. 表单组件 (`src/components/forms/`)

表单相关的复合组件：

```
forms/
├── LoginForm/
├── RegisterForm/
├── ContactForm/
├── SearchForm/
└── FilterForm/
```

#### 3. 布局组件 (`src/components/layout/`)

页面布局相关组件：

```
layout/
├── Header/
├── Footer/
├── Sidebar/
├── Navigation/
├── Breadcrumb/
└── Container/
```

#### 4. 功能组件 (`src/components/features/`)

按功能模块组织的业务组件：

```
features/
├── auth/
│   ├── LoginButton/
│   ├── UserProfile/
│   └── ProtectedRoute/
├── products/
│   ├── ProductCard/
│   ├── ProductList/
│   └── ProductFilter/
└── dashboard/
    ├── StatsCard/
    ├── Chart/
    └── DataTable/
```

#### 5. 通用组件 (`src/components/common/`)

跨功能的通用组件：

```
common/
├── Loading/
├── ErrorBoundary/
├── SEO/
├── LazyImage/
└── InfiniteScroll/
```

## 样式组织

### CSS Modules 方式

```
# 组件样式文件
Button.module.css
Card.module.css

# 全局样式
globals.css
variables.css
components.css
```

### Tailwind CSS 方式

```
# 配置文件
tailwind.config.js
postcss.config.js

# 样式文件
src/styles/
├── globals.css             # 包含 Tailwind 指令
├── components.css          # 自定义组件样式
└── utilities.css           # 自定义工具类
```

### 样式变量

```css
/* variables.css */
:root {
  /* 颜色 */
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  /* 间距 */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* 字体 */
  --font-family-sans: 'Inter', sans-serif;
  --font-family-mono: 'Fira Code', monospace;
  
  /* 断点 */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

## 资源管理

### 图片资源

```
public/images/
├── logos/                  # 品牌 Logo
│   ├── logo.svg
│   ├── logo-dark.svg
│   └── favicon.ico
├── heroes/                 # 首屏大图
│   ├── hero-home.jpg
│   └── hero-about.jpg
├── products/               # 产品图片
│   ├── product-1.jpg
│   └── product-2.jpg
├── avatars/                # 头像图片
│   └── default-avatar.png
└── icons/                  # 图标文件
    ├── arrow-right.svg
    └── check.svg
```

### 字体资源

```
public/fonts/
├── inter/
│   ├── Inter-Regular.woff2
│   ├── Inter-Medium.woff2
│   └── Inter-Bold.woff2
└── fira-code/
    └── FiraCode-Regular.woff2
```

### 图标管理

推荐使用 SVG 图标，可以选择以下方式：

1. **内联 SVG 组件**
   ```typescript
   // src/components/ui/icons/ArrowRight.tsx
   export function ArrowRightIcon({ className }: { className?: string }) {
     return (
       <svg className={className} viewBox="0 0 24 24">
         <path d="M5 12h14m-7-7l7 7-7 7" />
       </svg>
     );
   }
   ```

2. **图标库**
   ```typescript
   import { ArrowRightIcon } from '@heroicons/react/24/outline';
   import { FiArrowRight } from 'react-icons/fi';
   ```

## 配置文件

### 环境变量

```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api

DATABASE_URL=postgresql://user:password@localhost:5432/mydb
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-password
```

### Next.js 配置

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['example.com'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;
```

### TypeScript 路径映射

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

## 最佳实践

### 1. 模块化原则

- **单一职责**：每个文件/组件只负责一个功能
- **高内聚**：相关功能放在一起
- **低耦合**：减少模块间的依赖

### 2. 命名一致性

```typescript
// ✅ 好的命名
const UserProfile = () => {};
const useUserData = () => {};
const formatUserName = () => {};
const USER_ROLES = {};

// ❌ 避免的命名
const userprofile = () => {};
const getUserData = () => {}; // Hook 应该以 use 开头
const format_user_name = () => {}; // 应该使用 camelCase
```

### 3. 导入导出规范

```typescript
// ✅ 推荐的导入顺序
// 1. React 和第三方库
import React from 'react';
import { NextPage } from 'next';
import axios from 'axios';

// 2. 内部模块（使用路径别名）
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks';
import { formatDate } from '@/utils';

// 3. 相对导入
import { Header } from './Header';
import { Footer } from './Footer';

// 4. 类型导入
import type { User } from '@/types';
```

### 4. 组件设计原则

```typescript
// ✅ 好的组件设计
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  onClick 
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### 5. 错误处理

```typescript
// 错误边界组件
export class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}
```

### 6. 性能优化

```typescript
// 使用 React.memo 优化组件
const UserCard = React.memo(function UserCard({ user }: { user: User }) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});

// 使用动态导入进行代码分割
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

### 7. 测试组织

```
tests/
├── __mocks__/              # 全局 Mock
│   ├── next/
│   └── react/
├── components/             # 组件测试
│   ├── ui/
│   └── features/
├── pages/                  # 页面测试
├── utils/                  # 工具函数测试
├── hooks/                  # Hook 测试
└── setup.ts                # 测试环境配置
```

### 8. 文档维护

- **README.md** - 项目概述和快速开始
- **CHANGELOG.md** - 版本更新记录
- **API 文档** - 接口文档
- **组件文档** - Storybook 或类似工具
- **部署文档** - 部署流程和配置

---

## 总结

遵循这个项目结构规范可以：

1. **提高开发效率** - 清晰的目录结构便于快速定位文件
2. **降低维护成本** - 一致的组织方式便于理解和修改
3. **促进团队协作** - 统一的规范减少沟通成本
4. **支持项目扩展** - 模块化设计便于添加新功能
5. **保证代码质量** - 规范的结构有助于代码审查

记住：**结构是为了服务开发，而不是限制开发**。团队应该根据项目实际需求调整这些规范。