/**
 * Custom hooks for Minimal Theme
 * 主题专用的自定义钩子
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * 主题模式钩子
 * 管理明暗主题切换
 */
export const useThemeMode = () => {
  const [mode, setMode] = useState<'light' | 'dark' | 'auto'>('light');
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // 检测系统主题偏好
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(current => {
      switch (current) {
        case 'light': return 'dark';
        case 'dark': return 'auto';
        case 'auto': return 'light';
        default: return 'light';
      }
    });
  }, []);

  const effectiveMode = mode === 'auto' ? systemPreference : mode;

  return {
    mode,
    effectiveMode,
    systemPreference,
    setMode,
    toggleMode
  };
};

/**
 * 响应式断点钩子
 * 检测当前屏幕尺寸对应的断点
 */
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else if (width < 1280) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
};

/**
 * 滚动位置钩子
 * 跟踪页面滚动位置
 */
export const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollPosition = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrollingUp(currentScrollY < lastScrollY);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', updateScrollPosition, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollPosition);
  }, []);

  return { scrollY, isScrollingUp };
};

/**
 * 本地存储钩子
 * 简化本地存储的使用
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

/**
 * 防抖钩子
 * 延迟执行函数调用
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * 图片懒加载钩子
 * 检测元素是否进入视口
 */
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsIntersecting(entry.isIntersecting);
        }
      },
      options
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [elementRef, options]);

  return isIntersecting;
};