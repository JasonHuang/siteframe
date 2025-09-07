/**
 * Blocks Export - 区块组件导出
 * 统一导出所有区块组件
 */

export { default as Header } from './Header';
export { default as Footer } from './Footer';
export { default as Navigation } from './Navigation';

// 区块组件映射
export const blocks = {
  header: () => import('./Header'),
  footer: () => import('./Footer'),
  navigation: () => import('./Navigation')
};

// 区块类型定义
export type BlockType = keyof typeof blocks;