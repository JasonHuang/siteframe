'use client'

import { lazy, Suspense, ComponentType } from 'react'

interface DynamicComponentProps {
  componentPath: string
  fallback?: React.ReactNode
  props?: any
}

// 预定义的组件映射，用于代码分割
const componentMap: Record<string, () => Promise<{ default: ComponentType<any> }>> = {
  'About': () => import('./About'),
  'Services': () => import('./Services'),
  'Testimonials': () => import('./Testimonials'),
  'Contact': () => import('./Contact'),
  'Features': () => import('./Features')
}

export default function DynamicComponent({ 
  componentPath, 
  fallback = (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  ),
  props = {}
}: DynamicComponentProps) {
  // 动态导入组件
  const LazyComponent = lazy(() => {
    const importFn = componentMap[componentPath]
    if (!importFn) {
      return Promise.reject(new Error(`Component ${componentPath} not found`))
    }
    return importFn()
  })

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

// 高阶组件，用于包装需要懒加载的组件
export function withLazyLoading<T extends object>(
  Component: ComponentType<T>,
  fallback?: React.ReactNode
) {
  return function LazyWrappedComponent(props: T) {
    return (
      <Suspense fallback={fallback || (
        <div className="flex items-center justify-center py-8">
          <div className="animate-pulse bg-gray-200 rounded-lg w-full h-32"></div>
        </div>
      )}>
        <Component {...props} />
      </Suspense>
    )
  }
}

// 预加载函数，用于在用户可能需要时预加载组件
export function preloadComponent(componentPath: string) {
  const importFn = componentMap[componentPath]
  if (importFn) {
    importFn().catch(() => {
      // 静默处理预加载错误
    })
  }
}

// 批量预加载函数
export function preloadComponents(componentPaths: string[]) {
  componentPaths.forEach(preloadComponent)
}