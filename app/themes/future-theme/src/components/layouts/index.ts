/**
 * Layouts Export - 布局组件导出
 * 统一导出所有布局组件
 */

export { default as DefaultLayout } from './DefaultLayout';
export { default as PostLayout } from './PostLayout';

// 布局组件映射
export const layouts = {
  default: () => import('./DefaultLayout'),
  post: () => import('./PostLayout')
};

// 布局类型定义
export type LayoutType = keyof typeof layouts;