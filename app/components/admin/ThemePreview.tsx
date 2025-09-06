'use client';

import { useState, useEffect } from 'react';
import type { Theme, ThemeConfig } from '../../lib/types/theme';

interface ThemePreviewProps {
  theme: Theme;
  config?: ThemeConfig;
  className?: string;
}

export default function ThemePreview({ theme, config, className = '' }: ThemePreviewProps) {
  const [previewConfig, setPreviewConfig] = useState<ThemeConfig>({});

  useEffect(() => {
    // 合并主题默认配置和自定义配置
    const defaultConfig = (theme as any).config || {};
    const mergedConfig = { ...defaultConfig, ...config };
    setPreviewConfig(mergedConfig);
  }, [theme, config]);

  // 生成预览样式
  const getPreviewStyles = () => {
    const colors = previewConfig.colors || {};
    const typography = previewConfig.typography || {};
    const layout = previewConfig.layout || {};

    return {
      backgroundColor: colors.background || '#ffffff',
      color: colors.text?.primary || '#1e293b',
      fontFamily: typography.fontFamily?.sans || 'Inter, sans-serif',
      fontSize: typography.fontSize?.base || '14px',
      maxWidth: layout.maxWidth || '100%',
      padding: layout.containerPadding || '1rem',
    };
  };

  const getHeaderStyles = () => {
    const colors = previewConfig.colors || {};
    const layout = previewConfig.layout || {};

    return {
      backgroundColor: colors.primary || '#3b82f6',
      color: '#ffffff',
      height: layout.headerHeight || '48px',
      padding: '0 1rem',
    };
  };

  const getButtonStyles = () => {
    const colors = previewConfig.colors || {};

    return {
      backgroundColor: colors.accent || colors.primary || '#3b82f6',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      cursor: 'pointer',
    };
  };

  const getCardStyles = () => {
    const colors = previewConfig.colors || {};

    return {
      backgroundColor: colors.surface || '#f8fafc',
      border: `1px solid ${colors.border || '#e2e8f0'}`,
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
    };
  };

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* 预览头部 */}
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">{theme.display_name}</h4>
          <span className="text-xs text-gray-500">预览</span>
        </div>
      </div>

      {/* 预览内容 */}
      <div className="relative" style={{ minHeight: '300px' }}>
        <div style={getPreviewStyles()} className="h-full">
          {/* 模拟头部 */}
          <div style={getHeaderStyles()} className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded"></div>
              <span className="font-medium">网站标题</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded"></div>
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded"></div>
            </div>
          </div>

          {/* 模拟内容区域 */}
          <div className="space-y-4">
            {/* 标题 */}
            <h1 className="text-2xl font-bold" style={{ 
              color: previewConfig.colors?.text?.primary || '#1e293b',
              fontFamily: previewConfig.typography?.fontFamily?.sans || 'Inter, sans-serif'
            }}>
              欢迎使用 {theme.display_name}
            </h1>

            {/* 描述文本 */}
            <p className="text-base leading-relaxed" style={{
              color: previewConfig.colors?.text?.secondary || '#64748b'
            }}>
              这是一个主题预览示例。您可以看到当前主题的颜色、字体和布局配置效果。
            </p>

            {/* 卡片示例 */}
            <div style={getCardStyles()}>
              <h3 className="text-lg font-semibold mb-2" style={{
                color: previewConfig.colors?.text?.primary || '#1e293b'
              }}>
                示例卡片
              </h3>
              <p className="text-sm mb-3" style={{
                color: previewConfig.colors?.text?.secondary || '#64748b'
              }}>
                这是一个示例卡片，展示了主题的表面颜色和文本样式。
              </p>
              <button style={getButtonStyles()}>
                示例按钮
              </button>
            </div>

            {/* 列表示例 */}
            <div style={getCardStyles()}>
              <h3 className="text-lg font-semibold mb-3" style={{
                color: previewConfig.colors?.text?.primary || '#1e293b'
              }}>
                功能列表
              </h3>
              <ul className="space-y-2">
                {['响应式设计', '自定义颜色', '灵活布局', '现代字体'].map((item, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: previewConfig.colors?.accent || '#f59e0b' }}
                    ></div>
                    <span className="text-sm" style={{
                      color: previewConfig.colors?.text?.secondary || '#64748b'
                    }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 按钮组示例 */}
            <div className="flex space-x-3">
              <button style={getButtonStyles()}>
                主要操作
              </button>
              <button style={{
                ...getButtonStyles(),
                backgroundColor: 'transparent',
                color: previewConfig.colors?.primary || '#3b82f6',
                border: `1px solid ${previewConfig.colors?.primary || '#3b82f6'}`
              }}>
                次要操作
              </button>
            </div>
          </div>
        </div>

        {/* 自定义 CSS 应用 */}
        {previewConfig.custom?.css && (
          <style dangerouslySetInnerHTML={{ __html: previewConfig.custom.css }} />
        )}
      </div>

      {/* 预览信息 */}
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>版本: {(theme as any).version || '1.0.0'}</span>
          <span>作者: {(theme as any).author || '未知'}</span>
        </div>
      </div>
    </div>
  );
}