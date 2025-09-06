import config from './theme.config';
import { components, componentMeta } from './src/components';

// 主题加载器
export async function loadTheme() {
  return {
    // 主题元数据
    metadata: {
      name: 'original-homepage-theme',
      displayName: '原始主页主题',
      version: '1.0.0',
      description: '基于原始主页设计的完整主题',
      author: 'SiteFrame'
    },
    
    // 组件系统
    components,
    componentMeta,
    
    // 默认配置
    defaultConfig: config,
    
    // 配置Schema（简单版本）
    configSchema: {
      type: 'object',
      properties: {
        colors: { type: 'object' },
        typography: { type: 'object' },
        spacing: { type: 'object' },
        layout: { type: 'object' }
      }
    },
    
    // 样式系统（可选）
    styles: {
      tokens: {},
      themes: {},
      globalCSS: ''
    },
    
    // 获取组件
    getComponent: async (type: 'layouts' | 'blocks' | 'widgets', name: string) => {
      const componentGroup = components[type] as any;
      const componentLoader = componentGroup?.[name];
      if (!componentLoader) {
        throw new Error(`Component ${type}/${name} not found in theme`);
      }
      
      const module = await componentLoader();
      return module.default;
    },
    
    // 获取组件元数据
    getComponentMeta: (type: 'layouts' | 'blocks' | 'widgets', name: string) => {
      const metaGroup = componentMeta[type] as any;
      return metaGroup?.[name];
    }
  };
}

// 默认导出
export default loadTheme;