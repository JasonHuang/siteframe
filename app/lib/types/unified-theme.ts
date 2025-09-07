/**
 * 统一主题系统类型定义
 * 兼容传统主题系统和现代主题系统
 */

import { JSONSchema7 } from 'json-schema';
import { EventEmitter } from 'events';

// ============================================================================
// 基础类型定义
// ============================================================================

/**
 * 统一的主题基本信息
 * 兼容传统 Theme 和现代 ModernTheme
 */
export interface UnifiedTheme {
  // 基础标识信息
  id: string;
  name: string;
  display_name: string;
  description?: string;
  version: string;
  author: string;
  
  // 元数据
  metadata?: {
    homepage?: string;
    repository?: string;
    license?: string;
    tags?: string[];
    screenshot?: string;
    compatibility?: {
      minVersion: string;
      maxVersion?: string;
    };
  };
  
  // 预览和状态
  preview_image?: string;
  is_active: boolean;
  is_system?: boolean;
  
  // 时间戳
  created_at: string;
  updated_at: string;
  
  // 配置
  config: UnifiedThemeConfig;
  
  // 现代主题系统扩展
  modern?: {
    components?: {
      layouts: Record<string, React.ComponentType<any>>;
      blocks: Record<string, React.ComponentType<any>>;
      widgets: Record<string, React.ComponentType<any>>;
    };
    componentMeta?: {
      layouts: Record<string, ComponentMeta>;
      blocks: Record<string, ComponentMeta>;
      widgets: Record<string, ComponentMeta>;
    };
    hooks?: ThemeHooks;
    templates?: Record<string, PageTemplate>;
    features?: {
      customizer?: boolean;
      darkMode?: boolean;
      rtl?: boolean;
      multiLanguage?: boolean;
    };
  };
}

/**
 * 统一的主题配置
 * 合并传统 ThemeConfig 和现代 ThemeConfig
 */
export interface UnifiedThemeConfig {
  // 站点基础配置（现代系统）
  site?: {
    title: string;
    description: string;
    logo?: string;
    favicon?: string;
  };
  
  // 颜色配置（兼容两套系统）
  colors?: {
    // 传统系统的简单颜色配置
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    text?: {
      primary?: string;
      secondary?: string;
      disabled?: string;
    };
    border?: string;
    error?: string;
    warning?: string;
    success?: string;
    info?: string;
    
    // 现代系统的色阶配置
    scales?: {
      primary: ColorScale;
      secondary: ColorScale;
      accent: ColorScale;
      neutral: ColorScale;
      semantic: {
        success: ColorScale;
        warning: ColorScale;
        error: ColorScale;
        info: ColorScale;
      };
    };
  };
  
  // 字体配置（兼容两套系统）
  typography?: {
    fontFamily?: {
      sans?: string;
      serif?: string;
      mono?: string;
    };
    fontSize?: Record<string, string>;
    fontWeight?: Record<string, number>;
    lineHeight?: Record<string, number>;
  };
  
  // 间距配置
  spacing?: Record<string, string>;
  
  // 圆角配置
  borderRadius?: Record<string, string>;
  
  // 阴影配置
  shadows?: Record<string, string>;
  
  // 布局配置（现代系统）
  layout?: {
    maxWidth?: string;
    containerPadding?: string;
    headerHeight?: string;
    sidebarWidth?: string;
    
    // 现代系统的详细布局配置
    header?: {
      enabled: boolean;
      sticky: boolean;
      transparent: boolean;
    };
    footer?: {
      enabled: boolean;
      columns: number;
    };
    sidebar?: {
      enabled: boolean;
      position: 'left' | 'right';
      width: string;
    };
  };
  
  // 样式配置（现代系统）
  styles?: {
    theme: string; // light, dark, auto
    primaryColor: string;
    fontFamily: string;
    fontSize: string;
  };
  
  // 功能配置（现代系统）
  features?: {
    search: boolean;
    comments: boolean;
    newsletter: boolean;
    analytics: boolean;
  };
  
  // 响应式断点
  breakpoints?: Record<string, string>;
  
