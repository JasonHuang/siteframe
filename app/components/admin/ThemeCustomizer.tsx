'use client';

import { useState, useEffect } from 'react';
import type { UnifiedTheme, UnifiedThemeConfig } from '../../lib/types/unified-theme';
import type { ThemeSetting } from '../../lib/types/theme';
import { authenticatedGet, authenticatedPut } from '@/lib/utils/api';

interface ThemeCustomizerProps {
  theme: UnifiedTheme;
  onThemeUpdate: () => void;
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
}

function ColorPicker({ label, value, onChange, description }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="#000000"
        />
      </div>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  placeholder?: string;
  type?: 'text' | 'number';
}

function InputField({ label, value, onChange, description, placeholder, type = 'text' }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
      />
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}

export default function ThemeCustomizer({ theme, onThemeUpdate }: ThemeCustomizerProps) {
  const [config, setConfig] = useState<UnifiedThemeConfig>({});
  const [settings, setSettings] = useState<ThemeSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'colors' | 'typography' | 'layout' | 'advanced'>('colors');

  // 加载主题配置
  const loadThemeConfig = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 通过API获取主题配置
      const response = await authenticatedGet(`/api/admin/themes/${theme.id}`);
      const result = await response.json();
      
      if (response.ok && result.success) {
        setConfig(result.data.config || {});
        // 统一主题暂时不支持 settings，使用空数组
        setSettings([]);
      } else {
        setError(result.error || '主题不存在');
      }
    } catch (err) {
      setError('加载主题配置失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 保存主题配置
  const saveThemeConfig = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      // 通过API更新主题配置
      const response = await authenticatedPut(`/api/admin/themes/${theme.id}`, {
        config
      });
      
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || '更新主题配置失败');
      }

      // 更新成功，无需检查错误

      // 批量更新设置
      const settingsData: Record<string, any> = {};
      
      // 将配置转换为设置格式
      if (config.colors) {
        Object.entries(config.colors).forEach(([key, value]) => {
          if (typeof value === 'string') {
            settingsData[`colors.${key}`] = value;
          } else if (typeof value === 'object' && value !== null) {
            Object.entries(value as Record<string, any>).forEach(([subKey, subValue]) => {
              settingsData[`colors.${key}.${subKey}`] = subValue;
            });
          }
        });
      }

      if (config.typography) {
        Object.entries(config.typography).forEach(([key, value]) => {
          if (typeof value === 'string') {
            settingsData[`typography.${key}`] = value;
          } else if (typeof value === 'object' && value !== null) {
            Object.entries(value as Record<string, any>).forEach(([subKey, subValue]) => {
              settingsData[`typography.${key}.${subKey}`] = subValue;
            });
          }
        });
      }

      if (config.layout) {
        Object.entries(config.layout).forEach(([key, value]) => {
          settingsData[`layout.${key}`] = value;
        });
      }

      // 统一主题服务暂时不支持单独的设置更新
      // 设置已包含在配置中

      onThemeUpdate();
    } catch (err) {
      setError('保存主题配置失败');
    } finally {
      setIsSaving(false);
    }
  };

  // 重置配置
  const resetConfig = () => {
    if (confirm('确定要重置所有配置吗？此操作不可撤销。')) {
      loadThemeConfig();
    }
  };

  // 更新颜色配置
  const updateColor = (path: string, value: string) => {
    const newConfig = { ...config };
    const keys = path.split('.');
    let current = newConfig as any;
    
    // 确保路径存在
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!key) continue;
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
    
    const lastKey = keys[keys.length - 1];
    if (lastKey) {
      current[lastKey] = value;
    }
    setConfig(newConfig);
  };

  // 更新其他配置
  const updateConfig = (path: string, value: any) => {
    const newConfig = { ...config };
    const keys = path.split('.');
    let current = newConfig as any;
    
    // 确保路径存在
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!key) continue;
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
    
    const lastKey = keys[keys.length - 1];
    if (lastKey) {
      current[lastKey] = value;
    }
    setConfig(newConfig);
  };

  useEffect(() => {
    loadThemeConfig();
  }, [theme.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">加载主题配置...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">定制主题: {theme.display_name}</h3>
          <p className="text-sm text-gray-600">自定义主题的外观和样式</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={resetConfig}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            重置
          </button>
          
          <button
            onClick={saveThemeConfig}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? '保存中...' : '保存配置'}
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 text-sm underline ml-2"
          >
            关闭
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 侧边栏导航 */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {[
              { id: 'colors', name: '颜色配置', icon: '🎨' },
              { id: 'typography', name: '字体配置', icon: '📝' },
              { id: 'layout', name: '布局配置', icon: '📐' },
              { id: 'advanced', name: '高级配置', icon: '⚙️' }
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.name}
              </button>
            ))}
          </nav>
        </div>

        {/* 配置面板 */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            {/* 颜色配置 */}
            {activeSection === 'colors' && (
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">颜色配置</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ColorPicker
                    label="主色调"
                    value={(config.colors?.primary as string) || '#3b82f6'}
                    onChange={(value) => updateColor('colors.primary', value)}
                    description="网站的主要品牌色彩"
                  />
                  
                  <ColorPicker
                    label="次要色调"
                    value={(config.colors?.secondary as string) || '#64748b'}
                    onChange={(value) => updateColor('colors.secondary', value)}
                    description="辅助色彩，用于次要元素"
                  />
                  
                  <ColorPicker
                    label="强调色"
                    value={(config.colors?.accent as string) || '#f59e0b'}
                    onChange={(value) => updateColor('colors.accent', value)}
                    description="用于突出重要内容"
                  />
                  
                  <ColorPicker
                    label="背景色"
                    value={(config.colors?.background as string) || '#ffffff'}
                    onChange={(value) => updateColor('colors.background', value)}
                    description="页面主背景色"
                  />
                  
                  <ColorPicker
                    label="表面色"
                    value={(config.colors?.surface as string) || '#f8fafc'}
                    onChange={(value) => updateColor('colors.surface', value)}
                    description="卡片和面板背景色"
                  />
                  
                  <ColorPicker
                    label="主要文本色"
                    value={(config.colors?.text?.primary as string) || '#1e293b'}
                    onChange={(value) => updateColor('colors.text.primary', value)}
                    description="主要文本颜色"
                  />
                </div>
              </div>
            )}

            {/* 字体配置 */}
            {activeSection === 'typography' && (
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">字体配置</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="无衬线字体"
                    value={(config.typography?.fontFamily?.sans as string) || 'Inter, sans-serif'}
                    onChange={(value) => updateConfig('typography.fontFamily.sans', value)}
                    description="用于界面和正文的字体"
                    placeholder="Inter, sans-serif"
                  />
                  
                  <InputField
                    label="等宽字体"
                    value={(config.typography?.fontFamily?.mono as string) || 'Monaco, monospace'}
                    onChange={(value) => updateConfig('typography.fontFamily.mono', value)}
                    description="用于代码显示的字体"
                    placeholder="Monaco, monospace"
                  />
                  
                  <InputField
                    label="基础字号"
                    value={(config.typography?.fontSize?.base as string) || '16px'}
                    onChange={(value) => updateConfig('typography.fontSize.base', value)}
                    description="页面基础字体大小"
                    placeholder="16px"
                  />
                  
                  <InputField
                    label="大标题字号"
                    value={(config.typography?.fontSize?.['2xl'] as string) || '1.5rem'}
                    onChange={(value) => updateConfig('typography.fontSize.2xl', value)}
                    description="大标题字体大小"
                    placeholder="1.5rem"
                  />
                </div>
              </div>
            )}

            {/* 布局配置 */}
            {activeSection === 'layout' && (
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">布局配置</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="最大宽度"
                    value={(config.layout?.maxWidth as string) || '1200px'}
                    onChange={(value) => updateConfig('layout.maxWidth', value)}
                    description="内容区域最大宽度"
                    placeholder="1200px"
                  />
                  
                  <InputField
                    label="容器内边距"
                    value={(config.layout?.containerPadding as string) || '1rem'}
                    onChange={(value) => updateConfig('layout.containerPadding', value)}
                    description="容器内部间距"
                    placeholder="1rem"
                  />
                  
                  <InputField
                    label="头部高度"
                    value={(config.layout?.headerHeight as string) || '64px'}
                    onChange={(value) => updateConfig('layout.headerHeight', value)}
                    description="页面头部高度"
                    placeholder="64px"
                  />
                  
                  <InputField
                    label="侧边栏宽度"
                    value={(config.layout?.sidebarWidth as string) || '256px'}
                    onChange={(value) => updateConfig('layout.sidebarWidth', value)}
                    description="侧边栏宽度"
                    placeholder="256px"
                  />
                </div>
              </div>
            )}

            {/* 高级配置 */}
            {activeSection === 'advanced' && (
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">高级配置</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      自定义 CSS
                    </label>
                    <textarea
                      value={(config.custom?.css as string) || ''}
                      onChange={(e) => updateConfig('custom.css', e.target.value)}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="/* 在这里添加自定义 CSS */"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      添加自定义 CSS 样式来进一步定制主题外观
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      配置 JSON
                    </label>
                    <textarea
                      value={JSON.stringify(config, null, 2)}
                      onChange={(e) => {
                        try {
                          const newConfig = JSON.parse(e.target.value);
                          setConfig(newConfig);
                        } catch (err) {
                          // 忽略无效的 JSON
                        }
                      }}
                      rows={12}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      直接编辑主题配置 JSON（请谨慎操作）
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}