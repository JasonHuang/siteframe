/**
 * 现代化主题系统类型定义
 * 基于 React + Next.js 的主题架构
 */

import { JSONSchema7 } from 'json-schema';
import { EventEmitter } from 'events';

// ============================================================================
// 设计令牌系统
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

export interface DesignTokens {
  colors: {
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
  
  typography: {
    fontFamilies: {
      sans: string;
      serif: string;
      mono: string;
    };
    fontSizes: Record<string, string>;
    fontWeights: Record<string, number>;
    lineHeights: Record<string, number>;
  };
  
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  breakpoints: Record<string, string>;
  zIndex: Record<string, number>;
}

export interface ThemeVariables {
  [key: string]: string | number;
}

// ============================================================================
// 组件系统
// ============================================================================

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

// ============================================================================
// 页面模板系统
// ============================================================================

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

// ============================================================================
// 主题钩子系统
// ============================================================================

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
// 主题配置系统
// ============================================================================

export interface ThemeConfig {
  // 基础配置
  site: {
    title: string;
    description: string;
    logo?: string;
    favicon?: string;
  };
  
  // 布局配置
  layout: {
    header: {
      enabled: boolean;
      sticky: boolean;
      transparent: boolean;
    };
    footer: {
      enabled: boolean;
      columns: number;
    };
    sidebar: {
      enabled: boolean;
      position: 'left' | 'right';
      width: string;
    };
  };
  
  // 样式配置
  styles: {
    theme: string; // light, dark, auto
    primaryColor: string;
    fontFamily: string;
    fontSize: string;
  };
  
  // 功能配置
  features: {
    search: boolean;
    comments: boolean;
    newsletter: boolean;
    analytics: boolean;
  };
  
  // 自定义配置
  custom: Record<string, any>;
}

// ============================================================================
// 主题接口定义
// ============================================================================

export interface ModernTheme {
  // 主题元数据
  metadata: {
    name: string;
    version: string;
    author: string;
    description: string;
    homepage?: string;
    repository?: string;
    license?: string;
    tags?: string[];
    screenshot?: string;
    compatibility: {
      minVersion: string;
      maxVersion?: string;
    };
  };
  
  // 组件系统
  components: {
    layouts: Record<string, React.ComponentType<any>>;
    blocks: Record<string, React.ComponentType<any>>;
    widgets: Record<string, React.ComponentType<any>>;
  };
  
  // 组件元数据
  componentMeta: {
    layouts: Record<string, ComponentMeta>;
    blocks: Record<string, ComponentMeta>;
    widgets: Record<string, ComponentMeta>;
  };
  
  // 样式系统
  styles: {
    tokens: DesignTokens;
    themes: Record<string, ThemeVariables>;
    globalCSS?: string;
  };
  
  // 钩子系统
  hooks: ThemeHooks;
  
  // 配置 Schema
  configSchema: JSONSchema7;
  defaultConfig: ThemeConfig;
  
  // 页面模板
  templates: Record<string, PageTemplate>;
  
  // 主题功能
  features?: {
    customizer?: boolean;
    darkMode?: boolean;
    rtl?: boolean;
    multiLanguage?: boolean;
  };
}

// ============================================================================
// 主题源和加载
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
  config: ThemeConfig;
}

// ============================================================================
// 主题引擎
// ============================================================================

export interface ThemeEngineOptions {
  cacheEnabled?: boolean;
  devMode?: boolean;
  strictMode?: boolean;
  fallbackTheme?: string;
}

export interface ThemeContext {
  theme: ModernTheme;
  config: ThemeConfig;
  data: Record<string, any>;
  user?: {
    id: string;
    role: string;
    permissions: string[];
  };
}

// ============================================================================
// 事件系统
// ============================================================================

export interface ThemeEvents {
  'theme:loading': { themeId: string; source: ThemeSource; };
  'theme:loaded': { theme: ModernTheme; };
  'theme:error': { error: Error; themeId: string; };
  'theme:unloaded': { themeId: string; };
  'config:changed': { config: ThemeConfig; };
  'component:registered': { type: string; name: string; };
  'component:error': { error: Error; type: string; name: string; };
}

// ============================================================================
// 开发工具
// ============================================================================

export interface ThemeDevTools {
  inspector: {
    enabled: boolean;
    showProps: boolean;
    showHooks: boolean;
  };
  hotReload: {
    enabled: boolean;
    watchPaths: string[];
  };
  performance: {
    enabled: boolean;
    showMetrics: boolean;
  };
}

// ============================================================================
// 主题市场
// ============================================================================

export interface ThemeMarketplace {
  id: string;
  name: string;
  description: string;
  author: {
    name: string;
    avatar?: string;
    url?: string;
  };
  version: string;
  price: {
    type: 'free' | 'paid';
    amount?: number;
    currency?: string;
  };
  rating: {
    average: number;
    count: number;
  };
  downloads: number;
  screenshots: string[];
  tags: string[];
  compatibility: {
    minVersion: string;
    maxVersion?: string;
  };
  lastUpdated: Date;
  source: ThemeSource;
}

// ============================================================================
// 导出所有类型
// ============================================================================

export * from './theme'; // 保持向后兼容