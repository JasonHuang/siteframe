import { supabase } from '../supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { 
  Theme, 
  ThemeSetting, 
  CreateThemeInput, 
  UpdateThemeInput,
  CreateThemeSettingInput,
  UpdateThemeSettingInput,
  ThemeConfig,
  ThemeOperationResult
} from '../types/theme';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../types/database';

/**
 * 主题管理服务
 */
export class ThemeService {
  private supabase: SupabaseClient;

  constructor(supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || supabase;
  }

  /**
   * 获取所有主题
   */
  async getAllThemes(): Promise<ApiResponse<Theme[]>> {
    try {
      const { data, error } = await this.supabase
        .from('themes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      return { error: '获取主题列表失败' };
    }
  }

  /**
   * 分页获取主题
   */
  async getThemes(params: PaginationParams = {}): Promise<ApiResponse<PaginatedResponse<Theme>>> {
    try {
      const { page = 1, limit = 10, sort_by = 'created_at', sort_order = 'desc' } = params;
      const offset = (page - 1) * limit;

      // 获取总数
      const { count } = await this.supabase
        .from('themes')
        .select('*', { count: 'exact', head: true });

      // 获取数据
      const { data, error } = await this.supabase
        .from('themes')
        .select('*')
        .order(sort_by, { ascending: sort_order === 'asc' })
        .range(offset, offset + limit - 1);

      if (error) {
        return { error: error.message };
      }

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        data: {
          data: data || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            totalPages
          }
        }
      };
    } catch (error) {
      return { error: '获取主题列表失败' };
    }
  }

  /**
   * 根据ID获取主题
   */
  async getThemeById(id: string): Promise<ApiResponse<Theme>> {
    try {
      const { data, error } = await this.supabase
        .from('themes')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        return { error: error.message };
      }

      if (!data) {
        return { error: '主题不存在' };
      }

      return { data };
    } catch (error) {
      return { error: '获取主题详情失败' };
    }
  }

  /**
   * 根据名称获取主题
   */
  async getThemeByName(name: string): Promise<ApiResponse<Theme>> {
    try {
      console.log(`🔍 [ThemeService] 查询主题: ${name}`);
      
      const { data, error } = await this.supabase
        .from('themes')
        .select('*')
        .eq('name', name)
        .maybeSingle();

      console.log(`🔍 [ThemeService] Supabase查询结果:`);
      console.log(`  - error:`, error);
      console.log(`  - data:`, data);

      if (error) {
        console.error(`❌ [ThemeService] 查询错误:`, error);
        return { error: error.message };
      }

      if (!data) {
        console.log(`ℹ️ [ThemeService] 主题不存在: ${name}`);
        return { error: '主题不存在' };
      }

      console.log(`✅ [ThemeService] 查询成功:`, data);
      return { data };
    } catch (error) {
      console.error(`❌ [ThemeService] 异常错误:`, error);
      return { error: '获取主题详情失败' };
    }
  }

  /**
   * 获取当前激活的主题
   */
  async getActiveTheme(): Promise<ApiResponse<Theme>> {
    try {
      const { data, error } = await this.supabase
        .from('themes')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        return { error: error.message };
      }

      if (!data) {
        return { error: '没有激活的主题' };
      }

      return { data };
    } catch (error) {
      return { error: '获取当前主题失败' };
    }
  }

  /**
   * 创建新主题
   */
  async createTheme(input: CreateThemeInput): Promise<ApiResponse<Theme>> {
    try {
      console.log(`💾 [ThemeService] 创建主题:`, JSON.stringify(input, null, 2));
      
      // 如果设置为激活主题，先取消其他激活主题
      if (input.is_active) {
        console.log(`🔄 [ThemeService] 取消其他激活主题`);
        const deactivateResult = await this.supabase
          .from('themes')
          .update({ is_active: false })
          .eq('is_active', true);
        console.log(`🔄 [ThemeService] 取消激活结果:`, deactivateResult);
      }

      const insertData = {
        name: input.name,
        display_name: input.display_name,
        description: input.description,
        version: input.version,
        author: input.author,
        preview_image: input.preview_image,
        is_active: input.is_active || false,
        is_system: input.is_system || false,
        config: input.config || {}
      };
      
      console.log(`💾 [ThemeService] 插入数据:`, JSON.stringify(insertData, null, 2));

      const { data, error } = await this.supabase
        .from('themes')
        .insert(insertData)
        .select()
        .single();

      console.log(`💾 [ThemeService] 插入结果:`);
      console.log(`  - error:`, error);
      console.log(`  - data:`, data);

      if (error) {
        console.error(`❌ [ThemeService] 创建错误:`, error);
        return { error: error.message };
      }

      console.log(`✅ [ThemeService] 创建成功:`, data);
      return { data, message: '主题创建成功' };
    } catch (error) {
      console.error(`❌ [ThemeService] 异常错误:`, error);
      return { error: '创建主题失败' };
    }
  }

  /**
   * 更新主题
   */
  async updateTheme(id: string, input: UpdateThemeInput): Promise<ApiResponse<Theme>> {
    try {
      // 如果设置为激活主题，先取消其他激活主题
      if (input.is_active) {
        await this.supabase
          .from('themes')
          .update({ is_active: false })
          .eq('is_active', true)
          .neq('id', id);
      }

      const { data, error } = await this.supabase
        .from('themes')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data, message: '主题更新成功' };
    } catch (error) {
      return { error: '更新主题失败' };
    }
  }

  /**
   * 删除主题
   */
  async deleteTheme(id: string): Promise<ThemeOperationResult> {
    try {
      // 检查是否为系统主题
      const { data: theme, error: fetchError } = await this.supabase
        .from('themes')
        .select('is_system, is_active')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        return { success: false, message: fetchError.message };
      }

      if (!theme) {
        return { success: false, message: '主题不存在' };
      }

      if (theme.is_system) {
        return { success: false, message: '系统主题不能删除' };
      }

      if (theme.is_active) {
        return { success: false, message: '激活主题不能删除，请先切换到其他主题' };
      }

      const { error } = await this.supabase
        .from('themes')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: '主题删除成功' };
    } catch (error) {
      return { success: false, message: '删除主题失败' };
    }
  }

  /**
   * 激活主题
   */
  async activateTheme(id: string): Promise<ThemeOperationResult> {
    try {
      // 先取消所有主题的激活状态
      await this.supabase
        .from('themes')
        .update({ is_active: false })
        .eq('is_active', true);

      // 激活指定主题
      const { error } = await this.supabase
        .from('themes')
        .update({ is_active: true })
        .eq('id', id);

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: '主题激活成功' };
    } catch (error) {
      return { success: false, message: '激活主题失败' };
    }
  }

  /**
   * 获取主题设置
   */
  async getThemeSettings(themeId: string): Promise<ApiResponse<ThemeSetting[]>> {
    try {
      const { data, error } = await this.supabase
        .from('theme_settings')
        .select('*')
        .eq('theme_id', themeId)
        .order('display_order', { ascending: true });

      if (error) {
        return { error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      return { error: '获取主题设置失败' };
    }
  }

  /**
   * 创建主题设置
   */
  async createThemeSetting(input: CreateThemeSettingInput): Promise<ApiResponse<ThemeSetting>> {
    try {
      const { data, error } = await this.supabase
        .from('theme_settings')
        .insert(input)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data, message: '主题设置创建成功' };
    } catch (error) {
      return { error: '创建主题设置失败' };
    }
  }

  /**
   * 更新主题设置
   */
  async updateThemeSetting(id: string, input: UpdateThemeSettingInput): Promise<ApiResponse<ThemeSetting>> {
    try {
      const { data, error } = await this.supabase
        .from('theme_settings')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data, message: '主题设置更新成功' };
    } catch (error) {
      return { error: '更新主题设置失败' };
    }
  }

  /**
   * 删除主题设置
   */
  async deleteThemeSetting(id: string): Promise<ThemeOperationResult> {
    try {
      const { error } = await this.supabase
        .from('theme_settings')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: '主题设置删除成功' };
    } catch (error) {
      return { success: false, message: '删除主题设置失败' };
    }
  }

  /**
   * 批量更新主题设置
   */
  async updateThemeSettings(themeId: string, settings: Record<string, any>): Promise<ThemeOperationResult> {
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        theme_id: themeId,
        setting_key: key,
        setting_value: value
      }));

      const { error } = await this.supabase
        .from('theme_settings')
        .upsert(updates, { onConflict: 'theme_id,setting_key' });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: '主题设置更新成功' };
    } catch (error) {
      return { success: false, message: '批量更新主题设置失败' };
    }
  }

  /**
   * 获取主题完整配置（包含设置）
   */
  async getThemeConfig(themeId: string): Promise<ApiResponse<ThemeConfig>> {
    try {
      const [themeResult, settingsResult] = await Promise.all([
        this.getThemeById(themeId),
        this.getThemeSettings(themeId)
      ]);

      if (themeResult.error) {
        return { error: themeResult.error };
      }

      if (settingsResult.error) {
        return { error: settingsResult.error };
      }

      const theme = themeResult.data!;
      const settings = settingsResult.data!;

      // 合并主题配置和设置
      const config: ThemeConfig = { ...(theme as any).config };
      
      // 将设置转换为配置格式
      settings.forEach((setting: ThemeSetting) => {
        const keys = setting.setting_key.split('.');
        let current = config as any;
        
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (key && !current[key]) {
            current[key] = {};
          }
          if (key) {
            current = current[key];
          }
        }
        
        const lastKey = keys[keys.length - 1];
        if (lastKey) {
          current[lastKey] = setting.setting_value;
        }
      });

      return { data: config };
    } catch (error) {
      return { error: '获取主题配置失败' };
    }
  }

  /**
   * 导出主题
   */
  async exportTheme(themeId: string): Promise<ApiResponse<any>> {
    try {
      const [themeResult, settingsResult] = await Promise.all([
        this.getThemeById(themeId),
        this.getThemeSettings(themeId)
      ]);

      if (themeResult.error) {
        return { error: themeResult.error };
      }

      if (settingsResult.error) {
        return { error: settingsResult.error };
      }

      const theme = themeResult.data!;
      const settings = settingsResult.data!;

      const exportData = {
        theme: {
          name: theme.name,
          display_name: theme.display_name,
          description: theme.description,
          version: (theme as any).version || '1.0.0',
          author: (theme as any).author || 'Unknown',
          config: (theme as any).config || {}
        },
        settings: settings.map((s: ThemeSetting) => ({
          setting_key: s.setting_key,
          setting_value: s.setting_value,
          setting_type: s.setting_type,
          is_customizable: (s as any).is_customizable || true,
          display_order: (s as any).display_order || 0,
          description: s.description
        })),
        version: '1.0.0',
        exportedAt: new Date().toISOString()
      };

      return { data: exportData };
    } catch (error) {
      return { error: '导出主题失败' };
    }
  }
}

// 创建单例实例
export const themeService = new ThemeService();