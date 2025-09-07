/**
 * Post Layout - 文章布局组件
 * 专门用于博客文章页面的布局
 */

import React from 'react';

interface PostLayoutProps {
  children: React.ReactNode;
  className?: string;
  showSidebar?: boolean;
}

const PostLayout: React.FC<PostLayoutProps> = ({ 
  children, 
  className = '',
  showSidebar = false 
}) => {
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
            <div className={`grid gap-8 ${showSidebar ? 'lg:grid-cols-3' : 'max-w-4xl mx-auto'}`}>
              {/* 文章内容 */}
              <article className={showSidebar ? 'lg:col-span-2' : 'w-full'}>
                {children}
              </article>
              
              {/* 侧边栏 */}
              {showSidebar && (
                <aside className="lg:col-span-1">
                  <div className="sticky top-24 space-y-6">
                    {/* 侧边栏内容将通过主题系统动态加载 */}
                    <div className="bg-card border border-border rounded-lg p-6">
                      <h3 className="font-semibold mb-4">相关文章</h3>
                      <div className="space-y-3">
                        {/* 相关文章列表 */}
                      </div>
                    </div>
                    
                    <div className="bg-card border border-border rounded-lg p-6">
                      <h3 className="font-semibold mb-4">标签</h3>
                      <div className="flex flex-wrap gap-2">
                        {/* 标签列表 */}
                      </div>
                    </div>
                  </div>
                </aside>
              )}
            </div>
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

export default PostLayout;