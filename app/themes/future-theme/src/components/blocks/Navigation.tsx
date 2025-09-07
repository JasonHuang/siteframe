/**
 * Navigation Block - 导航区块组件
 * 可复用的导航组件，支持多种样式
 */

import React, { useState } from 'react';

interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

interface NavigationProps {
  items: NavigationItem[];
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'mobile';
  showIcons?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  items,
  className = '',
  variant = 'horizontal',
  showIcons = false
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderNavigationItem = (item: NavigationItem, index: number) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeDropdown === item.label;

    return (
      <div key={index} className="relative">
        <a
          href={item.href}
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors
            ${variant === 'vertical' ? 'w-full justify-start' : ''}
            text-foreground hover:text-primary hover:bg-muted
            ${isActive ? 'text-primary bg-muted' : ''}
          `}
          onMouseEnter={() => hasChildren && setActiveDropdown(item.label)}
          onMouseLeave={() => hasChildren && setActiveDropdown(null)}
        >
          {showIcons && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          <span>{item.label}</span>
          {hasChildren && (
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </a>
        
        {/* 下拉菜单 */}
        {hasChildren && isActive && (
          <div className={`
            absolute z-50 mt-1 bg-card border border-border rounded-lg shadow-lg
            ${variant === 'vertical' ? 'left-full top-0 ml-2' : 'left-0 top-full'}
            min-w-48
          `}>
            <div className="py-2">
              {item.children!.map((child, childIndex) => (
                <a
                  key={childIndex}
                  href={child.href}
                  className="block px-4 py-2 text-sm text-foreground hover:text-primary hover:bg-muted transition-colors"
                >
                  {child.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (variant === 'mobile') {
    return (
      <div className={className}>
        {/* 移动端菜单按钮 */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-muted transition-colors md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
        
        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg md:hidden">
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-2">
                {items.map((item, index) => (
                  <div key={index}>
                    <a
                      href={item.href}
                      className="block px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                    {item.children && (
                      <div className="ml-4 space-y-1">
                        {item.children.map((child, childIndex) => (
                          <a
                            key={childIndex}
                            href={child.href}
                            className="block px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <nav className={`
      ${variant === 'horizontal' ? 'flex items-center space-x-1' : 'space-y-1'}
      ${className}
    `}>
      {items.map(renderNavigationItem)}
    </nav>
  );
};

export default Navigation;