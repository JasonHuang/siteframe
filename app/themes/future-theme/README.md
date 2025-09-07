# Modern Blog Theme

一个现代化、响应式的博客主题，专为 SiteFrame 主题系统设计。

## 特性

- 🎨 **现代设计** - 简洁优雅的界面设计
- 📱 **响应式布局** - 完美适配各种设备
- 🌙 **深色模式** - 支持明暗主题切换
- ⚡ **高性能** - 优化的组件和样式
- 🎯 **SEO友好** - 内置SEO最佳实践
- 🔧 **高度可定制** - 丰富的配置选项
- 📦 **TypeScript** - 完整的类型支持

## 目录结构

```
future-theme/
├── src/
│   ├── components/          # 组件
│   │   ├── layouts/         # 布局组件
│   │   ├── blocks/          # 区块组件
│   │   └── widgets/         # 小部件组件
│   ├── styles/              # 样式
│   │   ├── tokens.ts        # 设计令牌
│   │   └── index.ts         # 样式导出
│   ├── config/              # 配置
│   │   └── default.ts       # 默认配置
│   ├── hooks/               # React钩子
│   │   ├── useTheme.ts      # 主题钩子
│   │   └── index.ts         # 钩子导出
│   └── utils/               # 工具函数
│       ├── helpers.ts       # 辅助函数
│       └── index.ts         # 工具导出
├── index.ts                 # 主题入口
└── README.md               # 说明文档
```

## 组件

### 布局组件

- **DefaultLayout** - 默认布局，适用于大部分页面
- **PostLayout** - 文章布局，专为博客文章设计

### 区块组件

- **Header** - 头部组件，包含导航和搜索
- **Footer** - 底部组件，包含链接和版权信息
- **Navigation** - 导航组件，支持多种样式

### 小部件组件

- **PostCard** - 文章卡片，展示文章摘要
- **TagCloud** - 标签云，展示标签集合

## 设计令牌

主题使用设计令牌系统来管理样式，包括：

- **颜色** - 主色、辅助色、中性色等
- **字体** - 字体族、大小、行高、字重
- **间距** - 统一的间距系统
- **边框** - 圆角、边框样式
- **阴影** - 多层次阴影效果
- **断点** - 响应式断点

## 配置选项

```typescript
interface ThemeConfig {
  site: {
    name: string;
    description: string;
    url: string;
    logo?: string;
  };
  layout: {
    sidebar: boolean;
    navigation: 'top' | 'side';
    maxWidth: string;
  };
  styles: {
    primaryColor: string;
    fontFamily: string;
  };
  features: {
    search: boolean;
    comments: boolean;
    newsletter: boolean;
    analytics: boolean;
  };
  custom: Record<string, any>;
}
```

## 钩子函数

### useThemeMode

管理主题模式（明暗切换）：

```typescript
const { mode, toggleMode } = useThemeMode();
```

### useThemeConfig

管理主题配置：

```typescript
const { config, updateConfig } = useThemeConfig();
```

### useBreakpoint

响应式断点检测：

```typescript
const breakpoint = useBreakpoint(); // 'sm' | 'md' | 'lg' | 'xl' | '2xl'
```

## 工具函数

- `cn()` - 类名合并
- `formatDate()` - 日期格式化
- `calculateReadTime()` - 计算阅读时间
- `truncateText()` - 文本截取
- `generateSlug()` - 生成URL slug
- `deepMerge()` - 深度合并对象
- `debounce()` / `throttle()` - 防抖和节流
- `isExternalLink()` - 检查外部链接
- `hexToRgb()` / `getContrastColor()` - 颜色工具

## 使用方法

1. 将主题文件放置在 `examples/future-theme/` 目录下
2. 在主题系统中引入主题
3. 根据需要调整配置选项
4. 自定义样式和组件

## 开发指南

### 添加新组件

1. 在相应的组件目录下创建组件文件
2. 更新组件导出文件
3. 添加组件元数据（如需要）

### 自定义样式

1. 修改 `src/styles/tokens.ts` 中的设计令牌
2. 更新 `src/styles/index.ts` 中的样式配置
3. 在组件中使用CSS变量

### 扩展配置

1. 修改 `src/config/default.ts` 中的默认配置
2. 更新配置类型定义
3. 在组件中使用配置选项

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个主题。

## 更新日志

### v1.0.0

- 初始版本发布
- 基础布局和组件
- 设计令牌系统
- 响应式设计
- 深色模式支持