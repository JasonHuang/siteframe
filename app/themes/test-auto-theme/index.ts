import type { ModernTheme } from '../../lib/types/modern-theme';
import React from 'react';

/**
 * 测试自动检测主题
 * 用于验证自动主题检测和注册功能
 */

// 简单的测试组件
const TestHeader: React.FC = () => {
  return React.createElement('header', 
    { style: { padding: '1rem', backgroundColor: '#10b981', color: 'white' } },
    React.createElement('h1', null, 'Test Auto Theme Header')
  );
};

const TestFooter: React.FC = () => {
  return React.createElement('footer',
    { style: { padding: '1rem', backgroundColor: '#6b7280', color: 'white' } },
    React.createElement('p', null, 'Test Auto Theme Footer')
  );
};

const TestLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return React.createElement('div',
    { style: { minHeight: '100vh', display: 'flex', flexDirection: 'column' } },
    children
  );
};

const theme: ModernTheme = {
  metadata: {
    name: 'test-auto-theme',
    version: '1.0.0',
    author: 'SiteFrame Team',
    description: '这是一个用于测试自动检测功能的主题',
    license: 'MIT',
    tags: ['test', 'auto-detection'],
    compatibility: {
      minVersion: '1.0.0'
    }
  },
  
  components: {
    layouts: {
      TestLayout
    },
    blocks: {
      Header: TestHeader,
      Footer: TestFooter
    },
    widgets: {}
  },
  
  componentMeta: {
    layouts: {
      TestLayout: {
        name: 'TestLayout',
        displayName: '测试布局',
        description: '测试主题的基础布局组件',
        category: 'layout',
        props: {}
      }
    },
    blocks: {
      Header: {
        name: 'Header',
        displayName: '页头',
        description: '测试主题的页头组件',
        category: 'block',
        props: {}
      },
      Footer: {
        name: 'Footer',
        displayName: '页脚',
        description: '测试主题的页脚组件',
        category: 'block',
        props: {}
      }
    },
    widgets: {}
  },
  
  styles: {
    tokens: {
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22'
        },
        secondary: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712'
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49'
        },
        neutral: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b'
        },
        semantic: {
          success: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
            950: '#052e16'
          },
          warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
            950: '#451a03'
          },
          error: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
            950: '#450a0a'
          },
          info: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#172554'
          }
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
          xl: '1.25rem',
          '2xl': '1.5rem'
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
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
      },
      borderRadius: {
         none: '0',
         sm: '0.125rem',
         md: '0.375rem',
         lg: '0.5rem',
         full: '9999px'
       },
       shadows: {
         sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
         md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
         lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
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
        background: '#ffffff',
        foreground: '#000000'
      },
      dark: {
        background: '#000000',
        foreground: '#ffffff'
      }
    }
  },
  
  hooks: {
    'theme:init': async () => {
      console.log('Test auto theme initialized');
    }
  },
  
  templates: {
    home: {
      name: 'home',
      displayName: '首页模板',
      layout: 'TestLayout',
      blocks: [
        { type: 'block', name: 'Header', props: {} },
        { type: 'block', name: 'Footer', props: {} }
      ]
    }
  },
  
  configSchema: {
    type: 'object',
    properties: {
      colors: {
        type: 'object',
        properties: {
          primary: { type: 'string' },
          secondary: { type: 'string' }
        }
      }
    }
  },
  
  defaultConfig: {
    site: {
      title: 'Test Auto Theme',
      description: 'A test theme for auto-detection'
    },
    styles: {
      theme: 'light',
      primaryColor: '#10b981',
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px'
    },
    layout: {
      header: {
        enabled: true,
        sticky: false,
        transparent: false
      },
      footer: {
        enabled: true,
        columns: 3
      },
      sidebar: {
         enabled: false,
         position: 'right' as const,
         width: '300px'
       }
     },
     features: {
        search: false,
        comments: false,
        newsletter: false,
        analytics: false
      },
     custom: {}
   }
};

export default theme;