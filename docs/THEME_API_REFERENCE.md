# 主题系统 API 参考文档

## 目录

1. [核心接口](#核心接口)
2. [主题引擎 API](#主题引擎-api)
3. [组件加载器 API](#组件加载器-api)
4. [主题提供者 API](#主题提供者-api)
5. [钩子函数 API](#钩子函数-api)
6. [工具函数 API](#工具函数-api)
7. [类型定义](#类型定义)
8. [事件系统](#事件系统)

## 核心接口

### ModernTheme

主题定义的核心接口。

```typescript
interface ModernTheme {
  metadata: ThemeMetadata;
  components: ThemeComponents;
  componentMeta: ComponentMetaCollection;
  styles: ThemeStyles;
  hooks?: ThemeHooks;
  configSchema: JSONSchema;
  defaultConfig: ThemeConfig;
  templates?: PageTemplates;
  features?: ThemeFeatures;
}
```

#### 属性说明

- `metadata` - 主题元数据信息
- `components` - 主题组件集合
- `componentMeta` - 组件元数据集合
- `styles` - 主题样式定义
- `hooks` - 主题生命周期钩子
- `configSchema` - 配置验证模式
- `defaultConfig` - 默认配置
- `templates` - 页面模板定义
- `features` - 主题功能特性

### ThemeMetadata

主题元数据接口。

```typescript
interface ThemeMetadata {
  name: string;
  version: string;
  author: string;
  description: string;
  homepage?: string;
  repository?: string;
  license: string;
  tags: string[];
  screenshot?: string;
  compatibility: {
    minVersion: string;
    maxVersion?: string;
  };
}
```

### ThemeComponents

主题组件集合接口。

```typescript
interface ThemeComponents {
  layouts: Record<string, ComponentDefinition>;
  blocks: Record<string, ComponentDefinition>;
  widgets: Record<string, ComponentDefinition>;
}
```

### ComponentDefinition

组件定义类型。

```typescript
type ComponentDefinition = 
  | React.ComponentType<any>
  | (() => Promise<{ default: React.ComponentType<any> }>)
  | (() => Promise<React.ComponentType<any>>);
```

## 主题引擎 API

### ModernThemeEngine

主题引擎核心类。

```typescript
class ModernThemeEngine {
  // 主题管理
  loadTheme(theme: ModernTheme): Promise<void>;
  unloadTheme(themeName: string): Promise<void>;
  setActiveTheme(themeName: string): Promise<void>;
  getActiveTheme(): ModernTheme | null;
  getLoadedThemes(): ModernTheme[];
  
  // 主题验证
  validateTheme(theme: ModernTheme): ValidationResult;
  
  // 组件管理
  registerComponent(name: string, component: ComponentDefinition): void;
  unregisterComponent(name: string): void;
  getComponent(name: string): ComponentDefinition | null;
  getRegisteredComponents(): string[];
  
  // 配置管理
  updateConfig(config: Partial<ThemeConfig>): Promise<void>;
  getConfig(): ThemeConfig;
  resetConfig(): void;
  
  // 样式管理
  applyThemeStyles(theme: ModernTheme): void;
  removeThemeStyles(themeName: string): void;
  setThemeMode(mode: 'light' | 'dark' | 'auto'): void;
  
  // 钩子系统
  executeHook(hookName: string, context: HookContext, ...args: any[]): Promise<void>;
  registerHook(hookName: string, handler: HookHandler): void;
  unregisterHook(hookName: string, handler: HookHandler): void;
  
  // 事件系统
  on(event: string, listener: EventListener): void;
  off(event: string, listener: EventListener): void;
  emit(event: string, ...args: any[]): void;
  
  // 调试和工具
  setDebugMode(enabled: boolean): void;
  getDebugInfo(): DebugInfo;
}
```

#### 使用示例

```typescript
import { themeEngine } from './lib/services/modern-theme-engine';
import myTheme from './themes/my-theme';

// 加载主题
await themeEngine.loadTheme(myTheme);

// 设置为活动主题
await themeEngine.setActiveTheme('my-theme');

// 更新配置
await themeEngine.updateConfig({
  styles: {
    theme: 'dark',
    primaryColor: '#3b82f6'
  }
});

// 监听主题变更事件
themeEngine.on('theme:changed', (theme) => {
  console.log('主题已切换:', theme.metadata.name);
});
```

## 组件加载器 API

### DynamicComponentLoader

动态组件加载器类。

```typescript
class DynamicComponentLoader {
  // 组件加载
  loadComponent(name: string, type?: ComponentType): Promise<React.ComponentType>;
  preloadComponent(name: string, type?: ComponentType): Promise<void>;
  preloadComponents(names: string[]): Promise<void>;
  
  // 缓存管理
  clearCache(): void;
  clearComponentCache(name: string): void;
  getCacheStats(): CacheStats;
  setCacheSize(size: number): void;
  
  // React 集成
  createLazyComponent(name: string, type?: ComponentType): React.LazyExoticComponent<React.ComponentType>;
  createSuspenseComponent(name: string, fallback?: React.ReactNode): React.ComponentType;
  
  // 错误处理
  setErrorBoundary(ErrorComponent: React.ComponentType<ErrorBoundaryProps>): void;
  getLoadErrors(): LoadError[];
  clearLoadErrors(): void;
}
```

#### CacheStats 接口

```typescript
interface CacheStats {
  totalComponents: number;
  loadedComponents: number;
  cacheHitRate: number;
  memoryUsage: number;
  oldestComponent?: {
    name: string;
    loadTime: number;
  };
  newestComponent?: {
    name: string;
    loadTime: number;
  };
}
```

#### 使用示例

```typescript
import { componentLoader } from './lib/services/dynamic-component-loader';

// 加载组件
const Header = await componentLoader.loadComponent('Header', 'block');

// 预加载组件
await componentLoader.preloadComponent('Footer');

// 创建懒加载组件
const LazyHeader = componentLoader.createLazyComponent('Header');

// 获取缓存统计
const stats = componentLoader.getCacheStats();
console.log('缓存命中率:', stats.cacheHitRate);
```

## 主题提供者 API

### ThemeProvider

React 主题提供者组件。

```typescript
interface ThemeProviderProps {
  theme?: ModernTheme;
  config?: Partial<ThemeConfig>;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorBoundary?: React.ComponentType<ErrorBoundaryProps>;
}

const ThemeProvider: React.FC<ThemeProviderProps>;
```

### ThemeContext

主题上下文接口。

```typescript
interface ThemeContextValue {
  theme: ModernTheme | null;
  config: ThemeConfig;
  isLoading: boolean;
  error: Error | null;
  
  // 主题操作
  setThemeMode: (mode: 'light' | 'dark' | 'auto') => void;
  switchTheme: (themeName: string) => Promise<void>;
  
  // 配置操作
  updateConfig: (config: Partial<ThemeConfig>) => Promise<void>;
  resetConfig: () => void;
  
  // 组件操作
  getComponent: (name: string, type?: ComponentType) => React.ComponentType | null;
  preloadComponent: (name: string, type?: ComponentType) => Promise<void>;
}
```

#### 使用示例

```typescript
import { ThemeProvider } from './lib/components/theme-provider';
import myTheme from './themes/my-theme';

function App() {
  return (
    <ThemeProvider 
      theme={myTheme}
      config={{ styles: { theme: 'auto' } }}
      fallback={<div>加载中...</div>}
    >
      <AppContent />
    </ThemeProvider>
  );
}
```

## 钩子函数 API

### useTheme

获取主题信息和操作方法。

```typescript
function useTheme(): {
  theme: ModernTheme | null;
  config: ThemeConfig;
  isLoading: boolean;
  error: Error | null;
  setThemeMode: (mode: 'light' | 'dark' | 'auto') => void;
  switchTheme: (themeName: string) => Promise<void>;
  updateConfig: (config: Partial<ThemeConfig>) => Promise<void>;
  resetConfig: () => void;
}
```

### useThemeComponent

获取主题组件。

```typescript
function useThemeComponent(
  name: string, 
  type?: ComponentType
): React.ComponentType | null;
```

### useThemeConfig

获取和更新主题配置。

```typescript
function useThemeConfig(): {
  config: ThemeConfig;
  updateConfig: (config: Partial<ThemeConfig>) => Promise<void>;
  resetConfig: () => void;
  isValidConfig: (config: any) => boolean;
}
```

### useThemeStyles

获取主题样式信息。

```typescript
function useThemeStyles(): {
  tokens: DesignTokens;
  currentTheme: 'light' | 'dark';
  cssVariables: Record<string, string>;
  applyStyles: (styles: Record<string, string>) => void;
}
```

### useComponentLoader

获取组件加载器功能。

```typescript
function useComponentLoader(): {
  loadComponent: (name: string, type?: ComponentType) => Promise<React.ComponentType>;
  preloadComponent: (name: string, type?: ComponentType) => Promise<void>;
  isLoading: (name: string) => boolean;
  getError: (name: string) => Error | null;
  clearCache: () => void;
}
```

#### 使用示例

```typescript
import { 
  useTheme, 
  useThemeComponent, 
  useThemeConfig 
} from './lib/components/theme-provider';

function MyComponent() {
  const { theme, setThemeMode } = useTheme();
  const { config, updateConfig } = useThemeConfig();
  const Header = useThemeComponent('Header');
  
  const handleThemeToggle = () => {
    const newMode = config.styles.theme === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };
  
  return (
    <div>
      <Header showNavigation={true} />
      <button onClick={handleThemeToggle}>
        切换主题
      </button>
    </div>
  );
}
```

## 工具函数 API

### ThemeGenerator

主题生成器类。

```typescript
class ThemeGenerator {
  constructor(themeName: string, template: string);
  
  // 生成方法
  generate(outputPath: string): Promise<void>;
  generatePackageJson(): string;
  generateThemeIndex(): string;
  generateComponent(componentName: string, type: ComponentType): string;
  generateDesignTokens(): string;
  generateStyles(): string;
  generateConfig(): string;
  generateDocumentation(): string;
  generateExamples(): string;
  
  // 配置方法
  setTemplate(template: ThemeTemplate): void;
  addComponent(name: string, type: ComponentType): void;
  removeComponent(name: string): void;
  setMetadata(metadata: Partial<ThemeMetadata>): void;
}
```

### ThemeValidator

主题验证器类。

```typescript
class ThemeValidator {
  // 验证方法
  validateTheme(theme: ModernTheme): ValidationResult;
  validateConfig(config: ThemeConfig, schema: JSONSchema): ValidationResult;
  validateComponent(component: ComponentDefinition, meta: ComponentMeta): ValidationResult;
  
  // 检查方法
  checkDependencies(theme: ModernTheme): DependencyCheckResult;
  checkCompatibility(theme: ModernTheme, version: string): CompatibilityResult;
  checkPerformance(theme: ModernTheme): PerformanceResult;
}
```

### ThemeBuilder

主题构建器类。

```typescript
class ThemeBuilder {
  // 构建方法
  build(themePath: string, options?: BuildOptions): Promise<BuildResult>;
  watch(themePath: string, options?: WatchOptions): Promise<void>;
  
  // 优化方法
  optimizeAssets(assets: Asset[]): Promise<Asset[]>;
  minifyCSS(css: string): string;
  optimizeImages(images: string[]): Promise<void>;
  
  // 分析方法
  analyzeBundle(bundlePath: string): BundleAnalysis;
  generateReport(buildResult: BuildResult): string;
}
```

#### 使用示例

```typescript
import { ThemeGenerator, ThemeValidator, ThemeBuilder } from './lib/tools';

// 生成新主题
const generator = new ThemeGenerator('my-theme', 'modern');
await generator.generate('./themes/my-theme');

// 验证主题
const validator = new ThemeValidator();
const result = validator.validateTheme(myTheme);
if (!result.isValid) {
  console.error('主题验证失败:', result.errors);
}

// 构建主题
const builder = new ThemeBuilder();
const buildResult = await builder.build('./themes/my-theme', {
  minify: true,
  optimize: true
});
```

## 类型定义

### 基础类型

```typescript
type ComponentType = 'layout' | 'block' | 'widget';
type ThemeMode = 'light' | 'dark' | 'auto';
type HookName = 'theme:init' | 'theme:beforeRender' | 'theme:afterRender' | 'config:change';
```

### 配置类型

```typescript
interface ThemeConfig {
  site: SiteConfig;
  styles: StylesConfig;
  layout: LayoutConfig;
  navigation: NavigationConfig;
  footer: FooterConfig;
  blog: BlogConfig;
  seo: SEOConfig;
  performance: PerformanceConfig;
  features: FeaturesConfig;
  custom: Record<string, any>;
}

interface StylesConfig {
  theme: ThemeMode;
  primaryColor: string;
  fontFamily: string;
  fontSize: string;
  borderRadius: string;
  animations: boolean;
}
```

### 组件类型

```typescript
interface ComponentMeta {
  name: string;
  displayName: string;
  description: string;
  category: ComponentType;
  icon: string;
  props: Record<string, PropDefinition>;
  preview: PreviewConfig;
}

interface PropDefinition {
  type: string;
  required: boolean;
  default?: any;
  description: string;
  enum?: any[];
}
```

### 样式类型

```typescript
interface ThemeStyles {
  tokens: DesignTokens;
  themes: Record<string, ThemeVariables>;
  globalCSS: string;
}

interface DesignTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  borders: BorderTokens;
  shadows: ShadowTokens;
  animations: AnimationTokens;
  breakpoints: BreakpointTokens;
  zIndex: ZIndexTokens;
}
```

### 验证类型

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  path: string;
  message: string;
  code: string;
  severity: 'error' | 'warning';
}
```

## 事件系统

### 事件类型

```typescript
type ThemeEvent = 
  | 'theme:loading'
  | 'theme:loaded'
  | 'theme:error'
  | 'theme:changed'
  | 'config:updated'
  | 'component:loaded'
  | 'component:error';
```

### 事件监听

```typescript
// 监听主题加载事件
themeEngine.on('theme:loaded', (theme: ModernTheme) => {
  console.log('主题已加载:', theme.metadata.name);
});

// 监听配置更新事件
themeEngine.on('config:updated', (config: ThemeConfig) => {
  console.log('配置已更新:', config);
});

// 监听组件加载错误
themeEngine.on('component:error', (error: Error, componentName: string) => {
  console.error('组件加载失败:', componentName, error);
});
```

### 自定义事件

```typescript
// 触发自定义事件
themeEngine.emit('custom:event', { data: 'example' });

// 监听自定义事件
themeEngine.on('custom:event', (data) => {
  console.log('收到自定义事件:', data);
});
```

---

## 版本兼容性

| API 版本 | 支持的主题版本 | 说明 |
|---------|---------------|------|
| 1.0.x   | 1.0.x         | 初始版本 |
| 1.1.x   | 1.0.x - 1.1.x | 向后兼容 |
| 2.0.x   | 2.0.x         | 重大更新，不向后兼容 |

## 迁移指南

### 从 v1.0 到 v1.1

- 新增 `useThemeStyles` 钩子
- 增强 `ThemeValidator` 功能
- 优化组件加载性能

### 从 v1.1 到 v2.0

- 重构主题配置结构
- 更新组件定义格式
- 改进钩子系统 API

---

*本文档随 API 更新而持续维护，请关注版本变更说明。*