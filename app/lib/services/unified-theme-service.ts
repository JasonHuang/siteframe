/**
 * 统一主题服务
 * 整合传统主题服务和现代主题引擎的功能
 */

import { createClient } from '@supabase/supabase-js';
import { UnifiedTheme, UnifiedThemeConfig, ThemeOperationResult, ThemeState, CreateUnifiedThemeInput, UpdateUnifiedThemeInput, convertLegacyTheme, convertModernTheme, UnifiedThemeEngine } from '../types/unified-theme';
import { themeEngine as modernThemeEngine } from './modern-theme-engine';
import { supabase, supabaseAdmin } from '../supabase';


/**
 * 统一主题服务类
 * 作为传统主题系统和现代主题系统的桥接层
 */
class UnifiedThemeService implements UnifiedThemeEngine {
  private supabase;
  private currentTheme: UnifiedTheme | null = null;
  private availableThemes: UnifiedTheme[] = [];
  private isLoading = false;
  private error: string | null = null;
  private eventListeners: Map<string, Function[]> = new Map();
  private hooks: Map<string, Function[]> = new Map();
  private components: Map<string, Map<string, React.ComponentType<any>>> = new Map();

  constructor() {
    this.supabase = supabaseAdmin || supabase;
     
    // 初始化组件存储
    this.components.set('layout', new Map());
    this.components.set('block', new Map());
    this.components.set('widget', new Map());
  }

  // ============================================================================
  // 主题管理方法
  // ============================================================================

