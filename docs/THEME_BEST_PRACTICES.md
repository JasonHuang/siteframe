# 主题系统最佳实践指南

## 目录

1. [主题开发最佳实践](#主题开发最佳实践)
2. [组件设计原则](#组件设计原则)
3. [性能优化指南](#性能优化指南)
4. [样式管理策略](#样式管理策略)
5. [配置设计规范](#配置设计规范)
6. [测试策略](#测试策略)
7. [文档编写规范](#文档编写规范)
8. [版本管理](#版本管理)
9. [安全考虑](#安全考虑)
10. [常见问题解决](#常见问题解决)

## 主题开发最佳实践

### 1. 项目结构规范

推荐的主题项目结构：

```
my-theme/
├── src/
│   ├── components/
│   │   ├── layouts/
│   │   │   ├── DefaultLayout/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── meta.ts
│   │   │   │   └── styles.module.css
│   │   │   └── PostLayout/
│   │   ├── blocks/
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   └── Navigation/
│   │   └── widgets/
│   ├── styles/
│   │   ├── tokens.ts
│   │   ├── globals.css
│   │   └── themes/
│   ├── config/
│   │   ├── default.ts
│   │   └── schema.ts
│   ├── hooks/
│   │   └── index.ts
│   ├── utils/
│   │   └── index.ts
│   └── types/
│       └── index.ts
├── docs/
│   ├── README.md
│   ├── CHANGELOG.md
│   └── examples/
├── tests/
├── package.json
├── tsconfig.json
└── index.ts
```

### 2. 命名规范

#### 组件命名

```typescript
// ✅ 好的命名
const BlogPostCard = () => { /* ... */ };
const UserProfileHeader = () => { /* ... */ };
const ProductCatalogGrid = () => { /* ... */ };

// ❌ 避免的命名
const Card = () => { /* ... */ }; // 太通用
const comp1 = () => { /* ... */ }; // 无意义
const blogpostcard = () => { /* ... */ }; // 缺少大小写
```

#### 文件命名

```
// ✅ 组件文件
BlogPostCard.tsx
UserProfileHeader.tsx

// ✅ 样式文件
BlogPostCard.module.css
UserProfileHeader.styles.ts

// ✅ 类型文件
types.ts
interfaces.ts

// ✅ 工具文件
utils.ts
helpers.ts
```

### 3. TypeScript 使用规范

#### 严格类型定义

```typescript
// ✅ 严格的 Props 类型定义
interface BlogPostCardProps {
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: Date;
  tags: string[];
  readTime?: number;
  onRead?: (postId: string) => void;
}

// ✅ 使用泛型提高复用性
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  loading?: boolean;
  error?: Error;
}

// ✅ 联合类型用于限制选项
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

#### 避免 any 类型

```typescript
// ❌ 避免使用 any
interface BadProps {
  data: any;
  config: any;
}

// ✅ 使用具体类型或泛型
interface GoodProps<T = unknown> {
  data: T;
  config: {
    showHeader: boolean;
    itemsPerPage: number;
    sortBy?: keyof T;
  };
}

// ✅ 使用 unknown 代替 any
function processData(data: unknown): ProcessedData {
  if (typeof data === 'object' && data !== null) {
    // 类型守卫
    return processObject(data);
  }
  throw new Error('Invalid data type');
}
```

## 组件设计原则

### 1. 单一职责原则

每个组件应该只负责一个功能：

```typescript
// ✅ 单一职责 - 只负责显示用户头像
const UserAvatar: React.FC<UserAvatarProps> = ({ 
  src, 
  alt, 
  size = 'md',
  fallback 
}) => {
  return (
    <div className={`avatar avatar-${size}`}>
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        <div className="avatar-fallback">{fallback}</div>
      )}
    </div>
  );
};

// ✅ 单一职责 - 只负责用户信息显示
const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  return (
    <div className="user-info">
      <UserAvatar 
        src={user.avatar} 
        alt={user.name}
        fallback={user.name[0]}
      />
      <div className="user-details">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    </div>
  );
};
```

### 2. 组合优于继承

```typescript
// ✅ 使用组合模式
const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('card', className)} {...props}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn('card-header', className)}>
      {children}
    </div>
  );
};

const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={cn('card-content', className)}>
      {children}
    </div>
  );
};

// 使用组合
const BlogPostCard = ({ post }: { post: BlogPost }) => {
  return (
    <Card>
      <CardHeader>
        <h2>{post.title}</h2>
        <UserInfo user={post.author} />
      </CardHeader>
      <CardContent>
        <p>{post.excerpt}</p>
        <TagList tags={post.tags} />
      </CardContent>
    </Card>
  );
};
```

### 3. Props 设计原则

```typescript
// ✅ 提供合理的默认值
interface ButtonProps {
  variant?: 'primary' | 'secondary'; // 默认 primary
  size?: 'sm' | 'md' | 'lg'; // 默认 md
  disabled?: boolean; // 默认 false
  loading?: boolean; // 默认 false
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  ...props
}) => {
  // 组件实现
};

