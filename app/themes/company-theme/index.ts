/**
 * Company Theme - Professional Business Theme
 * Professional theme suitable for corporate websites and business purposes
 */

import React from 'react';
import { ModernTheme } from '../../lib/types/modern-theme';

// Import components
import DefaultLayout from './src/components/layouts/DefaultLayout';
import PostLayout from './src/components/layouts/PostLayout';
import Header from './src/components/blocks/Header';
import Footer from './src/components/blocks/Footer';
import PostCard from './src/components/blocks/PostCard';
import Navigation from './src/components/blocks/Navigation';
import Hero from './src/components/blocks/Hero';
import Services from './src/components/blocks/Services';
import About from './src/components/blocks/About';
import Contact from './src/components/blocks/Contact';

// Import templates
import CompanyHomepage from './src/templates/CompanyHomepage';

// Import styles and configuration
import designTokens from './src/styles/tokens';
import defaultConfig from './src/config/default';

// Import component metadata
import DefaultLayoutMeta from './src/components/layouts/DefaultLayout/meta';
import PostLayoutMeta from './src/components/layouts/PostLayout/meta';
import HeaderMeta from './src/components/blocks/Header/meta';
import FooterMeta from './src/components/blocks/Footer/meta';
import PostCardMeta from './src/components/blocks/PostCard/meta';
import NavigationMeta from './src/components/blocks/Navigation/meta';
import HeroMeta from './src/components/blocks/Hero/meta';
import ServicesMeta from './src/components/blocks/Services/meta';
import AboutMeta from './src/components/blocks/About/meta';
import ContactMeta from './src/components/blocks/Contact/meta';

// Import template metadata
import CompanyHomepageMeta from './src/templates/CompanyHomepage/meta';

