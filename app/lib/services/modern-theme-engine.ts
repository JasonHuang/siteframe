/**
 * 现代化主题引擎
 * 负责主题的加载、管理和运行时控制
 */

import { EventEmitter } from 'events';
import React from 'react';
import {
  ModernTheme,
  ThemeSource,
  ThemeConfig,
  ThemeContext,
  ThemeEngineOptions,
  ThemeEvents,
  ComponentConfig,
  HookHandler,
  ThemeManifest
} from '../types/modern-theme';

export class ModernThemeEngine extends EventEmitter {
  private currentTheme: ModernTheme | null = null;
  private config: ThemeConfig | null = null;
  private componentRegistry = new Map<string, React.ComponentType<any>>();
  private hookRegistry = new Map<string, HookHandler[]>();
  private themeCache = new Map<string, ModernTheme>();
  private options: ThemeEngineOptions;
  private context: Partial<ThemeContext> = {};

  constructor(options: ThemeEngineOptions = {}) {
    super();
    this.options = {
      cacheEnabled: true,
      devMode: false,
      strictMode: true,
      fallbackTheme: 'default',
      ...options
    };
  }

  // ============================================================================
  // 主题加载和管理
  // ============================================================================

  /**
   * 加载主题
   */
  async loadTheme(themeId: string, source: ThemeSource): Promise<void> {
    try {
      this.emit('theme:loading', { themeId, source });

      // 检查缓存
      let theme = this.options.cacheEnabled ? this.themeCache.get(themeId) : null;
      
      if (!theme) {
        theme = await this.loadThemeModule(themeId, source);
        
        if (this.options.cacheEnabled) {
          this.themeCache.set(themeId, theme);
        }
      }

      // 验证主题
      await this.validateTheme(theme);

      // 卸载当前主题
      if (this.currentTheme) {
        await this.unloadTheme();
      }

      // 应用新主题
      this.currentTheme = theme;
      this.config = { ...theme.defaultConfig };
      
      await this.applyTheme();
      
      this.emit('theme:loaded', { theme });
    } catch (error) {
      this.emit('theme:error', { error: error as Error, themeId });
      
      if (this.options.strictMode) {
        throw error;
      } else {
        console.error(`Failed to load theme ${themeId}:`, error);
        await this.loadFallbackTheme();
      }
    }
  }

  /**
   * 卸载当前主题
   */
  async unloadTheme(): Promise<void> {
    if (!this.currentTheme) return;

    const themeId = this.currentTheme.metadata.name;
    
    // 执行卸载钩子
    await this.executeHook('theme:unloaded', { themeId });
    
    // 清理注册的组件和钩子
    this.componentRegistry.clear();
    this.hookRegistry.clear();
    
    // 清理样式
    this.removeThemeStyles();
    
    this.currentTheme = null;
    this.config = null;
    
    this.emit('theme:unloaded', { themeId });
  }

  /**
   * 从不同源加载主题模块
   */
  private async loadThemeModule(themeId: string, source: ThemeSource): Promise<ModernTheme> {
    switch (source.type) {
      case 'npm':
        return await this.loadFromNpm(source.package, source.version);
      
      case 'git':
        return await this.loadFromGit(source.repository, source.branch);
      
      case 'local':
        return await this.loadFromLocal(source.path);
      
      case 'url':
        return await this.loadFromUrl(source.url);
      
      case 'marketplace':
        return await this.loadFromMarketplace(source.id);
      
      default:
        throw new Error(`Unsupported theme source type: ${(source as any).type}`);
    }
  }

  /**
   * 从 NPM 包加载主题
   */
  private async loadFromNpm(packageName: string, version?: string): Promise<ModernTheme> {
    const packagePath = version ? `${packageName}@${version}` : packageName;
    
    try {
      // 目前暂不支持动态 NPM 包加载，避免构建警告
      throw new Error(`NPM package loading not implemented yet: ${packagePath}`);
    } catch (error) {
      throw new Error(`Failed to load theme from npm package: ${packagePath}`);
    }
  }

  /**
   * 从 Git 仓库加载主题
   */
  private async loadFromGit(repository: string, branch = 'main'): Promise<ModernTheme> {
    // 这里需要实现 Git 仓库的克隆和构建逻辑
    throw new Error('Git source loading not implemented yet');
  }