  // z-index 层级
  zIndex?: Record<string, number>;
  
  // 自定义配置
  custom?: Record<string, any>;
}

// ============================================================================
// 现代主题系统类型（从 modern-theme.ts 导入）
// ============================================================================

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string; // 主色调
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface ComponentConfig {
  type: 'layout' | 'block' | 'widget';
  name: string;
  props?: Record<string, any>;
  children?: ComponentConfig[];
  conditions?: {
    [key: string]: any;
  };
  style?: {
    className?: string;
    css?: Record<string, any>;
  };
}

export interface ComponentMeta {
  name: string;
  displayName: string;
  description?: string;
  category: string;
  icon?: string;
  props?: {
    [propName: string]: {
      type: string;
      description?: string;
      default?: any;
      required?: boolean;
      options?: any[];
    };
  };
  preview?: {
    props?: Record<string, any>;
    children?: ComponentConfig[];
  };
}

export interface PageTemplate {
  name: string;
  displayName: string;
  description?: string;
  layout: string;
  blocks: ComponentConfig[];
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string[];
    openGraph?: {
      title?: string;
      description?: string;
      image?: string;
    };
  };
  variables?: {
    [key: string]: {
      type: string;
      description?: string;
      default?: any;
    };
  };
}

export type HookHandler = (...args: any[]) => any;

export interface ThemeHooks {
  // 生命周期钩子
  'theme:init'?: HookHandler;
  'theme:loaded'?: HookHandler;
  'theme:unloaded'?: HookHandler;
  
  // 页面钩子
  'page:before-render'?: HookHandler;
  'page:after-render'?: HookHandler;
  'page:head'?: HookHandler;
  
  // 内容钩子
  'content:before'?: HookHandler;
  'content:after'?: HookHandler;
  'content:filter'?: HookHandler;
  
  // 自定义钩子
  [hookName: string]: HookHandler | undefined;
}

// ============================================================================
// 传统主题系统兼容类型
// ============================================================================

/**
 * 主题设置项（传统系统）
 */
export interface ThemeSetting {
  id: string;
  theme_id: string;
  setting_key: string;
  setting_value: any;
  setting_type: 'color' | 'font' | 'spacing' | 'layout' | 'custom';
  description?: string;
  created_at: string;
  updated_at: string;
}

/**
 * 主题状态
 */
export interface ThemeState {
  currentTheme: UnifiedTheme | null;
  availableThemes: UnifiedTheme[];
  isLoading: boolean;
  error: string | null;
}

/**
 * 主题操作结果
 */
export interface ThemeOperationResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * 主题预览
 */
export interface ThemePreview {
  theme: UnifiedTheme;
  config: UnifiedThemeConfig;
  previewUrl?: string;
}

/**
 * 主题导出
 */
export interface ThemeExport {
  theme: Omit<UnifiedTheme, 'id' | 'created_at' | 'updated_at'>;
  settings: Omit<ThemeSetting, 'id' | 'theme_id' | 'created_at' | 'updated_at'>[];
  version: string;
  exportedAt: string;
}

/**
 * 主题验证错误
 */
export interface ThemeValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * 主题权限
 */
export interface ThemePermissions {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canActivate: boolean;
  canExport: boolean;
  canImport: boolean;
}

// ============================================================================
// 输入类型
// ============================================================================

export interface CreateUnifiedThemeInput {
  name: string;
  display_name: string;
  description?: string;
  version?: string;
  author?: string;
  preview_image?: string;
  is_active?: boolean;
  is_system?: boolean;
  config?: Partial<UnifiedThemeConfig>;
  metadata?: {
    homepage?: string;
    repository?: string;
    license?: string;
    tags?: string[];
    screenshot?: string;
  };
}

export interface UpdateUnifiedThemeInput {
  display_name?: string;
  description?: string;
  is_active?: boolean;
  config?: Partial<UnifiedThemeConfig>;
  metadata?: Partial<{
    homepage?: string;
    repository?: string;
    license?: string;
    tags?: string[];
    screenshot?: string;
  }>;
}

