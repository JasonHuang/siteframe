/**
 * Default Configuration - 默认配置
 * 定义主题的默认配置选项
 */

import { ThemeConfig } from '../../../../../lib/types/modern-theme';

const defaultConfig: ThemeConfig = {
  site: {
    title: 'Modern Blog',
    description: '一个现代化的博客网站',
    logo: '/images/logo.png',
    favicon: '/favicon.ico'
  },
  
  layout: {
    header: {
      enabled: true,
      sticky: true,
      transparent: false
    },
    footer: {
      enabled: true,
      columns: 4
    },
    sidebar: {
      enabled: false,
      position: 'right' as const,
      width: '320px'
    }
  },
  
  styles: {
    theme: 'light' as const,
    primaryColor: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: '16px'
  },
  
  features: {
    search: true,
    comments: true,
    newsletter: true,
    analytics: false
  },
  
  custom: {}
};

export default defaultConfig;