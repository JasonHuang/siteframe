/**
 * Theme Utils Export - 主题工具函数导出
 * 统一导出所有工具函数
 */

export * from './helpers';

// 工具函数映射
export const utils = {
  cn: () => import('./helpers').then(m => m.cn),
  formatDate: () => import('./helpers').then(m => m.formatDate),
  calculateReadTime: () => import('./helpers').then(m => m.calculateReadTime),
  truncateText: () => import('./helpers').then(m => m.truncateText),
  generateSlug: () => import('./helpers').then(m => m.generateSlug),
  deepMerge: () => import('./helpers').then(m => m.deepMerge),
  debounce: () => import('./helpers').then(m => m.debounce),
  throttle: () => import('./helpers').then(m => m.throttle),
  isExternalLink: () => import('./helpers').then(m => m.isExternalLink),
  getOptimizedImageUrl: () => import('./helpers').then(m => m.getOptimizedImageUrl),
  hexToRgb: () => import('./helpers').then(m => m.hexToRgb),
  getContrastColor: () => import('./helpers').then(m => m.getContrastColor)
};