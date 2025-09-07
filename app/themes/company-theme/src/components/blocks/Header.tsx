import React from 'react';

interface HeaderProps {
  showNavigation?: boolean;
  showLogo?: boolean;
  config?: any;
}

const Header: React.FC<HeaderProps> = ({ 
  showNavigation = true, 
  showLogo = true 
}) => {
  return (
    <header className="site-header">
      <div className="container">
        <div className="header-content">
          {showLogo && (
            <div className="site-logo">
              <h1>Minimal Theme</h1>
            </div>
          )}
          
          {showNavigation && (
            <nav className="main-navigation">
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;