// ✅ 使用 render props 模式提高灵活性
interface DataListProps<T> {
  data: T[];
  loading?: boolean;
  error?: Error;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  renderError?: (error: Error) => React.ReactNode;
  renderLoading?: () => React.ReactNode;
}

const DataList = <T,>({
  data,
  loading,
  error,
  renderItem,
  renderEmpty = () => <div>暂无数据</div>,
  renderError = (err) => <div>错误: {err.message}</div>,
  renderLoading = () => <div>加载中...</div>
}: DataListProps<T>) => {
  if (loading) return renderLoading();
  if (error) return renderError(error);
  if (data.length === 0) return renderEmpty();
  
  return (
    <div className="data-list">
      {data.map((item, index) => (
        <div key={index} className="data-list-item">
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};
```

## 性能优化指南

### 1. 组件懒加载

```typescript
// ✅ 使用 React.lazy 进行组件懒加载
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// ✅ 在主题中配置懒加载
const theme: ModernTheme = {
  // ...
  components: {
    blocks: {
      // 懒加载大型组件
      DataVisualization: () => import('./components/blocks/DataVisualization'),
      ImageGallery: () => import('./components/blocks/ImageGallery'),
      
      // 立即加载小型组件
      Button: Button,
      Text: Text,
    }
  }
};

// ✅ 使用 Suspense 包装懒加载组件
const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
};
```

### 2. 记忆化优化

```typescript
// ✅ 使用 React.memo 优化组件重渲染
const ExpensiveComponent = React.memo<ExpensiveComponentProps>(({ 
  data, 
  onUpdate 
}) => {
  // 复杂的渲染逻辑
  return <div>{/* ... */}</div>;
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return (
    prevProps.data.id === nextProps.data.id &&
    prevProps.data.updatedAt === nextProps.data.updatedAt
  );
});

// ✅ 使用 useMemo 缓存计算结果
const DataProcessor: React.FC<DataProcessorProps> = ({ rawData }) => {
  const processedData = useMemo(() => {
    return rawData
      .filter(item => item.isActive)
      .sort((a, b) => b.priority - a.priority)
      .map(item => ({
        ...item,
        displayName: formatDisplayName(item.name)
      }));
  }, [rawData]);
  
  return <DataList data={processedData} />;
};

// ✅ 使用 useCallback 缓存函数
const ParentComponent: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  
  const handleItemUpdate = useCallback((id: string, updates: Partial<Item>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);
  
  return (
    <div>
      {items.map(item => (
        <ItemComponent 
          key={item.id}
          item={item}
          onUpdate={handleItemUpdate}
        />
      ))}
    </div>
  );
};
```

### 3. 图片优化

```typescript
// ✅ 响应式图片组件
interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  loading = 'lazy',
  placeholder
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  return (
    <div className="responsive-image-container">
      {!isLoaded && placeholder && (
        <div className="image-placeholder">
          <img src={placeholder} alt="" aria-hidden="true" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
      {error && (
        <div className="image-error">
          图片加载失败
        </div>
      )}
    </div>
  );
};
```

## 样式管理策略

### 1. CSS-in-JS 最佳实践

```typescript
// ✅ 使用设计令牌
const buttonStyles = {
  base: {
    padding: tokens.spacing.md,
    borderRadius: tokens.borders.radius.md,
    fontSize: tokens.typography.fontSize.base,
    fontWeight: tokens.typography.fontWeight.medium,
    transition: tokens.animations.transition.fast,
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
  },
  variants: {
    primary: {
      backgroundColor: tokens.colors.primary[500],
      color: tokens.colors.white,
      '&:hover': {
        backgroundColor: tokens.colors.primary[600],
      },
      '&:focus': {
        boxShadow: `0 0 0 2px ${tokens.colors.primary[200]}`,
      },
    },
    secondary: {
      backgroundColor: tokens.colors.gray[100],
      color: tokens.colors.gray[900],
      '&:hover': {
        backgroundColor: tokens.colors.gray[200],
      },
    },
  },
};

// ✅ 响应式样式
const responsiveGrid = {
  display: 'grid',
  gap: tokens.spacing.md,
  gridTemplateColumns: '1fr',
  
  [`@media (min-width: ${tokens.breakpoints.md})`]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  
  [`@media (min-width: ${tokens.breakpoints.lg})`]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
};
```

### 2. CSS 模块化

```css
/* ✅ 组件样式模块 - Button.module.css */
.button {
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-fast);
  cursor: pointer;
  border: none;
  outline: none;
}

.button--primary {
  background-color: var(--color-primary-500);
  color: var(--color-white);
}

.button--primary:hover {
  background-color: var(--color-primary-600);
}

.button--primary:focus {
  box-shadow: 0 0 0 2px var(--color-primary-200);
}

.button--secondary {
  background-color: var(--color-gray-100);
  color: var(--color-gray-900);
}

.button--secondary:hover {
  background-color: var(--color-gray-200);
}

/* ✅ 响应式样式 */
.grid {
  display: grid;
  gap: var(--spacing-md);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 3. 主题切换优化

```typescript
// ✅ 高效的主题切换
const useThemeMode = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = useCallback(() => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    
    // 使用 CSS 变量快速切换
    document.documentElement.setAttribute('data-theme', newMode);
    
    // 保存用户偏好
    localStorage.setItem('theme-mode', newMode);
  }, [mode]);
  
  useEffect(() => {
    // 恢复用户偏好
    const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark';
    if (savedMode) {
      setMode(savedMode);
      document.documentElement.setAttribute('data-theme', savedMode);
    }
  }, []);
  
  return { mode, toggleTheme };
};
```

## 配置设计规范

### 1. 配置结构设计

```typescript
// ✅ 层次化配置结构
interface ThemeConfig {
  // 基础站点信息
  site: {
    title: string;
    description: string;
    url: string;
    language: string;
    favicon?: string;
  };
  
  // 样式配置
  styles: {
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    fontFamily: string;
    customCSS?: string;
  };
  
  // 布局配置
  layout: {
    header: {
      show: boolean;
      sticky: boolean;
      height?: number;
    };
    footer: {
      show: boolean;
      content?: string;
    };
    sidebar: {
      show: boolean;
      position: 'left' | 'right';
      width?: number;
    };
  };
  
  // 功能配置
  features: {
    search: boolean;
    comments: boolean;
    analytics: boolean;
    darkMode: boolean;
  };
  
  // 自定义配置
  custom: Record<string, unknown>;
}
```

### 2. 配置验证

```typescript
// ✅ 使用 JSON Schema 验证配置
const configSchema: JSONSchema = {
  type: 'object',
  properties: {
    site: {
      type: 'object',
      properties: {
        title: { type: 'string', minLength: 1, maxLength: 100 },
        description: { type: 'string', maxLength: 500 },
        url: { type: 'string', format: 'uri' },
        language: { type: 'string', pattern: '^[a-z]{2}(-[A-Z]{2})?$' },
      },
      required: ['title', 'description', 'url', 'language'],
    },
    styles: {
      type: 'object',
      properties: {
        theme: { enum: ['light', 'dark', 'auto'] },
        primaryColor: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
        fontFamily: { type: 'string' },
      },
      required: ['theme', 'primaryColor'],
    },
  },
  required: ['site', 'styles'],
};

// ✅ 配置验证函数
const validateConfig = (config: unknown): ValidationResult => {
  const ajv = new Ajv();
  const validate = ajv.compile(configSchema);
  const isValid = validate(config);
  
  return {
    isValid,
    errors: validate.errors || [],
    warnings: [],
  };
};
```

### 3. 配置迁移

```typescript
// ✅ 配置版本迁移
interface ConfigMigration {
  from: string;
  to: string;
  migrate: (oldConfig: any) => any;
}

const migrations: ConfigMigration[] = [
  {
    from: '1.0.0',
    to: '1.1.0',
    migrate: (config) => ({
      ...config,
      features: {
        ...config.features,
        darkMode: true, // 新增暗色模式功能
      },
    }),
  },
  {
    from: '1.1.0',
    to: '2.0.0',
    migrate: (config) => ({
      site: config.site,
      styles: {
        theme: config.theme || 'light',
        primaryColor: config.primaryColor || '#3b82f6',
        fontFamily: config.fontFamily || 'Inter',
      },
      layout: config.layout,
      features: config.features,
      custom: config.custom || {},
    }),
  },
];

const migrateConfig = (config: any, fromVersion: string, toVersion: string) => {
  let currentConfig = config;
  let currentVersion = fromVersion;
  
  while (currentVersion !== toVersion) {
    const migration = migrations.find(m => m.from === currentVersion);
    if (!migration) {
      throw new Error(`无法从版本 ${currentVersion} 迁移到 ${toVersion}`);
    }
    
    currentConfig = migration.migrate(currentConfig);
    currentVersion = migration.to;
  }
  
  return currentConfig;
};
```

## 测试策略

### 1. 组件单元测试

```typescript
// ✅ 组件测试示例
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('应该渲染按钮文本', () => {
    render(<Button>点击我</Button>);
    expect(screen.getByRole('button', { name: '点击我' })).toBeInTheDocument();
  });
  
  it('应该处理点击事件', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>点击我</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('禁用状态下不应该触发点击事件', () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        点击我
      </Button>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
  
  it('应该应用正确的样式类', () => {
    render(<Button variant="primary" size="lg">按钮</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('button', 'button--primary', 'button--lg');
  });
});
```

### 2. 主题集成测试

```typescript
// ✅ 主题集成测试
import { render } from '@testing-library/react';
import { ThemeProvider } from '../ThemeProvider';
import { testTheme } from '../__mocks__/testTheme';

describe('ThemeProvider', () => {
  it('应该正确加载主题', async () => {
    const { container } = render(
      <ThemeProvider theme={testTheme}>
        <div data-testid="content">内容</div>
      </ThemeProvider>
    );
    
    // 检查主题样式是否应用
    expect(container.firstChild).toHaveStyle({
      '--color-primary': testTheme.styles.tokens.colors.primary[500],
    });
  });
  
  it('应该处理主题切换', async () => {
    const { rerender } = render(
      <ThemeProvider theme={testTheme}>
        <div data-testid="content">内容</div>
      </ThemeProvider>
    );
    
    // 切换到另一个主题
    const newTheme = { ...testTheme, metadata: { ...testTheme.metadata, name: 'new-theme' } };
    rerender(
      <ThemeProvider theme={newTheme}>
        <div data-testid="content">内容</div>
      </ThemeProvider>
    );
    
    // 验证主题已切换
    // ...
  });
});
```

### 3. 性能测试

```typescript
// ✅ 性能测试示例
import { render } from '@testing-library/react';
import { performance } from 'perf_hooks';

describe('性能测试', () => {
  it('大量组件渲染性能', () => {
    const startTime = performance.now();
    
    render(
      <div>
        {Array.from({ length: 1000 }, (_, i) => (
          <Button key={i}>按钮 {i}</Button>
        ))}
      </div>
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // 渲染时间应该小于 100ms
    expect(renderTime).toBeLessThan(100);
  });
  
  it('主题切换性能', async () => {
    const { rerender } = render(
      <ThemeProvider theme={lightTheme}>
        <ComplexComponent />
      </ThemeProvider>
    );
    
    const startTime = performance.now();
    
    rerender(
      <ThemeProvider theme={darkTheme}>
        <ComplexComponent />
      </ThemeProvider>
    );
    
    const endTime = performance.now();
    const switchTime = endTime - startTime;
    
    // 主题切换时间应该小于 50ms
    expect(switchTime).toBeLessThan(50);
  });
});
```

## 文档编写规范

### 1. 组件文档

```typescript
/**
 * Button 组件 - 用于触发操作的可点击元素
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <Button onClick={() => console.log('clicked')}>点击我</Button>
 * 
 * // 不同变体
 * <Button variant="primary">主要按钮</Button>
 * <Button variant="secondary">次要按钮</Button>
 * 
 * // 不同尺寸
 * <Button size="sm">小按钮</Button>
 * <Button size="lg">大按钮</Button>
 * 
 * // 禁用状态
 * <Button disabled>禁用按钮</Button>
 * 
 * // 加载状态
 * <Button loading>加载中...</Button>
 * ```
 */
interface ButtonProps {
  /**
   * 按钮变体
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  
  /**
   * 按钮尺寸
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  
  /**
   * 是否显示加载状态
   * @default false
   */
  loading?: boolean;
  
  /**
   * 按钮内容
   */
  children: React.ReactNode;
  
  /**
   * 点击事件处理函数
   */
  onClick?: () => void;
}
```

### 2. README 文档结构

```markdown
# 主题名称

简短的主题描述。

## 特性

- ✨ 现代化设计
- 🎨 可定制样式
- 📱 响应式布局
- ♿ 无障碍支持
- 🚀 高性能

## 安装

```bash
npm install @your-org/theme-name
```

## 快速开始

```tsx
import { ThemeProvider } from '@siteframe/core';
import myTheme from '@your-org/theme-name';

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

## 配置

### 基础配置

```typescript
const config = {
  site: {
    title: '我的网站',
    description: '网站描述',
  },
  styles: {
    theme: 'light',
    primaryColor: '#3b82f6',
  },
};
```

## 组件

### 布局组件

- `DefaultLayout` - 默认页面布局
- `PostLayout` - 文章页面布局

### 区块组件

- `Header` - 页面头部
- `Footer` - 页面底部
- `Navigation` - 导航菜单

## 自定义

### 样式自定义

```css
:root {
  --color-primary: #your-color;
  --font-family: 'Your Font';
}
```

### 组件自定义

```tsx
const customTheme = {
  ...baseTheme,
  components: {
    ...baseTheme.components,
    blocks: {
      ...baseTheme.components.blocks,
      Header: YourCustomHeader,
    },
  },
};
```

## 许可证

MIT
```

## 版本管理

### 1. 语义化版本

遵循 [Semantic Versioning](https://semver.org/) 规范：

- **MAJOR** (主版本号): 不兼容的 API 修改
- **MINOR** (次版本号): 向后兼容的功能性新增
- **PATCH** (修订号): 向后兼容的问题修正

```json
{
  "name": "@your-org/theme-name",
  "version": "1.2.3",
  "description": "主题描述",
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}
```

### 2. 变更日志

```markdown
# 变更日志

## [1.2.3] - 2024-01-15

### 修复
- 修复暗色模式下的文字对比度问题
- 解决移动端导航菜单显示异常

### 优化
- 提升组件加载性能
- 减少包体积 15%

## [1.2.0] - 2024-01-01

### 新增
- 新增博客文章卡片组件
- 支持自定义字体配置
- 添加无障碍支持

### 变更
- 更新设计令牌结构
- 重构样式系统

## [1.1.0] - 2023-12-15

### 新增
- 暗色模式支持
- 响应式图片组件

### 修复
- 修复 Safari 浏览器兼容性问题
```

## 安全考虑

### 1. XSS 防护

```typescript
// ✅ 安全的内容渲染
const SafeContent: React.FC<{ content: string }> = ({ content }) => {
  // 使用 DOMPurify 清理 HTML
  const cleanContent = DOMPurify.sanitize(content);
  
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: cleanContent }}
    />
  );
};

// ✅ 安全的用户输入处理
const UserInput: React.FC<{ value: string; onChange: (value: string) => void }> = ({
  value,
  onChange
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 过滤危险字符
    const sanitizedValue = e.target.value.replace(/<script[^>]*>.*?<\/script>/gi, '');
    onChange(sanitizedValue);
  };
  
  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      maxLength={1000} // 限制输入长度
    />
  );
};
```

### 2. 配置验证

```typescript
// ✅ 严格的配置验证
const validateUserConfig = (config: unknown): ThemeConfig => {
  // 类型检查
  if (typeof config !== 'object' || config === null) {
    throw new Error('配置必须是对象');
  }
  
  // 深度验证
  const result = configSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`配置验证失败: ${result.error.message}`);
  }
  
  return result.data;
};

// ✅ 防止原型污染
const safeAssign = (target: any, source: any) => {
  for (const key in source) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue; // 跳过危险属性
    }
    if (source.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
  return target;
};
```

### 3. 依赖安全

```json
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "security:check": "npm audit --audit-level moderate"
  },
  "devDependencies": {
    "@types/dompurify": "^3.0.0",
    "dompurify": "^3.0.0"
  }
}
```

## 常见问题解决

### 1. 性能问题

**问题**: 组件加载缓慢

**解决方案**:
```typescript
// 使用代码分割
const HeavyComponent = React.lazy(() => 
  import('./HeavyComponent').then(module => ({
    default: module.HeavyComponent
  }))
);

// 预加载关键组件
const preloadComponents = async () => {
  await Promise.all([
    import('./Header'),
    import('./Footer'),
    import('./Navigation'),
  ]);
};
```

**问题**: 主题切换卡顿

**解决方案**:
```css
/* 使用 CSS 变量实现平滑切换 */
:root {
  --transition-theme: color 0.2s ease, background-color 0.2s ease;
}

* {
  transition: var(--transition-theme);
}

/* 避免过度动画 */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
```

### 2. 兼容性问题

**问题**: 旧浏览器不支持 CSS 变量

**解决方案**:
```typescript
// 检测 CSS 变量支持
const supportsCSSVariables = () => {
  return window.CSS && CSS.supports('color', 'var(--test)');
};

// 降级方案
const applyTheme = (theme: 'light' | 'dark') => {
  if (supportsCSSVariables()) {
    document.documentElement.setAttribute('data-theme', theme);
  } else {
    // 使用类名降级
    document.documentElement.className = `theme-${theme}`;
  }
};
```

### 3. 类型错误

**问题**: TypeScript 类型错误

**解决方案**:
```typescript
// 提供完整的类型定义
declare module '@siteframe/core' {
  interface ThemeConfig {
    // 扩展配置类型
    customField?: string;
  }
}

// 使用类型断言（谨慎使用）
const config = userConfig as ThemeConfig;

// 更好的方式：类型守卫
const isValidConfig = (config: unknown): config is ThemeConfig => {
  return typeof config === 'object' && config !== null && 'site' in config;
};
```

---

遵循这些最佳实践将帮助您创建高质量、可维护、高性能的主题。记住，好的代码不仅要能工作，还要易于理解、测试和维护。