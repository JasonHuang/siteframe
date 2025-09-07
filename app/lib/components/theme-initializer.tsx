'use client'

import { useEffect } from 'react'
import { useTheme } from './theme-provider'
import { unifiedThemeService } from '../services/unified-theme-service'

/**
 * 主题初始化组件
 * 负责在应用启动时加载激活的主题
 */
export function ThemeInitializer() {
  const { theme, isLoading, loadTheme } = useTheme()

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const activeTheme = await unifiedThemeService.getActiveTheme()
        
        if (activeTheme) {
          try {
            // 实际加载主题到引擎中
            await loadTheme(activeTheme.name, { type: 'local', path: `themes/${activeTheme.name}` })
          } catch (loadError) {
            console.error('主题加载失败:', loadError)
          }
        }
      } catch (error) {
        console.error('初始化主题失败:', error)
      }
    }

    if (!theme && !isLoading) {
      initializeTheme()
    }
  }, [theme, isLoading, loadTheme])

  return null // 这是一个逻辑组件，不渲染任何内容
}