'use client';

import { useState, useEffect } from 'react';
import { themeService } from '../../lib/services/themes';
import type { Theme, ThemeOperationResult } from '../../lib/types/theme';
import ThemeSelector from './ThemeSelector';
import ThemeCustomizer from './ThemeCustomizer';
import { authenticatedPost, authenticatedGet } from '@/lib/utils/api';

interface ThemeManagerProps {
  className?: string;
}

export default function ThemeManager({ className = '' }: ThemeManagerProps) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'selector' | 'customizer' | 'scanner'>('selector');
  const [isActivating, setIsActivating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 加载主题数据
  const loadThemes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 首先自动检测并注册新主题
      try {
        const detectResponse = await authenticatedPost('/api/admin/themes/detect');
        
        if (detectResponse.ok) {
          const detectResult = await detectResponse.json();
          if (detectResult.data.registered > 0) {
            console.log('自动主题检测完成:', detectResult.message);
          }
        }
      } catch (detectError) {
        console.warn('自动主题检测失败:', detectError);
        // 检测失败不影响主题加载
      }
      
      // 然后加载主题数据
      const [themesResult, activeThemeResult] = await Promise.all([
        themeService.getAllThemes(),
        themeService.getActiveTheme()
      ]);

      if (themesResult.error) {
        setError(themesResult.error);
        return;
      }

      if (activeThemeResult.error) {
        setError(activeThemeResult.error);
        return;
      }

      setThemes(themesResult.data || []);
      setActiveTheme(activeThemeResult.data || null);
      setSelectedTheme(activeThemeResult.data || null);
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
      const result = await themeService.deleteTheme(themeId);
      
      if (result.success) {
        await loadThemes(); // 重新加载数据
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('删除主题失败');
    }
  };

  // 导出主题
  const handleExportTheme = async (themeId: string) => {
    try {
      const result = await themeService.exportTheme(themeId);
      
      if (result.error) {
        setError(result.error);
        return;
      }

      // 下载导出的主题文件
      const blob = new Blob([JSON.stringify(result.data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `theme-${result.data.theme.name}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('导出主题失败');
    }
  };

  // 扫描主题
  const handleScanThemes = async () => {
    setIsScanning(true);
    setError(null);
    setScanResult(null);
    
    try {
      const response = await authenticatedPost('/api/admin/themes/scan');
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '扫描失败');
      }
      
      setScanResult(result.data);
      
      // 重新加载主题列表
      await loadThemes();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '扫描主题失败');
    } finally {
      setIsScanning(false);
    }
  };

  // 主题选择变化
  const handleThemeSelect = (theme: Theme) => {
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
          <button
            onClick={() => setActiveTab('scanner')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'scanner'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            主题扫描
            {isScanning && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                扫描中
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
        
        {activeTab === 'scanner' && (
          <div className="max-w-4xl mx-auto">
            {/* 扫描器头部 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">主题自动发现</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    自动扫描 app/themes 目录，发现并注册新主题
                  </p>
                </div>
                <button
                  onClick={handleScanThemes}
                  disabled={isScanning}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isScanning ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      扫描中...
                    </>
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      扫描主题
                    </>
                  )}
                </button>
              </div>
              
              {/* 使用说明 */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">如何添加主题</h4>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>将主题文件夹放置在 <code className="bg-blue-100 px-1 rounded">app/themes/</code> 目录下</li>
                        <li>确保主题包含 <code className="bg-blue-100 px-1 rounded">package.json</code>、<code className="bg-blue-100 px-1 rounded">theme.json</code> 或 <code className="bg-blue-100 px-1 rounded">index.ts</code> 文件</li>
                        <li>点击"扫描主题"按钮自动发现并注册新主题</li>
                        <li>使用命令行: <code className="bg-blue-100 px-1 rounded">npm run theme:generate &lt;主题名&gt;</code> 快速创建主题模板</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 扫描结果 */}
            {scanResult && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">扫描结果</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">发现主题</p>
                        <p className="text-2xl font-bold text-blue-900">{scanResult.discovered}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">注册成功</p>
                        <p className="text-2xl font-bold text-green-900">{scanResult.registered}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-red-600">注册失败</p>
                        <p className="text-2xl font-bold text-red-900">{scanResult.errors.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 错误详情 */}
                {scanResult.errors.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-3">注册失败的主题</h5>
                    <div className="space-y-2">
                      {scanResult.errors.map((error: any, index: number) => (
                        <div key={index} className="bg-red-50 border border-red-200 rounded-md p-3">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h6 className="text-sm font-medium text-red-800">{error.theme}</h6>
                              <p className="text-sm text-red-700 mt-1">{error.error}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}