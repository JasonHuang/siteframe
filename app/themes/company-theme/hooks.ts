import type { ThemeHooks } from '../../lib/services/theme-hooks';
import type { Theme, CreateThemeInput } from '../../lib/types/theme';

/**
 * Minimal Theme 钩子
 * 演示如何使用主题钩子系统
 */
const minimalThemeHooks: ThemeHooks = {
  /**
   * 注册前钩子 - 可以修改主题数据
   */
  beforeRegister: async (themeData: CreateThemeInput) => {
    console.log(`🔧 Minimal Theme: 准备注册主题 ${themeData.name}`);
    
    // 可以在这里修改主题数据
    return {
      ...themeData,
      description: themeData.description + ' (通过钩子增强)',
      config: {
        ...themeData.config,
        enhanced: true,
        hookVersion: '1.0.0'
      }
    };
  },

  /**
   * 注册后钩子 - 主题注册完成后执行
   */
  afterRegister: async (theme: Theme) => {
    console.log(`✅ Minimal Theme: 主题 ${theme.name} 注册完成`);
    
    // 可以在这里执行一些初始化操作
    // 比如创建主题特定的配置文件、缓存等
  },

  /**
   * 激活前钩子 - 可以阻止主题激活
   */
  beforeActivate: async (theme: Theme) => {
    console.log(`🚀 Minimal Theme: 准备激活主题 ${theme.name}`);
    
    // 检查激活条件
    // 返回 false 可以阻止主题激活
    return true;
  },

  /**
   * 激活后钩子 - 主题激活后执行
   */
  afterActivate: async (theme: Theme) => {
    console.log(`🎨 Minimal Theme: 主题 ${theme.name} 已激活`);
    
    // 可以在这里执行激活后的操作
    // 比如清理缓存、发送通知等
  },

  /**
   * 停用前钩子 - 可以阻止主题停用
   */
  beforeDeactivate: async (theme: Theme) => {
    console.log(`⏸️ Minimal Theme: 准备停用主题 ${theme.name}`);
    
    // 检查是否可以停用
    return true;
  },

  /**
   * 停用后钩子 - 主题停用后执行
   */
  afterDeactivate: async (theme: Theme) => {
    console.log(`💤 Minimal Theme: 主题 ${theme.name} 已停用`);
    
    // 清理操作
  },

  /**
   * 删除前钩子 - 可以阻止主题删除
   */
  beforeDelete: async (theme: Theme) => {
    console.log(`🗑️ Minimal Theme: 准备删除主题 ${theme.name}`);
    
    // 可以在这里添加删除确认逻辑
    // 比如检查主题是否正在使用中
    if (theme.is_active) {
      console.warn(`⚠️ Minimal Theme: 主题 ${theme.name} 正在使用中，无法删除`);
      return false;
    }
    
    return true;
  },

  /**
   * 删除后钩子 - 主题删除后执行
   */
  afterDelete: async (themeId: string) => {
    console.log(`🧹 Minimal Theme: 主题 ${themeId} 已删除，执行清理操作`);
    
    // 清理主题相关的文件、缓存等
  },

  /**
   * 更新前钩子 - 可以修改更新数据
   */
  beforeUpdate: async (theme: Theme, updates: Partial<Theme>) => {
    console.log(`🔄 Minimal Theme: 准备更新主题 ${theme.name}`);
    
    // 可以在这里修改更新数据
    return {
      ...updates,
      updated_at: new Date().toISOString()
    };
  },

  /**
   * 更新后钩子 - 主题更新后执行
   */
  afterUpdate: async (theme: Theme) => {
    console.log(`✨ Minimal Theme: 主题 ${theme.name} 更新完成`);
    
    // 更新后的操作，比如清理缓存
  }
};

export default minimalThemeHooks;