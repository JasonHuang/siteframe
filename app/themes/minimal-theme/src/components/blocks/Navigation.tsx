import React from 'react';

interface NavigationProps {
  items?: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;
  config?: any;
}

const Navigation: React.FC<NavigationProps> = ({ 
  items = [
    { label: 'Home', href: '/', active: true },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' }
  ]
}) => {
  return (
    <nav className="navigation">
      <ul className="nav-list">
        {items.map((item, index) => (
          <li key={index} className={`nav-item ${item.active ? 'nav-item--active' : ''}`}>
            <a href={item.href} className="nav-link">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;