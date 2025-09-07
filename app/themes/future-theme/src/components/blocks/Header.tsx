/**
 * Header Block - 头部区块组件
 * 包含网站导航、Logo和搜索功能
 */

import React from 'react';

interface HeaderProps {
  className?: string;
  showSearch?: boolean;
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  className = '',
  showSearch = true,
  transparent = false 
}) => {
  return (
    <header className={`
      ${transparent ? 'bg-transparent' : 'bg-card border-b border-border'}
      ${className}
    `}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo 区域 */}
          <div className="flex items-center space-x-4">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-xl text-foreground">SiteFrame</span>
            </a>
          </div>
          
          {/* 导航菜单 */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-foreground hover:text-primary transition-colors">
              首页
            </a>
            <a href="/blog" className="text-foreground hover:text-primary transition-colors">
              博客
            </a>
            <a href="/about" className="text-foreground hover:text-primary transition-colors">
              关于
            </a>
            <a href="/contact" className="text-foreground hover:text-primary transition-colors">
              联系
            </a>
          </nav>
          
          {/* 右侧功能区 */}
          <div className="flex items-center space-x-4">
            {/* 搜索框 */}
            {showSearch && (
              <div className="hidden lg:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索..."
                    className="w-64 px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            
            {/* 主题切换按钮 */}
            <button className="p-2 rounded-lg hover:bg-muted transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
            
            {/* 移动端菜单按钮 */}
            <button className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;