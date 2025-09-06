/**
 * Widgets Export - 小部件组件导出
 * 统一导出所有小部件组件
 */

export { default as PostCard } from './PostCard';
export { default as TagCloud } from './TagCloud';

// 小部件组件映射
export const widgets = {
  postCard: () => import('./PostCard'),
  tagCloud: () => import('./TagCloud')
};

// 小部件类型定义
export type WidgetType = keyof typeof widgets;