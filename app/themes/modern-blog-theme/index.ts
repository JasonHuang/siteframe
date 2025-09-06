/**
 * Modern Blog Theme - 现代博客主题
 * 一个现代化、响应式的博客主题
 */

// 主题基本信息
const theme = {
  name: 'modern-blog-theme',
  version: '1.0.0',
  description: '一个现代化、响应式的博客主题，适用于个人博客和内容网站',
  author: 'SiteFrame Team',
  
  // 设计令牌
  tokens: {
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b'
    },
    fontFamilies: {
      sans: 'Inter, sans-serif',
      serif: 'Georgia, serif'
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem'
    }
  },
  
  // 组件配置
  components: {
    layouts: {
      DefaultLayout: 'DefaultLayout',
      PostLayout: 'PostLayout'
    },
    blocks: {
      Header: 'Header',
      Footer: 'Footer',
      Navigation: 'Navigation'
    },
    widgets: {
      PostCard: 'PostCard',
      TagCloud: 'TagCloud'
    }
  },
  
  // 配置选项
  config: {
    site: {
      title: '我的博客',
      description: '一个现代化的博客网站'
    },
    layout: {
      header: {
        enabled: true,
        sticky: true
      },
      footer: {
        enabled: true,
        columns: 3
      }
    },
    styles: {
      theme: 'light',
      primaryColor: '#3b82f6'
    }
  },
  
  // 功能特性
  features: {
    responsive: true,
    darkMode: true,
    customization: true,
    seo: true,
    performance: true
  }
};

export default theme;