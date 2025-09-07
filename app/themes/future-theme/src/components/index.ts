/**
 * 组件导出
 */

export * from './layouts';
export * from './blocks';
export * from './widgets';

// 组件映射
export const components = {
  layouts: {
    DefaultLayout: () => import('./layouts/DefaultLayout'),
    PostLayout: () => import('./layouts/PostLayout')
  },
  blocks: {
    Header: () => import('./blocks/Header'),
    Footer: () => import('./blocks/Footer'),
    Navigation: () => import('./blocks/Navigation')
  },
  widgets: {
    PostCard: () => import('./widgets/PostCard'),
    TagCloud: () => import('./widgets/TagCloud')
  }
};

// 组件元数据
export const componentMeta = {
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
};

// 组件类型
export type ComponentType = 'layouts' | 'blocks' | 'widgets';