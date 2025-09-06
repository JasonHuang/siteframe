import type { ThemeHooks } from '../../lib/services/theme-hooks';
import type { Theme, CreateThemeInput } from '../../lib/types/theme';

/**
 * 测试自动检测主题的钩子
 * 验证钩子系统是否正常工作
 */
const testAutoThemeHooks: ThemeHooks = {
  /**
   * 注册前钩子
   */
  beforeRegister: async (themeData: CreateThemeInput) => {
    console.log(`🧪 测试主题: 准备注册 ${themeData.name}`);
    
    // 添加测试标记
    return {
      ...themeData,
      description: themeData.description + ' [自动检测测试]',
      config: {
        ...themeData.config,
        custom: {
          autoDetected: true,
          detectedAt: new Date().toISOString()
        }
      }
    };
  },

  /**
   * 注册后钩子
   */
  afterRegister: async (theme: Theme) => {
    console.log(`✅ 测试主题: ${theme.name} 自动注册成功！`);
    console.log(`📊 主题ID: ${theme.id}`);
    console.log(`🎨 显示名称: ${theme.display_name}`);
  },

  /**
   * 激活前钩子
   */
  beforeActivate: async (theme: Theme) => {
    console.log(`🚀 测试主题: 准备激活 ${theme.name}`);
    return true;
  },

  /**
   * 激活后钩子
   */
  afterActivate: async (theme: Theme) => {
    console.log(`🎉 测试主题: ${theme.name} 已成功激活！`);
    console.log(`🌟 这证明了自动检测和钩子系统都在正常工作`);
  }
};

export default testAutoThemeHooks;