  /**
   * 从本地路径加载主题
   */
  private async loadFromLocal(path: string): Promise<ModernTheme> {
    try {
      // 移除开头的斜杠并获取主题名称
      const cleanPath = path.replace(/^\//, '');
      const themeName = cleanPath.startsWith('themes/') 
        ? cleanPath.replace('themes/', '') 
        : cleanPath.split('/').pop() || cleanPath;
      
      // 使用静态导入映射来避免 webpack 警告
      let themeModule;
      switch (themeName) {
        case 'original-homepage-theme':
          themeModule = await import('@/themes/original-homepage-theme');
          break;
        case 'minimal-theme':
          themeModule = await import('@/themes/minimal-theme');
          break;
        case 'modern-blog-theme':
          themeModule = await import('@/themes/modern-blog-theme');
          break;
        case 'test-auto-theme':
          themeModule = await import('@/themes/test-auto-theme');
          break;
        default:
           // 对于未知主题，抛出错误而不是使用动态导入
           throw new Error(`Unknown theme: ${themeName}. Please add it to the static import list.`);
      }
      
      const theme = themeModule.default || themeModule;
      
      // 如果主题是一个函数（如 loadTheme），则调用它
      if (typeof theme === 'function') {
        return await theme();
      }
      
      return theme;
    } catch (error) {
      console.error(`Failed to load theme from local path: ${path}`, error);
      throw new Error(`Failed to load theme from local path: ${path}`);
    }
  }

  /**
   * 解析主题路径
   */
  private resolveThemePath(path: string): string {
    // 移除开头的斜杠
    const cleanPath = path.replace(/^\//, '');
    
    // 如果路径以 themes/ 开头，使用相对于 app 目录的路径
    if (cleanPath.startsWith('themes/')) {
      // 直接使用相对于 app 目录的路径
      return `@/${cleanPath}`;
    }
    
    // 如果是主题名称，添加 themes/ 前缀
    if (!cleanPath.includes('/')) {
      return `@/themes/${cleanPath}`;
    }
    
    // 默认情况：假设是相对于 app 目录的路径
    return `@/${cleanPath}`;
  }

  /**
   * 从 URL 加载主题
   */
  private async loadFromUrl(url: string): Promise<ModernTheme> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const themeData = await response.json();
      return themeData;
    } catch (error) {
      throw new Error(`Failed to load theme from URL: ${url}`);
    }
  }

  /**
   * 从主题市场加载主题
   */
  private async loadFromMarketplace(id: string): Promise<ModernTheme> {
    // 这里需要实现主题市场的 API 调用
    throw new Error('Marketplace source loading not implemented yet');
  }

  // ============================================================================
  // 主题应用和验证
  // ============================================================================

  /**
   * 验证主题结构
   */
  private async validateTheme(theme: ModernTheme): Promise<void> {
    if (!theme.metadata?.name) {
      throw new Error('Theme metadata.name is required');
    }
    
    if (!theme.metadata?.version) {
      throw new Error('Theme metadata.version is required');
    }
    
    if (!theme.components) {
      throw new Error('Theme components are required');
    }
    
    if (!theme.defaultConfig) {
      throw new Error('Theme defaultConfig is required');
    }
    
    // 验证组件
    this.validateComponents(theme.components);
    
    // 验证配置 Schema
    if (theme.configSchema) {
      this.validateConfigSchema(theme.configSchema, theme.defaultConfig);
    }
  }

  /**
   * 验证组件结构
   */
  private validateComponents(components: ModernTheme['components']): void {
    const { layouts, blocks, widgets } = components;
    
    if (!layouts || Object.keys(layouts).length === 0) {
      throw new Error('At least one layout component is required');
    }
    
    // 验证每个组件都是有效的 React 组件
    const allComponents = { ...layouts, ...blocks, ...widgets };
    
    for (const [name, component] of Object.entries(allComponents)) {
      if (typeof component !== 'function') {
        throw new Error(`Component ${name} is not a valid React component`);
      }
    }
  }

  /**
   * 验证配置 Schema
   */
  private validateConfigSchema(schema: any, config: any): void {
    // 这里可以使用 ajv 或其他 JSON Schema 验证库
    // 简化实现，只做基本检查
    if (typeof schema !== 'object' || typeof config !== 'object') {
      throw new Error('Invalid config schema or default config');
    }
  }