// ============================================================================
// 主题源和加载（现代系统）
// ============================================================================

export type ThemeSource = 
  | { type: 'npm'; package: string; version?: string; }
  | { type: 'git'; repository: string; branch?: string; }
  | { type: 'local'; path: string; }
  | { type: 'url'; url: string; }
  | { type: 'marketplace'; id: string; };

export interface ThemeManifest {
  name: string;
  version: string;
  source: ThemeSource;
  installedAt: Date;
  updatedAt: Date;
  active: boolean;
  config: UnifiedThemeConfig;
}

// ============================================================================
// 主题引擎接口
// ============================================================================

export interface UnifiedThemeEngine {
  // 主题管理
  loadTheme(themeId: string): Promise<void>;
  unloadTheme(themeId: string): Promise<void>;
  activateTheme(themeId: string): Promise<void>;
  
  // 配置管理
  getConfig(): UnifiedThemeConfig;
  updateConfig(config: Partial<UnifiedThemeConfig>): Promise<void>;
  
  // 钩子系统
  addHook(hookName: string, handler: HookHandler): void;
  removeHook(hookName: string, handler: HookHandler): void;
  executeHook(hookName: string, ...args: any[]): any[];
  
  // 组件系统
  registerComponent(type: string, name: string, component: React.ComponentType<any>): void;
  getComponent(type: string, name: string): React.ComponentType<any> | undefined;
  
  // 事件系统
  on(event: string, listener: (...args: any[]) => void): void;
  off(event: string, listener: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
}

// ============================================================================
// 工具类型
// ============================================================================

/**
 * 将传统主题转换为统一主题
 */
export function convertLegacyTheme(legacyTheme: any): UnifiedTheme {
  return {
    id: legacyTheme.id,
    name: legacyTheme.name,
    display_name: legacyTheme.display_name,
    description: legacyTheme.description,
    version: legacyTheme.version || '1.0.0',
    author: legacyTheme.author || 'Unknown',
    preview_image: legacyTheme.preview_image,
    is_active: legacyTheme.is_active,
    is_system: legacyTheme.is_system,
    created_at: legacyTheme.created_at,
    updated_at: legacyTheme.updated_at,
    config: legacyTheme.config || {},
    metadata: {
      tags: [],
      compatibility: {
        minVersion: '1.0.0'
      }
    }
  };
}

/**
 * 将现代主题转换为统一主题
 */
export function convertModernTheme(modernTheme: any, manifest: ThemeManifest): UnifiedTheme {
  return {
    id: manifest.name,
    name: modernTheme.metadata.name,
    display_name: modernTheme.metadata.name,
    description: modernTheme.metadata.description,
    version: modernTheme.metadata.version,
    author: modernTheme.metadata.author,
    preview_image: modernTheme.metadata.screenshot,
    is_active: manifest.active,
    is_system: false,
    created_at: manifest.installedAt.toISOString(),
    updated_at: manifest.updatedAt.toISOString(),
    config: manifest.config,
    metadata: {
      homepage: modernTheme.metadata.homepage,
      repository: modernTheme.metadata.repository,
      license: modernTheme.metadata.license,
      tags: modernTheme.metadata.tags,
      screenshot: modernTheme.metadata.screenshot,
      compatibility: modernTheme.metadata.compatibility
    },
    modern: {
      components: modernTheme.components,
      componentMeta: modernTheme.componentMeta,
      hooks: modernTheme.hooks,
      templates: modernTheme.templates,
      features: modernTheme.features
    }
  };
}

// ============================================================================
// 导出兼容性类型
// ============================================================================

// 为了保持向后兼容，重新导出传统类型
export type Theme = UnifiedTheme;
export type ThemeConfig = UnifiedThemeConfig;
export type CreateThemeInput = CreateUnifiedThemeInput;
export type UpdateThemeInput = UpdateUnifiedThemeInput;

// 导出现代主题系统的类型
export type ModernTheme = UnifiedTheme & { modern: NonNullable<UnifiedTheme['modern']> };