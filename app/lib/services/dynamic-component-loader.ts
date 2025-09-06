/**
 * 动态组件加载系统
 * 支持按需加载、代码分割和组件缓存
 */

import React, { ComponentType, lazy, Suspense } from 'react';
import { ComponentConfig, ComponentMeta } from '../types/modern-theme';

// 类型别名
type ComponentMetadata = ComponentMeta;

// ============================================================================
// 类型定义
// ============================================================================

interface ComponentLoadOptions {
  /** 是否启用缓存 */
  cache?: boolean;
  /** 加载超时时间（毫秒） */
  timeout?: number;
  /** 重试次数 */
  retries?: number;
  /** 加载失败回调 */
  onError?: (error: Error) => void;
  /** 加载成功回调 */
  onSuccess?: (component: ComponentType<any>) => void;
}

interface ComponentSource {
  /** 组件类型 */
  type: 'esm' | 'umd' | 'systemjs' | 'webpack' | 'vite';
  /** 组件URL或路径 */
  url: string;
  /** 导出名称 */
  exportName?: string;
  /** 依赖项 */
  dependencies?: string[];
  /** 版本号 */
  version?: string;
}

interface LoadedComponent {
  /** 组件实例 */
  component: ComponentType<any>;
  /** 组件元数据 */
  metadata: ComponentMetadata;
  /** 加载时间 */
  loadedAt: number;
  /** 组件源信息 */
  source: ComponentSource;
}

interface ComponentRegistry {
  [key: string]: LoadedComponent;
}

// ============================================================================
// 动态组件加载器
// ============================================================================

export class DynamicComponentLoader {
  private registry: ComponentRegistry = {};
  private loadingPromises = new Map<string, Promise<ComponentType<any>>>();
  private options: Required<ComponentLoadOptions>;
  
  constructor(options: ComponentLoadOptions = {}) {
    this.options = {
      cache: true,
      timeout: 30000,
      retries: 3,
      onError: () => {},
      onSuccess: () => {},
      ...options
    };
  }

  // ============================================================================
  // 组件加载方法
  // ============================================================================

  /**
   * 加载组件
   */
  async loadComponent(
    id: string,
    source: ComponentSource,
    options: ComponentLoadOptions = {}
  ): Promise<ComponentType<any>> {
    const mergedOptions = { ...this.options, ...options };
    
    // 检查缓存
    if (mergedOptions.cache && this.registry[id]) {
      const loaded = this.registry[id];
      mergedOptions.onSuccess?.(loaded.component);
      return loaded.component;
    }
    
    // 检查是否正在加载
    if (this.loadingPromises.has(id)) {
      return this.loadingPromises.get(id)!;
    }
    
    // 开始加载
    const loadPromise = this.performLoad(id, source, mergedOptions);
    this.loadingPromises.set(id, loadPromise);
    
    try {
      const component = await loadPromise;
      this.loadingPromises.delete(id);
      return component;
    } catch (error) {
      this.loadingPromises.delete(id);
      throw error;
    }
  }

