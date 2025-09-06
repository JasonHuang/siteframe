/**
 * Theme Hooks - 主题钩子函数
 * 提供主题相关的React钩子
 */

import { useState, useEffect } from 'react';

// 主题模式钩子
export const useThemeMode = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // 从localStorage读取主题模式
    const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark';
    if (savedMode) {
      setMode(savedMode);
    } else {
      // 检测系统主题偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  return { mode, toggleMode };
};

// 主题配置钩子
export const useThemeConfig = () => {
  const [config, setConfig] = useState({});

  const updateConfig = (newConfig: any) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  return { config, updateConfig };
};

// 响应式断点钩子
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