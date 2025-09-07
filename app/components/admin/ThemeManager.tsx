'use client';

import { useState, useEffect } from 'react';
import type { UnifiedTheme } from '../../lib/types/unified-theme';
import type { ThemeOperationResult } from '../../lib/types/theme';
import ThemeSelector from './ThemeSelector';
import ThemeCustomizer from './ThemeCustomizer';
import { authenticatedPost, authenticatedGet } from '@/lib/utils/api';

interface ThemeManagerProps {
  className?: string;
}

export default function ThemeManager({ className = '' }: ThemeManagerProps) {
  const [themes, setThemes] = useState<UnifiedTheme[]>([]);
  const [activeTheme, setActiveTheme] = useState<UnifiedTheme | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<UnifiedTheme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'selector' | 'customizer'>('selector');
  const [isActivating, setIsActivating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 加载主题数据
  const loadThemes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 通过API获取主题数据
      const response = await authenticatedGet('/api/admin/themes');
      const result = await response.json();
      
      if (response.ok && result.success) {
        const allThemes = result.data || [];
        const activeTheme = allThemes.find((theme: UnifiedTheme) => theme.is_active) || null;
        
        setThemes(allThemes);
        setActiveTheme(activeTheme);
        setSelectedTheme(activeTheme);
      } else {
        setError(result.error || '加载主题数据失败');
      }
    } catch (err) {
      setError('加载主题数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 激活主题
  const handleActivateTheme = async (themeId: string) => {
    setIsActivating(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await authenticatedPost(`/api/admin/themes/${themeId}/activate`);
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        await loadThemes(); // 重新加载数据
        setSuccessMessage(result.message || '主题激活成功');
        setError(null);
        
        // 3秒后清除成功消息
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError(result.error || result.message || '激活主题失败');
      }
    } catch (err) {
      setError('激活主题失败');
    } finally {
      setIsActivating(false);
    }
  };

  // 删除主题
  const handleDeleteTheme = async (themeId: string) => {
    if (!confirm('确定要删除这个主题吗？此操作不可撤销。')) {
      return;
    }

    try {
      const response = await authenticatedPost(`/api/admin/themes/${themeId}/delete`, {});
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || '删除主题失败');
      }
      
      await loadThemes(); // 重新加载数据
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除主题失败');
    }
  };

  // 导出主题
  const handleExportTheme = async (themeId: string) => {
    try {
      const response = await authenticatedGet(`/api/admin/themes/${themeId}`);
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        setError(result.error || '主题不存在');
        return;
      }
      
      const theme = result.data;

      // 下载导出的主题文件
      const blob = new Blob([JSON.stringify(theme, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `theme-${theme.name}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('导出主题失败');
    }
  };



  // 主题选择变化
  const handleThemeSelect = (theme: UnifiedTheme) => {
    setSelectedTheme(theme);
    setActiveTab('customizer');
  };

  // 主题更新后的回调
  const handleThemeUpdate = async () => {
    await loadThemes();
  };

  useEffect(() => {
    loadThemes();
  }, []);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">加载主题数据...</span>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* 头部 */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">主题管理</h2>
            <p className="text-sm text-gray-600 mt-1">
              管理网站主题，自定义外观和样式
            </p>
          </div>
          
          {/* 当前激活主题 */}
          {activeTheme && (
            <div className="text-right">
              <p className="text-sm text-gray-600">当前主题</p>
              <p className="font-medium text-gray-900">{activeTheme.display_name}</p>
            </div>
          )}
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 text-sm underline ml-2"
            >
              关闭
            </button>
          </div>
        )}
        
        {/* 成功提示 */}
        {successMessage && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* 标签页 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('selector')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'selector'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            主题选择
          </button>
          <button
            onClick={() => setActiveTab('customizer')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'customizer'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            disabled={!selectedTheme}
          >
            主题定制
            {selectedTheme && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedTheme.display_name}
              </span>
            )}
          </button>

        </nav>
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        {activeTab === 'selector' && (
          <ThemeSelector
            themes={themes}
            activeTheme={activeTheme}
            onThemeSelect={handleThemeSelect}
            onThemeActivate={handleActivateTheme}
            onThemeDelete={handleDeleteTheme}
            onThemeExport={handleExportTheme}
            isActivating={isActivating}
          />
        )}
        
        {activeTab === 'customizer' && selectedTheme && (
          <ThemeCustomizer
            theme={selectedTheme}
            onThemeUpdate={handleThemeUpdate}
          />
        )}
        
        {activeTab === 'customizer' && !selectedTheme && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">选择一个主题进行定制</h3>
            <p className="text-gray-600">请先在主题选择页面选择一个主题，然后返回此页面进行定制。</p>
            <button
              onClick={() => setActiveTab('selector')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              选择主题
            </button>
          </div>
        )}

      </div>
    </div>
  );
}