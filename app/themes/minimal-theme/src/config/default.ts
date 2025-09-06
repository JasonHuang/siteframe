/**
 * Default Configuration for Minimal Theme
 * 主题的默认配置
 */

const defaultConfig = {
  // 站点基础信息
  site: {
    title: 'Minimal Theme',
    description: 'A clean and modern theme for your website',
    url: 'https://example.com',
    language: 'en',
    author: {
      name: 'Theme Author',
      email: 'author@example.com',
      url: 'https://author.example.com'
    }
  },
  
  // 样式配置
  styles: {
    theme: 'light', // 'light' | 'dark' | 'auto'
    primaryColor: '#0ea5e9',
    fontFamily: 'Inter',
    fontSize: 'base',
    borderRadius: 'base',
    animations: true
  },
  
  // 布局配置
  layout: {
    containerMaxWidth: '1200px',
    headerHeight: '64px',
    footerHeight: 'auto',
    sidebarWidth: '280px',
    contentPadding: '1rem'
  },
  
  // 导航配置
  navigation: {
    showLogo: true,
    showSearch: false,
    showThemeToggle: true,
    showLanguageSwitch: false,
    items: [
      { label: 'Home', href: '/', active: true },
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' }
    ]
  },
  
  // 页脚配置
  footer: {
    showSocial: true,
    showCopyright: true,
    showBackToTop: true,
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com/example' },
      { platform: 'github', url: 'https://github.com/example' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/example' }
    ],
    copyrightText: '© 2024 Minimal Theme. All rights reserved.'
  },
  
  // 博客配置
  blog: {
    postsPerPage: 10,
    showAuthor: true,
    showDate: true,
    showTags: true,
    showExcerpt: true,
    showReadingTime: false,
    showComments: false,
    dateFormat: 'YYYY-MM-DD'
  },
  
  // SEO配置
  seo: {
    enableOpenGraph: true,
    enableTwitterCard: true,
    enableJsonLd: true,
    defaultImage: '/images/og-image.jpg'
  },
  
  // 性能配置
  performance: {
    enableLazyLoading: true,
    enableImageOptimization: true,
    enableCodeSplitting: true,
    enableServiceWorker: false
  },
  
  // 功能开关
  features: {
    darkMode: true,
    search: false,
    comments: false,
    analytics: false,
    newsletter: false,
    rss: true
  },
  
  // 自定义CSS变量
  customProperties: {
    '--custom-header-bg': 'transparent',
    '--custom-link-hover': '#0284c7',
    '--custom-button-shadow': '0 2px 4px rgba(0,0,0,0.1)'
  }
};

export default defaultConfig;