// 主题系统相关类型定义

/**
 * 主题基本信息
 */
export interface Theme {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  version?: string;
  author?: string;
  preview_image?: string;
  is_active: boolean;
  is_system?: boolean;
  config?: ThemeConfig;
  created_at: string;
  updated_at: string;
}

/**
 * 主题设置项
 */
export interface ThemeSetting {
  id: string;
  theme_id: string;
  setting_key: string;
  setting_value: any; // JSONB 类型，可以是任意 JSON 值
  setting_type: 'color' | 'font' | 'spacing' | 'layout' | 'custom';
  description?: string;
  created_at: string;
  updated_at: string;
}

/**
 * 主题配置对象
 */
export interface ThemeConfig {
  // 颜色配置
  colors?: {
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
  };
  
  // 字体配置
  typography?: {
    fontFamily?: {
      sans?: string;
      serif?: string;
      mono?: string;
    };
    fontSize?: {
      xs?: string;
      sm?: string;
      base?: string;
      lg?: string;
      xl?: string;
      '2xl'?: string;
      '3xl'?: string;
      '4xl'?: string;
    };
    fontWeight?: {
      light?: number;
      normal?: number;
      medium?: number;
      semibold?: number;
      bold?: number;
    };
    lineHeight?: {
      tight?: number;
      normal?: number;
      relaxed?: number;
    };
  };
  
  // 间距配置
  spacing?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
    '3xl'?: string;
  };
  
  // 圆角配置
  borderRadius?: {
    none?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    full?: string;
  };
  
  // 阴影配置
  shadows?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  
  // 布局配置
  layout?: {
    maxWidth?: string;
    containerPadding?: string;
    headerHeight?: string;
    sidebarWidth?: string;
  };
  
  // 自定义配置
  custom?: Record<string, any>;
}

/**
 * 主题创建输入
 */
export interface CreateThemeInput {
  name: string;
  display_name: string;
  description?: string;
  version?: string;
  author?: string;
  preview_image?: string;
  is_active?: boolean;
  is_system?: boolean;
  config?: ThemeConfig;
}

/**
 * 主题更新输入
 */
export interface UpdateThemeInput {
  display_name?: string;
  description?: string;
  is_active?: boolean;
  config?: Partial<ThemeConfig>;
}

/**
 * 主题设置创建输入
 */
export interface CreateThemeSettingInput {
  theme_id: string;
  setting_key: string;
  setting_value: any;
  setting_type: 'color' | 'font' | 'spacing' | 'layout' | 'custom';
  description?: string;
}

/**
 * 主题设置更新输入
 */
export interface UpdateThemeSettingInput {
  setting_value?: any;
  setting_type?: 'color' | 'font' | 'spacing' | 'layout' | 'custom';
  description?: string;
}

/**
 * 主题应用状态
 */
export interface ThemeState {
  currentTheme: Theme | null;
  availableThemes: Theme[];
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
 * 主题预览配置
 */
export interface ThemePreview {
  theme: Theme;
  config: ThemeConfig;
  previewUrl?: string;
}

/**
 * 主题导入/导出格式
 */
export interface ThemeExport {
  theme: Omit<Theme, 'id' | 'created_at' | 'updated_at'>;
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
 * 主题管理权限
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