  /**
   * 获取所有可用主题
   */
  async getAllThemes(): Promise<UnifiedTheme[]> {
    try {
      this.isLoading = true;
      this.error = null;
      
      // 获取数据库中的主题
      const { data: themes, error } = await this.supabase
        .from('themes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      const convertedThemes = (themes || []).map(convertLegacyTheme);
      
      // 获取现代主题（如果有的话）
      const modernThemes: UnifiedTheme[] = [];
      try {
        // 这里可以添加现代主题的获取逻辑
        // const modernThemeList = await modernThemeEngine.getInstalledThemes();
        // modernThemes = modernThemeList.map(theme => convertModernTheme(theme.theme, theme.manifest));
      } catch (error) {
        console.warn('Failed to load modern themes:', error);
      }
      
      this.availableThemes = [...convertedThemes, ...modernThemes];
      return this.availableThemes;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to load themes';
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 获取当前激活的主题
   */
  async getActiveTheme(): Promise<UnifiedTheme | null> {
    try {
      // 从数据库获取激活主题
      const { data: activeTheme, error } = await this.supabase
        .from('themes')
        .select('*')
        .eq('is_active', true)
        .single();
      
      if (activeTheme && !error) {
        this.currentTheme = convertLegacyTheme(activeTheme);
        return this.currentTheme;
      }
      
      // 如果传统系统没有激活主题，检查现代系统
      // const modernActiveTheme = await modernThemeEngine.getCurrentTheme();
      // if (modernActiveTheme) {
      //   this.currentTheme = convertModernTheme(modernActiveTheme.theme, modernActiveTheme.manifest);
      //   return this.currentTheme;
      // }
      
      return null;
    } catch (error) {
      console.error('Failed to get active theme:', error);
      return null;
    }
  }

  /**
   * 根据ID获取主题
   */
  async getThemeById(id: string): Promise<UnifiedTheme | null> {
    try {
      // 从数据库获取主题
      const { data: theme, error } = await this.supabase
        .from('themes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (theme && !error) {
        return convertLegacyTheme(theme);
      }
      
      // 再尝试从现代系统获取
      // const modernTheme = await modernThemeEngine.getTheme(id);
      // if (modernTheme) {
      //   return convertModernTheme(modernTheme.theme, modernTheme.manifest);
      // }
      
      return null;
    } catch (error) {
      console.error(`Failed to get theme ${id}:`, error);
      return null;
    }
  }

  /**
   * 加载主题
   */
  async loadTheme(themeId: string): Promise<void> {
    try {
      this.emit('theme:loading', { themeId });
      
      const theme = await this.getThemeById(themeId);
      if (!theme) {
        throw new Error(`Theme ${themeId} not found`);
      }
      
      // 如果是现代主题，使用现代引擎加载
      if (theme.modern) {
        // 现代主题引擎需要 themeId 和 source 参数
        const source = { type: 'local' as const, path: `./app/themes/${themeId}` };
        await modernThemeEngine.loadTheme(themeId, source);
      }
      
      // 执行主题加载钩子
      this.executeHook('theme:loaded', theme);
      this.emit('theme:loaded', { theme });
      
    } catch (error) {
      this.emit('theme:error', { error, themeId });
      throw error;
    }
  }

  /**
   * 卸载主题
   */
  async unloadTheme(themeId: string): Promise<void> {
    try {
      const theme = await this.getThemeById(themeId);
      if (!theme) {
        return;
      }
      
      // 如果是现代主题，使用现代引擎卸载
      if (theme.modern) {
        await modernThemeEngine.unloadTheme();
      }
      
      // 执行主题卸载钩子
      this.executeHook('theme:unloaded', theme);
      this.emit('theme:unloaded', { themeId });
      
    } catch (error) {
      console.error(`Failed to unload theme ${themeId}:`, error);
      throw error;
    }
  }

  /**
   * 激活主题
   */
  async activateTheme(themeId: string): Promise<void> {
    try {
      // 激活主题：先取消所有主题的激活状态，再激活指定主题
      const { error: deactivateError } = await this.supabase
        .from('themes')
        .update({ is_active: false })
        .eq('is_active', true);
      
      if (deactivateError) {
        console.error('Failed to deactivate themes:', deactivateError);
        throw new Error(deactivateError.message);
      }
      
      const { error: activateError } = await this.supabase
        .from('themes')
        .update({ is_active: true })
        .eq('id', themeId);
        
      if (activateError) {
        console.error('Failed to activate theme:', activateError);
        throw new Error(activateError.message);
      }
      
      // 加载主题到现代引擎
      await this.loadTheme(themeId);
      
      // 更新当前主题
      this.currentTheme = await this.getThemeById(themeId);
      
    } catch (error) {
      console.error(`Failed to activate theme ${themeId}:`, error);
      throw error;
    }
  }

  /**
   * 创建新主题
   */
  async createTheme(input: CreateUnifiedThemeInput): Promise<UnifiedTheme> {
    try {
      // 创建主题
      const { data: theme, error } = await this.supabase
        .from('themes')
        .insert({
          name: input.name,
          display_name: input.display_name,
          description: input.description,
          version: input.version || '1.0.0',
          author: input.author,
          preview_image: input.preview_image,
          is_active: input.is_active || false,
          is_system: input.is_system || false,
          config: input.config || {}
        })
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return convertLegacyTheme(theme);
    } catch (error) {
      console.error('Failed to create theme:', error);
      throw error;
    }
  }

  /**
   * 更新主题
   */
  async updateTheme(id: string, input: UpdateUnifiedThemeInput): Promise<UnifiedTheme> {
    try {
      // 更新主题
      const updateData = {
        ...(input.display_name && { display_name: input.display_name }),
        ...(input.description && { description: input.description }),
        ...(input.is_active !== undefined && { is_active: input.is_active }),
        ...(input.config && { config: input.config }),
        updated_at: new Date().toISOString()
      };
      
      const { data: theme, error } = await this.supabase
        .from('themes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return convertLegacyTheme(theme);
    } catch (error) {
      console.error(`Failed to update theme ${id}:`, error);
      throw error;
    }
  }

  /**
   * 删除主题
   */
  async deleteTheme(id: string): Promise<void> {
    try {
      // 先卸载主题
      await this.unloadTheme(id);
      
      // 删除主题
      const { error } = await this.supabase.from('themes').delete().eq('id', id);
      if (error) throw new Error(error.message);
      
    } catch (error) {
      console.error(`Failed to delete theme ${id}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // 配置管理方法
  // ============================================================================

  /**
   * 获取当前主题配置
   */
  getConfig(): UnifiedThemeConfig {
    return this.currentTheme?.config || {};
  }

  /**
   * 更新主题配置
   */
  async updateConfig(config: Partial<UnifiedThemeConfig>): Promise<void> {
    if (!this.currentTheme) {
      throw new Error('No active theme to update config');
    }
    
    try {
      const updatedTheme = await this.updateTheme(this.currentTheme.id, { config });
      this.currentTheme = updatedTheme;
      this.emit('config:changed', { config: updatedTheme.config });
    } catch (error) {
      console.error('Failed to update theme config:', error);
      throw error;
    }
  }

  // ============================================================================
  // 钩子系统方法
  // ============================================================================

  /**
   * 添加钩子
   */
  addHook(hookName: string, handler: Function): void {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    this.hooks.get(hookName)!.push(handler);
  }

  /**
   * 移除钩子
   */
  removeHook(hookName: string, handler: Function): void {
    const handlers = this.hooks.get(hookName);
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
  executeHook(hookName: string, ...args: any[]): any[] {
    const handlers = this.hooks.get(hookName) || [];
    return handlers.map(handler => {
      try {
        return handler(...args);
      } catch (error) {
        console.error(`Error executing hook ${hookName}:`, error);
        return null;
      }
    });
  }

  // ============================================================================
  // 组件系统方法
  // ============================================================================

  /**
   * 注册组件
   */
  registerComponent(type: string, name: string, component: React.ComponentType<any>): void {
    if (!this.components.has(type)) {
      this.components.set(type, new Map());
    }
    this.components.get(type)!.set(name, component);
    this.emit('component:registered', { type, name });
  }

  /**
   * 获取组件
   */
  getComponent(type: string, name: string): React.ComponentType<any> | undefined {
    return this.components.get(type)?.get(name);
  }

  // ============================================================================
  // 事件系统方法
  // ============================================================================

  /**
   * 监听事件
   */
  on(event: string, listener: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  /**
   * 移除事件监听
   */
  off(event: string, listener: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * 触发事件
   */
  emit(event: string, ...args: any[]): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(listener => {
      try {
        listener(...args);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  // ============================================================================
  // 主题扫描和检测方法
  // ============================================================================



  // ============================================================================
  // 状态管理方法
  // ============================================================================

  /**
   * 获取主题状态
   */
  getState(): ThemeState {
    return {
      currentTheme: this.currentTheme,
      availableThemes: this.availableThemes,
      isLoading: this.isLoading,
      error: this.error
    };
  }

  /**
   * 初始化主题系统
   */
  async initialize(): Promise<void> {
    try {
      // 加载所有可用主题
      await this.getAllThemes();
      
      // 获取当前激活主题
      const activeTheme = await this.getActiveTheme();
      if (activeTheme) {
        await this.loadTheme(activeTheme.id);
      }
      
      // 执行初始化钩子
      this.executeHook('theme:init');
      
    } catch (error) {
      console.error('Failed to initialize theme system:', error);
      throw error;
    }
  }
}

// 创建统一主题服务实例
export const unifiedThemeService = new UnifiedThemeService();

// 导出类型和服务
export { UnifiedThemeService };
export type { UnifiedTheme, UnifiedThemeConfig, ThemeOperationResult, ThemeState };