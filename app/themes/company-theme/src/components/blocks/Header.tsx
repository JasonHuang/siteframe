'use client'
import React, { useState } from 'react';

interface HeaderProps {
  logo?: string;
  companyName?: string;
  navigation?: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;
  showCTA?: boolean;
  ctaText?: string;
  ctaLink?: string;
  showNavigation?: boolean;
  showLogo?: boolean;
  config?: any;
}

const defaultNavigation = [
  { label: 'Home', href: '/', active: true },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact Us', href: '/contact' }
];

const Header: React.FC<HeaderProps> = ({
  logo,
  companyName = "Company Name",
  navigation = defaultNavigation,
  showCTA = true,
  ctaText = "Free Consultation",
  ctaLink = "/contact",
  showNavigation = true,
  showLogo = true
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            {showLogo && (
              <div className="logo">
                {logo ? (
                  <img src={logo} alt={companyName} className="logo-image" />
                ) : (
                  <div className="logo-text">
                    <span className="logo-icon">🏢</span>
                    {companyName}
                  </div>
                )}
              </div>
            )}

            {/* Desktop Navigation */}
            {showNavigation && (
              <nav className="desktop-nav">
                <ul className="nav-list">
                  {navigation.map((item, index) => (
                    <li key={index} className="nav-item">
                      <a 
                        href={item.href} 
                        className={`nav-link ${item.active ? 'active' : ''}`}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* CTA Button */}
            {showCTA && (
              <div className="header-cta">
                <a href={ctaLink} className="cta-button">
                  {ctaText}
                </a>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>

          {/* Mobile Navigation */}
          {showNavigation && (
            <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
              <ul className="mobile-nav-list">
                {navigation.map((item, index) => (
                  <li key={index} className="mobile-nav-item">
                    <a 
                      href={item.href} 
                      className={`mobile-nav-link ${item.active ? 'active' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                {showCTA && (
                  <li className="mobile-nav-item">
                    <a 
                      href={ctaLink} 
                      className="mobile-cta-button"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {ctaText}
                    </a>
                  </li>
                )}
              </ul>
            </nav>
          )}
        </div>
      </header>

      <style jsx>{`
        .header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          position: relative;
        }

        .logo {
          display: flex;
          align-items: center;
          font-weight: 700;
          font-size: 1.5rem;
          color: #1e293b;
          text-decoration: none;
        }

        .logo-image {
          height: 40px;
          width: auto;
        }

        .logo-text {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .logo-icon {
          font-size: 1.75rem;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
        }

        .nav-list {
          display: flex;
          align-items: center;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-item {
          position: relative;
        }

        .nav-link {
          color: #64748b;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 0;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #3b82f6;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #06b6d4);
          transition: width 0.3s ease;
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .header-cta {
          display: flex;
          align-items: center;
        }

        .cta-button {
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .cta-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          background: linear-gradient(135deg, #2563eb, #0891b2);
        }

        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          z-index: 1001;
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          width: 24px;
          height: 18px;
          position: relative;
        }

        .hamburger span {
          display: block;
          height: 2px;
          width: 100%;
          background: #64748b;
          border-radius: 1px;
          transition: all 0.3s ease;
          position: absolute;
        }

        .hamburger span:nth-child(1) {
          top: 0;
        }

        .hamburger span:nth-child(2) {
          top: 50%;
          transform: translateY(-50%);
        }

        .hamburger span:nth-child(3) {
          bottom: 0;
        }

        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg);
          top: 50%;
        }

        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg);
          bottom: 50%;
        }

        .mobile-nav {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .mobile-nav.open {
          display: block;
        }

        .mobile-nav-list {
          list-style: none;
          margin: 0;
          padding: 1rem 0;
        }

        .mobile-nav-item {
          border-bottom: 1px solid rgba(226, 232, 240, 0.5);
        }

        .mobile-nav-item:last-child {
          border-bottom: none;
        }

        .mobile-nav-link {
          display: block;
          padding: 1rem 0;
          color: #64748b;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          color: #3b82f6;
        }

        .mobile-cta-button {
          display: block;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          color: white;
          padding: 1rem;
          margin: 1rem 0;
          border-radius: 0.5rem;
          text-decoration: none;
          font-weight: 600;
          text-align: center;
          transition: all 0.3s ease;
        }

        .mobile-cta-button:hover {
          background: linear-gradient(135deg, #2563eb, #0891b2);
        }

        @media (max-width: 768px) {
          .desktop-nav,
          .header-cta {
            display: none;
          }

          .mobile-menu-button {
            display: block;
          }
        }
      `}</style>
    </>
  );
};

export default Header;