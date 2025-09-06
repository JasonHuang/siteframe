import type { Theme, CreateThemeInput } from '../types/theme';
import { ThemeService } from './themes';

/**
 * 主题钩子接口
 * 主题可以实现这些钩子来自定义行为
 */
export interface ThemeHooks {
  /** 主题注册前调用 */
  beforeRegister?: (themeData: CreateThemeInput) => Promise<CreateThemeInput | void>;
  
  /** 主题注册后调用 */
  afterRegister?: (theme: Theme) => Promise<void>;
  
  /** 主题激活前调用 */
  beforeActivate?: (theme: Theme) => Promise<boolean>;
  
  /** 主题激活后调用 */
  afterActivate?: (theme: Theme) => Promise<void>;
  
  /** 主题停用前调用 */
  beforeDeactivate?: (theme: Theme) => Promise<boolean>;
  
  /** 主题停用后调用 */
  afterDeactivate?: (theme: Theme) => Promise<void>;
  
  /** 主题删除前调用 */
  beforeDelete?: (theme: Theme) => Promise<boolean>;
  
  /** 主题删除后调用 */
  afterDelete?: (themeId: string) => Promise<void>;
  
  /** 主题更新前调用 */
  beforeUpdate?: (theme: Theme, updates: Partial<Theme>) => Promise<Partial<Theme> | void>;
  
  /** 主题更新后调用 */
  afterUpdate?: (theme: Theme) => Promise<void>;
}

/**
 * 主题钩子管理器
 * 管理主题的生命周期钩子
 */
export class ThemeHookManager {
  private hooks: Map<string, ThemeHooks> = new Map();
  private globalHooks: ThemeHooks[] = [];

  /**
   * 注册主题特定的钩子
   */
  registerThemeHooks(themeName: string, hooks: ThemeHooks): void {
    this.hooks.set(themeName, hooks);
  }

  /**
   * 注册全局钩子（对所有主题生效）
   */
  registerGlobalHooks(hooks: ThemeHooks): void {
    this.globalHooks.push(hooks);
  }

  /**
   * 移除主题钩子
   */
  unregisterThemeHooks(themeName: string): void {
    this.hooks.delete(themeName);
  }

  /**
   * 执行注册前钩子
   */
  async executeBeforeRegister(themeData: CreateThemeInput): Promise<CreateThemeInput> {
    let modifiedData = { ...themeData };

    // 执行全局钩子
    for (const globalHook of this.globalHooks) {
      if (globalHook.beforeRegister) {
        const result = await globalHook.beforeRegister(modifiedData);
        if (result) {
          modifiedData = result;
        }
      }
    }

    // 执行主题特定钩子
    const themeHooks = this.hooks.get(themeData.name);
    if (themeHooks?.beforeRegister) {
      const result = await themeHooks.beforeRegister(modifiedData);
      if (result) {
        modifiedData = result;
      }
    }

    return modifiedData;
  }

  /**
   * 执行注册后钩子
   */
  async executeAfterRegister(theme: Theme): Promise<void> {
    // 执行全局钩子
    for (const globalHook of this.globalHooks) {
      if (globalHook.afterRegister) {
        await globalHook.afterRegister(theme);
      }
    }

    // 执行主题特定钩子
    const themeHooks = this.hooks.get(theme.name);
    if (themeHooks?.afterRegister) {
      await themeHooks.afterRegister(theme);
    }
  }

  /**
   * 执行激活前钩子
   */
  async executeBeforeActivate(theme: Theme): Promise<boolean> {
    // 执行全局钩子
    for (const globalHook of this.globalHooks) {
      if (globalHook.beforeActivate) {
        const canActivate = await globalHook.beforeActivate(theme);
        if (!canActivate) {
          return false;
        }
      }
    }

    // 执行主题特定钩子
    const themeHooks = this.hooks.get(theme.name);
    if (themeHooks?.beforeActivate) {
      const canActivate = await themeHooks.beforeActivate(theme);
      if (!canActivate) {
        return false;
      }
    }

    return true;
  }

  /**
   * 执行激活后钩子
   */
  async executeAfterActivate(theme: Theme): Promise<void> {
    // 执行全局钩子
    for (const globalHook of this.globalHooks) {
      if (globalHook.afterActivate) {
        await globalHook.afterActivate(theme);
      }
    }

    // 执行主题特定钩子
    const themeHooks = this.hooks.get(theme.name);
    if (themeHooks?.afterActivate) {
      await themeHooks.afterActivate(theme);
    }
  }

