'use client'

import { useEffect } from 'react'

interface PerformanceMetrics {
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  ttfb?: number // Time to First Byte
}

export default function PerformanceMonitor() {
  useEffect(() => {
    // 检查浏览器是否支持 Performance API
    if (typeof window === 'undefined' || !('performance' in window)) {
      return
    }

    const metrics: PerformanceMetrics = {}

    // 监控 First Contentful Paint (FCP)
    const observeFCP = () => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            metrics.fcp = entry.startTime
            // FCP recorded
          }
        })
      }).observe({ entryTypes: ['paint'] })
    }

    // 监控 Largest Contentful Paint (LCP)
    const observeLCP = () => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          metrics.lcp = lastEntry.startTime
          // LCP recorded
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] })
    }

    // 监控 First Input Delay (FID)
    const observeFID = () => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          metrics.fid = entry.processingStart - entry.startTime
          // FID recorded
        })
      }).observe({ entryTypes: ['first-input'] })
    }

    // 监控 Cumulative Layout Shift (CLS)
    const observeCLS = () => {
      let clsValue = 0
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        metrics.cls = clsValue
        // CLS recorded
      }).observe({ entryTypes: ['layout-shift'] })
    }

    // 监控 Time to First Byte (TTFB)
    const observeTTFB = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart
        // TTFB recorded
      }
    }

    // 监控资源加载性能
    const observeResources = () => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.duration > 1000) { // 超过1秒的资源
            console.warn('Slow resource:', entry.name, 'Duration:', entry.duration)
          }
        })
      }).observe({ entryTypes: ['resource'] })
    }

    // 监控长任务
    const observeLongTasks = () => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          console.warn('Long task detected:', entry.duration, 'ms')
        })
      }).observe({ entryTypes: ['longtask'] })
    }

    // 内存使用监控
    const observeMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        // Memory usage tracked
      }
    }

    // 发送性能数据到分析服务（模拟）
    const sendMetrics = () => {
      // 在实际应用中，这里可以发送到 Google Analytics、Sentry 等服务
      // Performance metrics collected
      
      // 示例：发送到自定义分析端点
      // fetch('/api/analytics/performance', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(metrics)
      // })
    }

    // 启动所有监控
    try {
      observeFCP()
      observeLCP()
      observeFID()
      observeCLS()
      observeTTFB()
      observeResources()
      observeLongTasks()
      
      // 定期检查内存使用
      const memoryInterval = setInterval(observeMemory, 30000) // 每30秒检查一次
      
      // 页面卸载时发送指标
      const handleBeforeUnload = () => {
        sendMetrics()
      }
      
      window.addEventListener('beforeunload', handleBeforeUnload)
      
      // 页面可见性变化时发送指标
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          sendMetrics()
        }
      }
      
      document.addEventListener('visibilitychange', handleVisibilityChange)
      
      // 清理函数
      return () => {
        clearInterval(memoryInterval)
        window.removeEventListener('beforeunload', handleBeforeUnload)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    } catch (error) {
      console.warn('Performance monitoring setup failed:', error)
    }
  }, [])

  // 这个组件不渲染任何UI
  return null
}

// 性能优化建议组件
export function PerformanceOptimizationTips() {
  useEffect(() => {
    const checkPerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart
        
        // Page load metrics recorded
        
        // 提供优化建议
        if (loadTime > 3000) {
          console.warn('⚠️ Page load time is slow (>3s). Consider:')
          console.warn('- Optimizing images')
          console.warn('- Implementing code splitting')
          console.warn('- Using CDN for static assets')
          console.warn('- Minimizing JavaScript bundles')
        }
        
        if (domContentLoaded > 1500) {
          console.warn('⚠️ DOM Content Loaded is slow (>1.5s). Consider:')
          console.warn('- Reducing initial JavaScript bundle size')
          console.warn('- Deferring non-critical scripts')
          console.warn('- Optimizing CSS delivery')
        }
      }
    }
    
    // 页面加载完成后检查性能
    if (document.readyState === 'complete') {
      checkPerformance()
    } else {
      window.addEventListener('load', checkPerformance)
      return () => window.removeEventListener('load', checkPerformance)
    }
  }, [])
  
  return null
}