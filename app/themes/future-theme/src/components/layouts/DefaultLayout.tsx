/**
 * Default Layout - 默认布局组件
 * 用于大部分页面的基础布局
 */

import React from 'react';

interface DefaultLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-background text-foreground ${className}`}>
      <div className="flex flex-col min-h-screen">
        {/* Header 区域 */}
        <header className="sticky top-0 z-50 bg-card border-b border-border">
          <div className="container mx-auto px-4">
            {/* Header 内容将通过主题系统动态加载 */}
          </div>
        </header>
        
        {/* 主要内容区域 */}
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
        
        {/* Footer 区域 */}
        <footer className="bg-muted border-t border-border">
          <div className="container mx-auto px-4">
            {/* Footer 内容将通过主题系统动态加载 */}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DefaultLayout;