  /**
   * 执行停用前钩子
   */
  async executeBeforeDeactivate(theme: Theme): Promise<boolean> {
    // 执行全局钩子
    for (const globalHook of this.globalHooks) {
      if (globalHook.beforeDeactivate) {
        const canDeactivate = await globalHook.beforeDeactivate(theme);
        if (!canDeactivate) {
          return false;
        }
      }
    }

    // 执行主题特定钩子
    const themeHooks = this.hooks.get(theme.name);
    if (themeHooks?.beforeDeactivate) {
      const canDeactivate = await themeHooks.beforeDeactivate(theme);
      if (!canDeactivate) {
        return false;
      }
    }

    return true;
  }

  /**
   * 执行停用后钩子
   */
  async executeAfterDeactivate(theme: Theme): Promise<void> {
    // 执行全局钩子
    for (const globalHook of this.globalHooks) {
      if (globalHook.afterDeactivate) {
        await globalHook.afterDeactivate(theme);
      }
    }

    // 执行主题特定钩子
    const themeHooks = this.hooks.get(theme.name);
    if (themeHooks?.afterDeactivate) {
      await themeHooks.afterDeactivate(theme);
    }
  }

  /**
   * 执行删除前钩子
   */
  async executeBeforeDelete(theme: Theme): Promise<boolean> {
    // 执行全局钩子
    for (const globalHook of this.globalHooks) {
      if (globalHook.beforeDelete) {
        const canDelete = await globalHook.beforeDelete(theme);
        if (!canDelete) {
          return false;
        }
      }
    }

    // 执行主题特定钩子
    const themeHooks = this.hooks.get(theme.name);
    if (themeHooks?.beforeDelete) {
      const canDelete = await themeHooks.beforeDelete(theme);
      if (!canDelete) {
        return false;
      }
    }

    return true;
  }

  /**
   * 执行删除后钩子
   */
  async executeAfterDelete(themeId: string, themeName: string): Promise<void> {
    // 执行全局钩子
    for (const globalHook of this.globalHooks) {
      if (globalHook.afterDelete) {
        await globalHook.afterDelete(themeId);
      }
    }

    // 执行主题特定钩子
    const themeHooks = this.hooks.get(themeName);
    if (themeHooks?.afterDelete) {
      await themeHooks.afterDelete(themeId);
    }

    // 清理钩子
    this.hooks.delete(themeName);
  }

  /**
   * 执行更新前钩子
   */
  async executeBeforeUpdate(theme: Theme, updates: Partial<Theme>): Promise<Partial<Theme>> {
    let modifiedUpdates = { ...updates };

    // 执行全局钩子
    for (const globalHook of this.globalHooks) {
      if (globalHook.beforeUpdate) {
        const result = await globalHook.beforeUpdate(theme, modifiedUpdates);
        if (result) {
          modifiedUpdates = { ...modifiedUpdates, ...result };
        }
      }
    }

    // 执行主题特定钩子
    const themeHooks = this.hooks.get(theme.name);
    if (themeHooks?.beforeUpdate) {
      const result = await themeHooks.beforeUpdate(theme, modifiedUpdates);
      if (result) {
        modifiedUpdates = { ...modifiedUpdates, ...result };
      }
    }

    return modifiedUpdates;
  }

  /**
   * 执行更新后钩子
   */
  async executeAfterUpdate(theme: Theme): Promise<void> {
    // 执行全局钩子
    for (const globalHook of this.globalHooks) {
      if (globalHook.afterUpdate) {
        await globalHook.afterUpdate(theme);
      }
    }

    // 执行主题特定钩子
    const themeHooks = this.hooks.get(theme.name);
    if (themeHooks?.afterUpdate) {
      await themeHooks.afterUpdate(theme);
    }
  }

  /**
   * 自动加载主题钩子
   * 尝试从主题目录加载钩子文件
   */
  async autoLoadThemeHooks(themeName: string, themePath: string): Promise<void> {
    // 暂时禁用自动钩子加载以避免动态导入问题
    console.log(`ℹ️ 主题 ${themeName} 钩子加载已禁用`);
  }
}

// 全局钩子管理器实例
export const themeHookManager = new ThemeHookManager();

// 注册一些默认的全局钩子
themeHookManager.registerGlobalHooks({
  afterRegister: async (theme: Theme) => {
    console.log(`🎨 主题已注册: ${theme.display_name} (${theme.name})`);
  },
  
  afterActivate: async (theme: Theme) => {
    console.log(`✅ 主题已激活: ${theme.display_name}`);
  },
  
  afterDeactivate: async (theme: Theme) => {
    console.log(`⏸️ 主题已停用: ${theme.display_name}`);
  },
  
  afterDelete: async (themeId: string) => {
    console.log(`🗑️ 主题已删除: ${themeId}`);
  }
});