  /**
   * 应用主题
   */
  private async applyTheme(): Promise<void> {
    if (!this.currentTheme || !this.config) return;
    
    // 1. 应用样式
    await this.applyStyles();
    
    // 2. 注册组件
    this.registerComponents();
    
    // 3. 设置钩子
    this.setupHooks();
    
    // 4. 执行初始化钩子
    await this.executeHook('theme:init', { theme: this.currentTheme, config: this.config });
  }

  /**
   * 应用主题样式
   */
  private async applyStyles(): Promise<void> {
    if (!this.currentTheme) return;

    const { styles } = this.currentTheme;
    
    // 应用设计令牌
    this.applyDesignTokens(styles.tokens);
    
    // 应用主题变量
    if (styles.themes) {
      const currentThemeVars = styles.themes.light || styles.themes.default;
      if (currentThemeVars) {
        this.applyThemeVariables(currentThemeVars);
      }
    }
    
    // 应用全局 CSS
    if (styles.globalCSS) {
      this.applyGlobalCSS(styles.globalCSS);
    }
  }

  /**
   * 应用设计令牌
   */
  private applyDesignTokens(tokens: any): void {
    const root = document.documentElement;
    
    // 应用颜色令牌
    if (tokens.colors) {
      this.applyColorTokens(root, tokens.colors);
    }
    
    // 应用字体令牌
    if (tokens.typography) {
      this.applyTypographyTokens(root, tokens.typography);
    }
    
    // 应用间距令牌
    if (tokens.spacing) {
      this.applySpacingTokens(root, tokens.spacing);
    }
  }

  /**
   * 应用颜色令牌
   */
  private applyColorTokens(root: HTMLElement, colors: any): void {
    const applyColorScale = (prefix: string, scale: any) => {
      Object.entries(scale).forEach(([key, value]) => {
        root.style.setProperty(`--color-${prefix}-${key}`, value as string);
      });
    };
    
    applyColorScale('primary', colors.primary);
    applyColorScale('secondary', colors.secondary);
    applyColorScale('accent', colors.accent);
    applyColorScale('neutral', colors.neutral);
    
    if (colors.semantic) {
      applyColorScale('success', colors.semantic.success);
      applyColorScale('warning', colors.semantic.warning);
      applyColorScale('error', colors.semantic.error);
      applyColorScale('info', colors.semantic.info);
    }
  }

  /**
   * 应用字体令牌
   */
  private applyTypographyTokens(root: HTMLElement, typography: any): void {
    if (typography.fontFamilies) {
      Object.entries(typography.fontFamilies).forEach(([key, value]) => {
        root.style.setProperty(`--font-${key}`, value as string);
      });
    }
    
    if (typography.fontSizes) {
      Object.entries(typography.fontSizes).forEach(([key, value]) => {
        root.style.setProperty(`--text-${key}`, value as string);
      });
    }
  }

