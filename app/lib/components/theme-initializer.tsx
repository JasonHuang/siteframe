'use client'

import { useEffect } from 'react'
import { useTheme } from './theme-provider'
import { themeService } from '../services/themes'
import { themeEngine } from '../services/modern-theme-engine'

/**
 * 主题初始化组件
 * 负责在应用启动时加载激活的主题
 */
export function ThemeInitializer() {
  const { theme, isLoading } = useTheme()

  // 强制执行一次初始化
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const result = await themeService.getActiveTheme()
        
        if (result.data && !result.error) {
          const activeTheme = result.data
          const themePath = `/themes/${activeTheme.name}`
          
          try {
            await themeEngine.loadTheme(activeTheme.name, { type: 'local', path: themePath })
          } catch (loadError) {
            console.error('ThemeInitializer: 主题加载失败 -', loadError)
          }
        }
      } catch (error) {
        console.error('强制初始化主题失败:', error)
      }
    }
    
    initializeTheme()
  }, [])

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const result = await themeService.getActiveTheme()
        
        if (result.data && !result.error) {
          const activeTheme = result.data
          const themePath = `/themes/${activeTheme.name}`
          
          try {
            await themeEngine.loadTheme(activeTheme.name, { type: 'local', path: themePath })
          } catch (loadError) {
            console.error('ThemeInitializer: 条件初始化 - 主题加载失败:', loadError)
          }
        }
      } catch (error) {
        console.error('初始化主题失败:', error)
      }
    }

    if (!theme && !isLoading) {
      initializeTheme()
    }
  }, [theme, isLoading])

  return null // 这是一个逻辑组件，不渲染任何内容
}