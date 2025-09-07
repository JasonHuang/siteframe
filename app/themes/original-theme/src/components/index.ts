// 布局组件
import DefaultLayout from './layouts/DefaultLayout';

// 区块组件
import Header from './blocks/Header';
import Footer from './blocks/Footer';
import HeroSection from './blocks/HeroSection';
import Features from './blocks/Features';
import About from './blocks/About';
import Services from './blocks/Services';
import Testimonials from './blocks/Testimonials';
import Contact from './blocks/Contact';

// 重新导出组件
export {
  DefaultLayout,
  Header,
  Footer,
  HeroSection,
  Features,
  About,
  Services,
  Testimonials,
  Contact
}

// 组件映射
export const components = {
  layouts: {
    DefaultLayout
  },
  blocks: {
    Header,
    Footer,
    HeroSection,
    Features,
    About,
    Services,
    Testimonials,
    Contact
  },
  widgets: {}
};

// 动态导入映射（用于代码分割）
export const componentLoaders = {
  layouts: {
    DefaultLayout: () => import('./layouts/DefaultLayout')
  },
  blocks: {
    Header: () => import('./blocks/Header'),
    Footer: () => import('./blocks/Footer'),
    HeroSection: () => import('./blocks/HeroSection'),
    Features: () => import('./blocks/Features'),
    About: () => import('./blocks/About'),
    Services: () => import('./blocks/Services'),
    Testimonials: () => import('./blocks/Testimonials'),
    Contact: () => import('./blocks/Contact')
  },
  widgets: {}
}

// 组件元数据
export const componentMeta = {
  layouts: {
    DefaultLayout: {
      name: 'DefaultLayout',
      displayName: '默认布局',
      description: '标准的页面布局',
      category: 'layout' as const
    }
  },
  blocks: {
    Header: {
      name: 'Header',
      displayName: '页头',
      description: '网站头部区域',
      category: 'block' as const
    },
    Footer: {
      name: 'Footer',
      displayName: '页脚',
      description: '网站底部区域',
      category: 'block' as const
    },
    HeroSection: {
      name: 'HeroSection',
      displayName: '英雄区域',
      description: '主要展示区域',
      category: 'block' as const
    },
    Features: {
      name: 'Features',
      displayName: '功能特性',
      description: '功能特性展示',
      category: 'block' as const
    },
    About: {
      name: 'About',
      displayName: '关于我们',
      description: '关于我们区域',
      category: 'block' as const
    },
    Services: {
      name: 'Services',
      displayName: '服务',
      description: '服务展示区域',
      category: 'block' as const
    },
    Testimonials: {
      name: 'Testimonials',
      displayName: '客户评价',
      description: '客户评价展示',
      category: 'block' as const
    },
    Contact: {
      name: 'Contact',
      displayName: '联系我们',
      description: '联系我们区域',
      category: 'block' as const
    }
  },
  widgets: {}
};