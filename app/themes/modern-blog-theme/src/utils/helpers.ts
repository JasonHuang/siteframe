/**
 * Theme Utilities - 主题工具函数
 * 提供主题相关的辅助函数
 */

// 类名合并工具
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// 格式化日期
export const formatDate = (date: string | Date, locale: string = 'zh-CN'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 计算阅读时间
export const calculateReadTime = (content: string, wordsPerMinute: number = 200): string => {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} 分钟阅读`;
};

// 截取文本
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

// 生成SEO友好的URL slug
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
    .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
};

// 深度合并对象
export const deepMerge = (target: any, source: any): any => {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
};

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// 检查是否为外部链接
export const isExternalLink = (url: string): boolean => {
  try {
    const link = new URL(url);
    return link.hostname !== window.location.hostname;
  } catch {
    return false;
  }
};

// 获取图片优化URL
export const getOptimizedImageUrl = (
  src: string,
  width?: number,
  height?: number,
  quality: number = 80
): string => {
  // 这里可以集成图片优化服务，如 Cloudinary, ImageKit 等
  // 目前返回原始URL
  return src;
};

// 颜色工具
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result && result[1] && result[2] && result[3]
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
};

// 生成对比色
export const getContrastColor = (hex: string): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
};