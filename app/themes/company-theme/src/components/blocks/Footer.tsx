import React from 'react';

interface FooterProps {
  showSocial?: boolean;
  showCopyright?: boolean;
  config?: any;
}

const Footer: React.FC<FooterProps> = ({ 
  showSocial = true, 
  showCopyright = true 
}) => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          {showSocial && (
            <div className="social-links">
              <a href="#" aria-label="Twitter">Twitter</a>
              <a href="#" aria-label="GitHub">GitHub</a>
              <a href="#" aria-label="LinkedIn">LinkedIn</a>
            </div>
          )}
          
          {showCopyright && (
            <div className="copyright">
              <p>&copy; 2024 Minimal Theme. All rights reserved.</p>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;