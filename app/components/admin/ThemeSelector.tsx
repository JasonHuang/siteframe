'use client';

import { useState } from 'react';
import type { UnifiedTheme } from '../../lib/types/unified-theme';
import ThemePreview from './ThemePreview';

interface ThemeSelectorProps {
  themes: UnifiedTheme[];
  activeTheme: UnifiedTheme | null;
  onThemeSelect: (theme: UnifiedTheme) => void;
  onThemeActivate: (themeId: string) => void;
  onThemeDelete: (themeId: string) => void;
  onThemeExport: (themeId: string) => void;
  isActivating?: boolean;
}

export default function ThemeSelector({
  themes,
  activeTheme,
  onThemeSelect,
  onThemeActivate,
  onThemeDelete,
  onThemeExport,
  isActivating = false
}: ThemeSelectorProps) {
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  const handleThemeClick = (theme: UnifiedTheme) => {
    setSelectedThemeId(theme.id);
    onThemeSelect(theme);
  };

  const handleActivate = (e: React.MouseEvent, themeId: string) => {
    e.stopPropagation();
    onThemeActivate(themeId);
  };

  const handleDelete = (e: React.MouseEvent, themeId: string) => {
    e.stopPropagation();
    onThemeDelete(themeId);
  };

  const handleExport = (e: React.MouseEvent, themeId: string) => {
    e.stopPropagation();
    onThemeExport(themeId);
  };

  if (themes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无主题</h3>
        <p className="text-gray-600">还没有安装任何主题，请先创建或导入主题。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 操作栏 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">可用主题</h3>
        <p className="text-sm text-gray-600">选择并管理网站主题</p>
      </div>

      {/* 主题网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {themes.map((theme) => {
          const isActive = activeTheme?.id === theme.id;
          const isSelected = selectedThemeId === theme.id;
          const isSystem = (theme as any).is_system;
          
          return (
            <div
              key={theme.id}
              onClick={() => handleThemeClick(theme)}
              className={`relative bg-white border-2 rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                isActive
                  ? 'border-green-500 bg-green-50'
                  : isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* 状态标识 */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {isActive && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      激活中
                    </span>
                  )}
                  
                  {isSystem && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      系统
                    </span>
                  )}
                </div>
                
                {/* 操作菜单 */}
                <div className="relative">
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 主题截图 */}
              <div className="mb-2 relative overflow-hidden rounded-md bg-gray-100">
                {(theme as any).screenshot ? (
                  <img 
                    src={(theme as any).screenshot} 
                    alt={`${theme.display_name} 截图`}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center">
                      <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-gray-500">暂无截图</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 主题基本信息 */}
              <div className="mb-2">
                <h4 className="font-medium text-gray-900 text-sm mb-1">{theme.display_name}</h4>
                <p className="text-xs text-gray-500">
                  v{(theme as any).version || '1.0.0'} • {(theme as any).author || '未知作者'}
                </p>
              </div>

              {/* 操作按钮 */}
              <div className="flex space-x-1">
                {!isActive && (
                  <button
                    onClick={(e) => handleActivate(e, theme.id)}
                    disabled={isActivating}
                    className={`flex-1 px-2 py-1.5 text-xs font-medium text-white rounded transition-colors flex items-center justify-center ${
                      isActivating 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isActivating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        激活中
                      </>
                    ) : (
                      '激活'
                    )}
                  </button>
                )}
                
                <button
                  onClick={(e) => handleExport(e, theme.id)}
                  className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                  title="导出主题"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </button>
                
                {!isSystem && !isActive && (
                  <button
                    onClick={(e) => handleDelete(e, theme.id)}
                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                    title="删除主题"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 主题统计 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{themes.length}</div>
            <div className="text-sm text-gray-600">总主题数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {themes.filter(t => (t as any).is_active).length}
            </div>
            <div className="text-sm text-gray-600">激活主题</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {themes.filter(t => (t as any).is_system).length}
            </div>
            <div className="text-sm text-gray-600">系统主题</div>
          </div>
        </div>
      </div>
    </div>
  );
}