  /**
   * 应用间距令牌
   */
  private applySpacingTokens(root: HTMLElement, spacing: any): void {
    Object.entries(spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value as string);
    });
  }

  /**
   * 应用主题变量
   */
  private applyThemeVariables(variables: any): void {
    const root = document.documentElement;
    
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value as string);
    });
  }

  /**
   * 应用全局 CSS
   */
  private applyGlobalCSS(css: string): void {
    const styleId = 'theme-global-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = css;
  }

  /**
   * 移除主题样式
   */
  private removeThemeStyles(): void {
    const styleElement = document.getElementById('theme-global-styles');
    if (styleElement) {
      styleElement.remove();
    }
    
    // 移除 CSS 变量
    const root = document.documentElement;
    const styles = root.style;
    
    for (let i = styles.length - 1; i >= 0; i--) {
      const property = styles.item(i);
      if (property && (property.startsWith('--color-') || 
          property.startsWith('--font-') || 
          property.startsWith('--text-') || 
          property.startsWith('--spacing-'))) {
        root.style.removeProperty(property);
      }
    }
  }

  // ============================================================================
  // 组件注册和管理
  // ============================================================================

  /**
   * 注册主题组件
   */
  private registerComponents(): void {
    if (!this.currentTheme) return;

    const { components } = this.currentTheme;
    
    // 注册布局组件
    Object.entries(components.layouts).forEach(([name, component]) => {
      this.registerComponent('layout', name, component);
    });
    
    // 注册块组件
    Object.entries(components.blocks).forEach(([name, component]) => {
      this.registerComponent('block', name, component);
    });
    
    // 注册小部件组件
    Object.entries(components.widgets).forEach(([name, component]) => {
      this.registerComponent('widget', name, component);
    });
  }

  /**
   * 注册单个组件
   */
  private registerComponent(type: string, name: string, component: React.ComponentType<any>): void {
    const key = `${type}:${name}`;
    this.componentRegistry.set(key, component);
    this.emit('component:registered', { type, name });
  }

  /**
   * 获取组件
   */
  getComponent(type: string, name: string): React.ComponentType<any> | null {
    const key = `${type}:${name}`;
    return this.componentRegistry.get(key) || null;
  }

  /**
   * 获取所有组件
   */
  getAllComponents(): Map<string, React.ComponentType<any>> {
    return new Map(this.componentRegistry);
  }

  // ============================================================================
  // 钩子系统
  // ============================================================================

  /**
   * 设置主题钩子
   */
  private setupHooks(): void {
    if (!this.currentTheme?.hooks) return;

    Object.entries(this.currentTheme.hooks).forEach(([hookName, handler]) => {
      if (handler) {
        this.addHook(hookName, handler);
      }
    });
  }

  /**
   * 添加钩子处理器
   */
  addHook(hookName: string, handler: HookHandler): void {
    if (!this.hookRegistry.has(hookName)) {
      this.hookRegistry.set(hookName, []);
    }
    
    this.hookRegistry.get(hookName)!.push(handler);
  }

  /**
   * 移除钩子处理器
   */
  removeHook(hookName: string, handler: HookHandler): void {
    const handlers = this.hookRegistry.get(hookName);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * 执行钩子
   */
  async executeHook(hookName: string, data?: any): Promise<any> {
    const handlers = this.hookRegistry.get(hookName);
    if (!handlers || handlers.length === 0) {
      return data;
    }

    let result = data;
    
    for (const handler of handlers) {
      try {
        const handlerResult = await handler(result);
        if (handlerResult !== undefined) {
          result = handlerResult;
        }
      } catch (error) {
        console.error(`Error in hook ${hookName}:`, error);
        if (this.options.strictMode) {
          throw error;
        }
      }
    }
    
    return result;
  }

  // ============================================================================
  // 配置管理
  // ============================================================================

  /**
   * 更新主题配置
   */
  updateConfig(newConfig: Partial<ThemeConfig>): void {
    if (!this.config) return;
    
    this.config = { ...this.config, ...newConfig };
    this.emit('config:changed', { config: this.config });
  }

  /**
   * 获取当前配置
   */
  getConfig(): ThemeConfig | null {
    return this.config;
  }

  /**
   * 重置配置为默认值
   */
  resetConfig(): void {
    if (!this.currentTheme) return;
    
    this.config = { ...this.currentTheme.defaultConfig };
    this.emit('config:changed', { config: this.config });
  }

  // ============================================================================
  // 实用方法
  // ============================================================================

  /**
   * 获取当前主题
   */
  getCurrentTheme(): ModernTheme | null {
    return this.currentTheme;
  }

  /**
   * 获取主题上下文
   */
  getContext(): Partial<ThemeContext> {
    const context: Partial<ThemeContext> = {
      ...this.context
    };
    
    if (this.currentTheme) {
      context.theme = this.currentTheme;
    }
    
    if (this.config) {
      context.config = this.config;
    }
    
    return context;
  }

  /**
   * 设置上下文数据
   */
  setContext(context: Partial<ThemeContext>): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * 加载回退主题
   */
  private async loadFallbackTheme(): Promise<void> {
    if (this.options.fallbackTheme) {
      try {
        await this.loadTheme(this.options.fallbackTheme, { type: 'local', path: './themes/default' });
      } catch (error) {
        console.error('Failed to load fallback theme:', error);
      }
    }
  }

  /**
   * 清理资源
   */
  destroy(): void {
    this.unloadTheme();
    this.removeAllListeners();
    this.themeCache.clear();
    this.componentRegistry.clear();
    this.hookRegistry.clear();
  }
}

// 创建全局主题引擎实例
export const themeEngine = new ModernThemeEngine();

// 导出类型
export type { ModernTheme, ThemeSource, ThemeConfig, ThemeContext };