  /**
   * 执行组件加载
   */
  private async performLoad(
    id: string,
    source: ComponentSource,
    options: Required<ComponentLoadOptions>
  ): Promise<ComponentType<any>> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= options.retries; attempt++) {
      try {
        const component = await this.loadWithTimeout(
          () => this.loadByType(source),
          options.timeout
        );
        
        // 验证组件
        this.validateComponent(component);
        
        // 缓存组件
        if (options.cache) {
          this.registry[id] = {
            component,
            metadata: this.extractMetadata(component),
            loadedAt: Date.now(),
            source
          };
        }
        
        options.onSuccess?.(component);
        return component;
        
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < options.retries) {
          // 等待后重试
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }
    
    const finalError = new Error(
      `Failed to load component ${id} after ${options.retries + 1} attempts: ${lastError?.message}`
    );
    
    options.onError?.(finalError);
    throw finalError;
  }

  /**
   * 根据类型加载组件
   */
  private async loadByType(source: ComponentSource): Promise<ComponentType<any>> {
    switch (source.type) {
      case 'esm':
        return await this.loadESMComponent(source);
      
      case 'umd':
        return await this.loadUMDComponent(source);
      
      case 'systemjs':
        return await this.loadSystemJSComponent(source);
      
      case 'webpack':
        return await this.loadWebpackComponent(source);
      
      case 'vite':
        return await this.loadViteComponent(source);
      
      default:
        throw new Error(`Unsupported component type: ${source.type}`);
    }
  }

  /**
   * 加载 ESM 组件
   */
  private async loadESMComponent(source: ComponentSource): Promise<ComponentType<any>> {
    try {
      const module = await import(source.url);
      const exportName = source.exportName || 'default';
      
      if (!module[exportName]) {
        throw new Error(`Export '${exportName}' not found in module`);
      }
      
      return module[exportName];
    } catch (error) {
      throw new Error(`Failed to load ESM component: ${error}`);
    }
  }

  /**
   * 加载 UMD 组件
   */
  private async loadUMDComponent(source: ComponentSource): Promise<ComponentType<any>> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = source.url;
      script.type = 'text/javascript';
      
      script.onload = () => {
        try {
          const exportName = source.exportName || 'default';
          const component = (window as any)[exportName];
          
          if (!component) {
            throw new Error(`Global '${exportName}' not found`);
          }
          
          resolve(component);
        } catch (error) {
          reject(error);
        } finally {
          document.head.removeChild(script);
        }
      };
      
      script.onerror = () => {
        document.head.removeChild(script);
        reject(new Error(`Failed to load UMD script: ${source.url}`));
      };
      
      document.head.appendChild(script);
    });
  }

  /**
   * 加载 SystemJS 组件
   */
  private async loadSystemJSComponent(source: ComponentSource): Promise<ComponentType<any>> {
    if (typeof (window as any).System === 'undefined') {
      throw new Error('SystemJS is not available');
    }
    
    try {
      const module = await (window as any).System.import(source.url);
      const exportName = source.exportName || 'default';
      
      if (!module[exportName]) {
        throw new Error(`Export '${exportName}' not found in SystemJS module`);
      }
      
      return module[exportName];
    } catch (error) {
      throw new Error(`Failed to load SystemJS component: ${error}`);
    }
  }

  /**
   * 加载 Webpack 组件（模块联邦）
   */
  private async loadWebpackComponent(source: ComponentSource): Promise<ComponentType<any>> {
    try {
      // 假设使用 Webpack Module Federation
      const container = (window as any)[source.exportName || 'remoteEntry'];
      
      if (!container) {
        throw new Error(`Webpack container '${source.exportName}' not found`);
      }
      
      await container.init((window as any).__webpack_share_scopes__.default);
      const factory = await container.get('./Component');
      const module = factory();
      
      return module.default || module;
    } catch (error) {
      throw new Error(`Failed to load Webpack component: ${error}`);
    }
  }

  /**
   * 加载 Vite 组件
   */
  private async loadViteComponent(source: ComponentSource): Promise<ComponentType<any>> {
    try {
      // Vite 动态导入
      const module = await import(/* @vite-ignore */ source.url);
      const exportName = source.exportName || 'default';
      
      if (!module[exportName]) {
        throw new Error(`Export '${exportName}' not found in Vite module`);
      }
      
      return module[exportName];
    } catch (error) {
      throw new Error(`Failed to load Vite component: ${error}`);
    }
  }

  // ============================================================================
  // React 懒加载支持
  // ============================================================================

  /**
   * 创建懒加载组件
   */
  createLazyComponent(
    id: string,
    source: ComponentSource,
    options: ComponentLoadOptions = {}
  ): ComponentType<any> {
    return lazy(() => 
      this.loadComponent(id, source, options).then(component => ({
        default: component
      }))
    );
  }

  /**
   * 创建带 Suspense 的懒加载组件
   */
  createSuspenseComponent(
    id: string,
    source: ComponentSource,
    fallback: React.ReactNode = React.createElement('div', {}, 'Loading...'),
    options: ComponentLoadOptions = {}
  ): ComponentType<any> {
    const LazyComponent = this.createLazyComponent(id, source, options);
    
    return (props: any) => 
      React.createElement(
        Suspense,
        { fallback },
        React.createElement(LazyComponent, props)
      );
  }

  // ============================================================================
  // 预加载和缓存管理
  // ============================================================================

  /**
   * 预加载组件
   */
  async preloadComponent(
    id: string,
    source: ComponentSource,
    options: ComponentLoadOptions = {}
  ): Promise<void> {
    try {
      await this.loadComponent(id, source, { ...options, cache: true });
    } catch (error) {
      console.warn(`Failed to preload component ${id}:`, error);
    }
  }

  /**
   * 批量预加载组件
   */
  async preloadComponents(
    components: Array<{ id: string; source: ComponentSource; options?: ComponentLoadOptions }>
  ): Promise<void> {
    const promises = components.map(({ id, source, options }) =>
      this.preloadComponent(id, source, options)
    );
    
    await Promise.allSettled(promises);
  }

  /**
   * 获取已加载的组件
   */
  getLoadedComponent(id: string): LoadedComponent | null {
    return this.registry[id] || null;
  }

  /**
   * 获取所有已加载的组件
   */
  getAllLoadedComponents(): ComponentRegistry {
    return { ...this.registry };
  }

  /**
   * 清除组件缓存
   */
  clearCache(id?: string): void {
    if (id) {
      delete this.registry[id];
    } else {
      this.registry = {};
    }
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats(): {
    totalComponents: number;
    totalSize: number;
    oldestComponent: string | null;
    newestComponent: string | null;
  } {
    const components = Object.entries(this.registry);
    
    if (components.length === 0) {
      return {
        totalComponents: 0,
        totalSize: 0,
        oldestComponent: null,
        newestComponent: null
      };
    }
    
    let oldest = components[0];
    let newest = components[0];
    
    for (const [id, component] of components) {
      if (oldest && component.loadedAt < oldest[1].loadedAt) {
        oldest = [id, component];
      }
      if (newest && component.loadedAt > newest[1].loadedAt) {
        newest = [id, component];
      }
    }
    
    return {
      totalComponents: components.length,
      totalSize: this.calculateCacheSize(),
      oldestComponent: oldest?.[0] || null,
      newestComponent: newest?.[0] || null
    };
  }

  // ============================================================================
  // 工具方法
  // ============================================================================

  /**
   * 带超时的加载
   */
  private async loadWithTimeout<T>(
    loader: () => Promise<T>,
    timeout: number
  ): Promise<T> {
    return Promise.race([
      loader(),
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Component load timeout after ${timeout}ms`));
        }, timeout);
      })
    ]);
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 验证组件
   */
  private validateComponent(component: any): void {
    if (typeof component !== 'function') {
      throw new Error('Loaded module is not a valid React component');
    }
  }

  /**
   * 提取组件元数据
   */
  private extractMetadata(component: ComponentType<any>): ComponentMetadata {
    return {
      name: component.name || 'Anonymous',
      displayName: component.displayName || component.name || 'Anonymous',
      description: (component as any).__description || '',
      category: (component as any).__category || 'general',
      icon: (component as any).__icon,
      props: (component as any).__props,
      preview: (component as any).__preview
    };
  }

  /**
   * 计算缓存大小（估算）
   */
  private calculateCacheSize(): number {
    // 简化的大小计算，实际应用中可能需要更精确的方法
    return Object.keys(this.registry).length * 1024; // 假设每个组件 1KB
  }

  /**
   * 清理资源
   */
  destroy(): void {
    this.clearCache();
    this.loadingPromises.clear();
  }
}

// ============================================================================
// 全局实例和工具函数
// ============================================================================

// 创建全局加载器实例
export const componentLoader = new DynamicComponentLoader();

/**
 * 创建组件加载钩子
 */
export function createComponentLoader(options?: ComponentLoadOptions) {
  return new DynamicComponentLoader(options);
}

/**
 * 快速加载组件的工具函数
 */
export async function loadComponent(
  id: string,
  source: ComponentSource,
  options?: ComponentLoadOptions
): Promise<ComponentType<any>> {
  return componentLoader.loadComponent(id, source, options);
}

/**
 * 快速创建懒加载组件的工具函数
 */
export function createLazyComponent(
  id: string,
  source: ComponentSource,
  options?: ComponentLoadOptions
): ComponentType<any> {
  return componentLoader.createLazyComponent(id, source, options);
}

// 导出类型
export type {
  ComponentLoadOptions,
  ComponentSource,
  LoadedComponent,
  ComponentRegistry
};