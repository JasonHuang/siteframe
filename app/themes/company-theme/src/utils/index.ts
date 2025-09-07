/**
 * Utility functions for Minimal Theme
 * 主题专用的工具函数
 */

/**
 * 类名合并工具
 * 合并多个类名，过滤掉空值
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * 格式化日期
 * 将日期字符串格式化为指定格式
 */
export const formatDate = (
  date: string | Date,
  format: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'MMM DD, YYYY' = 'YYYY-MM-DD'
): string => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  switch (format) {
    case 'MM/DD/YYYY':
      return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
    case 'DD/MM/YYYY':
      return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    case 'MMM DD, YYYY':
      return `${monthNames[month - 1]} ${day}, ${year}`;
    case 'YYYY-MM-DD':
    default:
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
};

/**
 * 截取文本
 * 截取指定长度的文本，超出部分用省略号表示
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * 生成唯一ID
 * 生成一个简单的唯一标识符
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 防抖函数
 * 延迟执行函数，在指定时间内多次调用只执行最后一次
 */
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

/**
 * 节流函数
 * 限制函数执行频率，在指定时间内最多执行一次
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * 深度合并对象
 * 递归合并多个对象
 */
export const deepMerge = <T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key] as any);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
};

/**
 * 检查是否为对象
 * 判断值是否为普通对象
 */
const isObject = (item: any): item is Record<string, any> => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

/**
 * 获取嵌套对象属性
 * 安全地获取嵌套对象的属性值
 */
export const getNestedValue = <T>(
  obj: any,
  path: string,
  defaultValue?: T
): T | undefined => {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
};

/**
 * 设置嵌套对象属性
 * 安全地设置嵌套对象的属性值
 */
export const setNestedValue = (
  obj: any,
  path: string,
  value: any
): void => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  
  if (!lastKey) return;

  let current = obj;
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
};

/**
 * 颜色工具函数
 * 处理颜色相关的操作
 */
export const colorUtils = {
  /**
   * 十六进制转RGB
   */
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  /**
   * RGB转十六进制
   */
  rgbToHex: (r: number, g: number, b: number): string => {
    const toHex = (n: number) => {
      const value = Math.max(0, Math.min(255, Math.round(n || 0)));
      return value.toString(16).padStart(2, '0');
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  },

  /**
   * 调整颜色亮度
   */
  adjustBrightness: (hex: string, percent: number): string => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return hex;

    const adjust = (color: number) => {
      const adjusted = Math.round(color * (1 + percent / 100));
      return Math.max(0, Math.min(255, adjusted));
    };

    return colorUtils.rgbToHex(
      adjust(rgb.r),
      adjust(rgb.g),
      adjust(rgb.b)
    );
  }
};

/**
 * 响应式工具函数
 * 处理响应式相关的操作
 */
export const responsive = {
  /**
   * 检查是否为移动设备
   */
  isMobile: (): boolean => {
    return window.innerWidth < 768;
  },

  /**
   * 检查是否为平板设备
   */
  isTablet: (): boolean => {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  },

  /**
   * 检查是否为桌面设备
   */
  isDesktop: (): boolean => {
    return window.innerWidth >= 1024;
  },

  /**
   * 获取当前断点
   */
  getCurrentBreakpoint: (): 'sm' | 'md' | 'lg' | 'xl' | '2xl' => {
    const width = window.innerWidth;
    if (width < 640) return 'sm';
    if (width < 768) return 'md';
    if (width < 1024) return 'lg';
    if (width < 1280) return 'xl';
    return '2xl';
  }
};

/**
 * 性能工具函数
 * 处理性能优化相关的操作
 */
export const performance = {
  /**
   * 图片懒加载
   */
  lazyLoadImage: (img: HTMLImageElement, src: string): void => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.isIntersecting) {
        img.src = src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
    observer.observe(img);
  },

  /**
   * 预加载图片
   */
  preloadImage: (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }
};