'use client'

import { useTheme, useThemeComponent } from '../lib/components/theme-provider'

export default function TestThemePage() {
  const { theme, isLoading, error } = useTheme()
  const Header = useThemeComponent('Header', 'block')
  
  console.log('TestThemePage - theme:', theme)
  console.log('TestThemePage - isLoading:', isLoading)
  console.log('TestThemePage - error:', error)
  console.log('TestThemePage - Header component:', Header)
  
  if (isLoading) {
    return <div className="p-8">加载主题中...</div>
  }
  
  if (error) {
    return <div className="p-8 text-red-500">主题加载错误: {error.message}</div>
  }
  
  if (!theme) {
    return <div className="p-8 text-yellow-500">没有加载主题</div>
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">主题测试页面</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">主题信息:</h2>
        <p>名称: {theme.metadata.name}</p>
        <p>版本: {theme.metadata.version}</p>
        <p>作者: {theme.metadata.author}</p>
      </div>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Header组件测试:</h2>
        {Header ? (
          <div className="border p-4">
            <Header />
          </div>
        ) : (
          <p className="text-red-500">Header组件未找到</p>
        )}
      </div>
    </div>
  )
}