const theme: ModernTheme = {
  metadata: {
    name: 'company-theme',
    version: '1.0.0',
    author: 'Theme Generator',
    description: 'Professional company theme, suitable for business websites',
    homepage: 'https://github.com/themes/company-theme',
    repository: 'https://github.com/themes/company-theme.git',
    license: 'MIT',
    tags: ['responsive', 'dark-mode', 'typography', 'business', 'corporate'],
    screenshot: './public/images/screenshot.png',
    compatibility: {
      minVersion: '1.0.0'
    }
  },
  
  components: {
    layouts: {
      DefaultLayout,
      PostLayout
    },
    blocks: {
      Header,
      Footer,
      PostCard,
      Navigation,
      Hero,
      Services,
      About,
      Contact,
      CompanyHomepage
    },
    widgets: {}
  },
  
  componentMeta: {
    layouts: {
      DefaultLayout: DefaultLayoutMeta,
      PostLayout: PostLayoutMeta
    },
    blocks: {
      Header: HeaderMeta,
      Footer: FooterMeta,
      PostCard: PostCardMeta,
      Navigation: NavigationMeta,
      Hero: HeroMeta,
      Services: ServicesMeta,
      About: AboutMeta,
      Contact: ContactMeta,
      CompanyHomepage: CompanyHomepageMeta
    },
    widgets: {}
  },
  
  styles: {
    tokens: {
      colors: {
        primary: { ...designTokens.colors.primary, 950: '#0c2d48' },
        secondary: { ...designTokens.colors.secondary, 950: '#020617' },
        accent: { ...designTokens.colors.primary, 950: '#0c2d48' },
        neutral: { ...designTokens.colors.neutral, 950: '#0a0a0a' },
        semantic: {
          success: { ...designTokens.colors.success, 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 600: '#16a34a', 700: '#15803d', 800: '#166534', 950: '#052e16' },
          warning: { ...designTokens.colors.warning, 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 600: '#d97706', 700: '#b45309', 800: '#92400e', 950: '#451a03' },
          error: { ...designTokens.colors.error, 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 950: '#450a0a' },
          info: { ...designTokens.colors.primary, 950: '#0c2d48' }
        }
      },
      typography: {
        fontFamilies: {
          sans: designTokens.typography.fontFamily.sans.join(', '),
          serif: designTokens.typography.fontFamily.serif.join(', '),
          mono: designTokens.typography.fontFamily.mono.join(', ')
        },
        fontSizes: designTokens.typography.fontSize,
        fontWeights: {
          thin: 100,
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
          extrabold: 800,
          black: 900
        },
        lineHeights: {
          none: 1,
          tight: 1.25,
          snug: 1.375,
          normal: 1.5,
          relaxed: 1.625,
          loose: 2
        }
      },
      spacing: designTokens.spacing,
      borderRadius: designTokens.borders.radius,
      shadows: designTokens.shadows,
      breakpoints: designTokens.breakpoints,
      zIndex: {
        0: 0,
        10: 10,
        20: 20,
        30: 30,
        40: 40,
        50: 50,
        auto: 1
      }
    },
    themes: {
      light: {
        'background': 'var(--color-neutral-50)',
        'foreground': 'var(--color-neutral-900)',
        'primary': 'var(--color-primary-500)',
        'secondary': 'var(--color-secondary-500)',
        'muted': 'var(--color-neutral-100)',
        'border': 'var(--color-neutral-200)',
        'card': 'var(--color-white)',
        'card-foreground': 'var(--color-neutral-900)'
      },
      dark: {
        'background': 'var(--color-neutral-900)',
        'foreground': 'var(--color-neutral-50)',
        'primary': 'var(--color-primary-400)',
        'secondary': 'var(--color-secondary-400)',
        'muted': 'var(--color-neutral-800)',
        'border': 'var(--color-neutral-700)',
        'card': 'var(--color-neutral-800)',
        'card-foreground': 'var(--color-neutral-50)'
      }
    },
    globalCSS: `
      * {
        box-sizing: border-box;
      }
      
      body {
        margin: 0;
        font-family: var(--font-sans);
        background: var(--background);
        color: var(--foreground);
        line-height: var(--line-height-normal);
      }
      
      h1, h2, h3, h4, h5, h6 {
        margin: 0 0 1rem 0;
        font-weight: var(--font-weight-semibold);
        line-height: var(--line-height-tight);
      }
      
      p {
        margin: 0 0 1rem 0;
      }
      
      a {
        color: var(--primary);
        text-decoration: none;
      }
      
      a:hover {
        text-decoration: underline;
      }
      
      img {
        max-width: 100%;
        height: auto;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      
      .prose {
        max-width: 65ch;
        line-height: var(--line-height-relaxed);
      }
      
      .prose h1 { font-size: var(--font-size-3xl); }
      .prose h2 { font-size: var(--font-size-2xl); }
      .prose h3 { font-size: var(--font-size-xl); }
      .prose h4 { font-size: var(--font-size-lg); }
      
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 1rem;
        border: 1px solid var(--border);
        border-radius: var(--border-radius-base);
        background: var(--card);
        color: var(--card-foreground);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        text-decoration: none;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .btn:hover {
        background: var(--muted);
        text-decoration: none;
      }
      
      .btn-primary {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
      }
      
      .btn-primary:hover {
        opacity: 0.9;
      }
      
      .card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: var(--border-radius-lg);
        padding: 1.5rem;
        box-shadow: var(--shadow-sm);
      }
      
      .card:hover {
        box-shadow: var(--shadow-md);
      }
      
      @media (max-width: 768px) {
        .container {
          padding: 0 0.75rem;
        }
        
        .card {
          padding: 1rem;
        }
      }
    `
  },
  

  
  hooks: {
    'theme:init': async (context: any) => {
      console.log('Minimal theme initialized');
      
      // Set default theme mode
      if (context.config?.styles?.theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        context.setThemeMode?.(prefersDark ? 'dark' : 'light');
      }
    },
    
    'theme:beforeRender': async (context: any) => {
      // Logic to execute before rendering
      console.log('Minimal theme before render');
    },
    
    'theme:afterRender': async (context: any) => {
      // Logic to execute after rendering
      console.log('Minimal theme after render');
    },
    
    'config:change': async (context: any, changes: any) => {
      // Handle configuration changes
      console.log('Minimal theme config changed:', changes);
      
      if (changes.styles?.theme) {
        context.setThemeMode?.(changes.styles.theme);
      }
    }
  },
  
  configSchema: {},
  defaultConfig: {
    site: {
      title: defaultConfig.site.title,
      description: defaultConfig.site.description
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
    styles: {
      theme: defaultConfig.styles.theme,
      primaryColor: defaultConfig.styles.primaryColor,
      fontFamily: defaultConfig.styles.fontFamily,
      fontSize: defaultConfig.styles.fontSize
    },
    features: {
      search: defaultConfig.features.search,
      comments: defaultConfig.features.comments,
      newsletter: defaultConfig.features.newsletter,
      analytics: defaultConfig.features.analytics
    },
    custom: {}
  },
  
  templates: {
    'company-homepage': {
      name: 'CompanyHomepage',
      displayName: 'Company Homepage',
      layout: 'DefaultLayout',
      blocks: [
          {
            type: 'block',
            name: 'CompanyHomepage',
            props: {}
          }
        ]
    },
    
    'blog-post': {
      name: 'Blog Post',
      displayName: 'Blog Post',
      description: 'Blog post page template',
      layout: 'PostLayout',
      blocks: [
          {
            name: 'Header',
            type: 'block',
            props: { showNavigation: true }
          },
          {
            name: 'PostCard',
            type: 'block',
            props: { 
              showAuthor: true,
              showDate: true,
              showExcerpt: true
            }
          },
          {
            name: 'Footer',
            type: 'block',
            props: { showSocial: true }
          }
        ]
    },
    
    'home-page': {
      name: 'Home Page',
      displayName: 'Homepage',
    description: 'Homepage template',
      layout: 'DefaultLayout',
      blocks: [
          {
            name: 'Header',
            type: 'block',
            props: { 
              showNavigation: true,
              showSearch: true
            }
          },
          {
            name: 'PostCard',
            type: 'block',
            props: { 
              variant: 'featured',
              showAuthor: true
            }
          },
          {
            name: 'Footer',
            type: 'block',
            props: { 
              showSocial: true,
              showNewsletter: true
            }
          }
        ]
    }
  },
  
  features: {
    customizer: true,
    darkMode: true,
    rtl: false,
    multiLanguage: false
  }
};

export default theme;

// Export components for external use
export {
  DefaultLayout,
  PostLayout,
  Header,
  Footer,
  PostCard,
  Navigation
};

// Export utility functions
export * from './src/hooks';
export * from './src/utils';