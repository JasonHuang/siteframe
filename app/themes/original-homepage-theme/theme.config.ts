import { ThemeConfig } from '../../lib/types/theme';

const config: ThemeConfig = {
  // 颜色配置
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      disabled: '#94a3b8'
    }
  },
  
  // 字体配置
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      serif: 'Georgia, serif',
      mono: 'Monaco, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  
  // 间距配置
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem'
  },
  
  // 布局配置
  layout: {
    maxWidth: '1200px',
    containerPadding: '1rem',
    headerHeight: '4rem',
    sidebarWidth: '16rem'
  },
  
  // 自定义配置
  custom: {
    components: {
      layouts: {
        default: 'DefaultLayout'
      },
      blocks: {
        header: 'Header',
        footer: 'Footer',
        hero: 'HeroSection',
        features: 'Features',
        about: 'About',
        services: 'Services',
        testimonials: 'Testimonials',
        contact: 'Contact'
      }
    },
    templates: {
      home: {
        name: 'home',
        displayName: '首页',
        layout: 'DefaultLayout',
        sections: [
          { component: 'Header', props: {} },
          { component: 'HeroSection', props: {} },
          { component: 'Features', props: {} },
          { component: 'About', props: {} },
          { component: 'Services', props: {} },
          { component: 'Testimonials', props: {} },
          { component: 'Contact', props: {} },
          { component: 'Footer', props: {} }
        ]
      }
    }
  }
};

export default config;