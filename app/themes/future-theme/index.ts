/**
 * Future Theme - 未来主题
 * 前瞻性设计的现代化主题
 */

import type { ModernTheme, ColorScale } from '../../lib/types/modern-theme';
import React from 'react';

// 简单的颜色比例定义
const createColorScale = (base: string): ColorScale => ({
  50: base + '10',
  100: base + '20', 
  200: base + '30',
  300: base + '40',
  400: base + '50',
  500: base,
  600: base + '60',
  700: base + '70',
  800: base + '80',
  900: base + '90',
  950: base + '95'
});

// 临时组件定义
const TempComponent: React.FC = () => React.createElement('div', { children: '组件加载中...' });

// 主题定义
const theme: ModernTheme = {
  metadata: {
    name: 'future-theme',
    version: '1.0.0',
    description: '前瞻性设计的现代化主题，展现未来科技感',
    author: 'SiteFrame Team',
    homepage: 'https://siteframe.dev',
    license: 'MIT',
    tags: ['future', 'modern', 'responsive', 'tech'],
    compatibility: {
      minVersion: '1.0.0'
    }
  },
  
  components: {
    layouts: {
      DefaultLayout: TempComponent,
      PostLayout: TempComponent
    },
    blocks: {
      Header: TempComponent,
      Footer: TempComponent,
      Navigation: TempComponent,
      HeroSection: TempComponent,
      Features: TempComponent,
      About: TempComponent,
      Services: TempComponent,
      Testimonials: TempComponent,
      Contact: TempComponent
    },
    widgets: {
      PostCard: TempComponent,
      TagCloud: TempComponent
    }
  },
  
  componentMeta: {
    layouts: {
      DefaultLayout: {
        name: 'DefaultLayout',
        displayName: '默认布局',
        description: '标准的页面布局',
        category: 'layout'
      },
      PostLayout: {
        name: 'PostLayout',
        displayName: '文章布局',
        description: '专为文章页面设计的布局',
        category: 'layout'
      }
    },
    blocks: {
      Header: {
        name: 'Header',
        displayName: '页头',
        description: '网站头部区域',
        category: 'block'
      },
      Footer: {
        name: 'Footer',
        displayName: '页脚',
        description: '网站底部区域',
        category: 'block'
      },
      Navigation: {
        name: 'Navigation',
        displayName: '导航',
        description: '网站导航菜单',
        category: 'block'
      },
      HeroSection: {
        name: 'HeroSection',
        displayName: '英雄区域',
        description: '主要展示区域',
        category: 'block'
      },
      Features: {
        name: 'Features',
        displayName: '功能特性',
        description: '功能特性展示',
        category: 'block'
      },
      About: {
        name: 'About',
        displayName: '关于我们',
        description: '关于我们区域',
        category: 'block'
      },
      Services: {
        name: 'Services',
        displayName: '服务',
        description: '服务展示区域',
        category: 'block'
      },
      Testimonials: {
        name: 'Testimonials',
        displayName: '客户评价',
        description: '客户评价展示',
        category: 'block'
      },
      Contact: {
        name: 'Contact',
        displayName: '联系我们',
        description: '联系我们区域',
        category: 'block'
      }
    },
    widgets: {
      PostCard: {
        name: 'PostCard',
        displayName: '文章卡片',
        description: '显示文章信息的卡片组件',
        category: 'widget'
      },
      TagCloud: {
        name: 'TagCloud',
        displayName: '标签云',
        description: '显示标签的云状组件',
        category: 'widget'
      }
    }
  },
  
  styles: {
    tokens: {
      colors: {
        primary: createColorScale('#3b82f6'),
        secondary: createColorScale('#64748b'),
        accent: createColorScale('#f59e0b'),
        neutral: createColorScale('#64748b'),
        semantic: {
          success: createColorScale('#10b981'),
          warning: createColorScale('#f59e0b'),
          error: createColorScale('#ef4444'),
          info: createColorScale('#3b82f6')
        }
      },
      typography: {
        fontFamilies: {
          sans: 'Inter, sans-serif',
          serif: 'Georgia, serif',
          mono: 'Monaco, monospace'
        },
        fontSizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem'
        },
        fontWeights: {
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700
        },
        lineHeights: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75
        }
      },
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem'
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem'
      },
      shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)'
      },
      breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      },
      zIndex: {
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modal: 1040,
        popover: 1050,
        tooltip: 1060
      }
    },
    themes: {
      light: {
        '--primary-color': '#3b82f6',
        '--secondary-color': '#64748b',
        '--background-color': '#ffffff'
      },
      dark: {
        '--primary-color': '#60a5fa',
        '--secondary-color': '#94a3b8',
        '--background-color': '#1e293b'
      }
    },
    globalCSS: `
      body {
        font-family: var(--font-sans, 'Inter', sans-serif);
        background-color: var(--background-color, #ffffff);
        color: var(--text-color, #1e293b);
      }
    `
  },
  
  hooks: {},
  
  configSchema: {
    type: 'object',
    properties: {
      site: {
        type: 'object',
        properties: {
          title: { type: 'string', default: '我的博客' },
          description: { type: 'string', default: '一个现代化的博客网站' }
        }
      },
      layout: {
          type: 'object',
          properties: {
            header: {
              type: 'object',
              properties: {
                enabled: { type: 'boolean', default: true },
                sticky: { type: 'boolean', default: true },
                transparent: { type: 'boolean', default: false }
              }
            },
            footer: {
              type: 'object',
              properties: {
                enabled: { type: 'boolean', default: true },
                columns: { type: 'number', default: 3 }
              }
            },
            sidebar: {
              type: 'object',
              properties: {
                enabled: { type: 'boolean', default: false },
                position: { type: 'string', enum: ['left', 'right'], default: 'right' },
                width: { type: 'string', default: '300px' }
              }
            }
          }
        },
      styles: {
          type: 'object',
          properties: {
            theme: { type: 'string', enum: ['light', 'dark', 'auto'], default: 'light' },
            primaryColor: { type: 'string', default: '#3b82f6' },
            fontFamily: { type: 'string', default: 'Inter, sans-serif' },
            fontSize: { type: 'string', default: '16px' }
          }
        },
        features: {
          type: 'object',
          properties: {
            search: { type: 'boolean', default: true },
            comments: { type: 'boolean', default: false },
            newsletter: { type: 'boolean', default: false },
            analytics: { type: 'boolean', default: false }
          }
        },
        custom: {
          type: 'object',
          properties: {}
        }
    }
  },
  
  defaultConfig: {
    site: {
      title: '我的博客',
      description: '一个现代化的博客网站'
    },
    layout: {
      header: {
        enabled: true,
        sticky: true,
        transparent: false
      },
      footer: {
        enabled: true,
        columns: 3
      },
      sidebar: {
        enabled: false,
        position: 'right',
        width: '300px'
      }
    },
    styles: {
      theme: 'light',
      primaryColor: '#3b82f6',
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px'
    },
    features: {
      search: true,
      comments: false,
      newsletter: false,
      analytics: false
    },
    custom: {}
  },
  
  templates: {},
  
  features: {
    customizer: true,
    darkMode: true,
    rtl: false,
    multiLanguage: false
  }
};

export default theme;