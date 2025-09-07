'use client'
import React from 'react';

interface FooterProps {
  companyName?: string;
  companyDescription?: string;
  contactInfo?: {
    address?: string;
    phone?: string;
    email?: string;
  };
  quickLinks?: Array<{
    label: string;
    href: string;
  }>;
  services?: Array<{
    label: string;
    href: string;
  }>;
  socialLinks?: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
  showSocial?: boolean;
  showCopyright?: boolean;
  config?: any;
}

const defaultQuickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'News', href: '/news' },
  { label: 'Contact Us', href: '/contact' }
];

const defaultServices = [
  { label: 'Business Consulting', href: '/services/consulting' },
  { label: 'Technical Development', href: '/services/development' },
  { label: 'Digital Marketing', href: '/services/marketing' },
  { label: 'Brand Design', href: '/services/design' },
  { label: 'Operational Support', href: '/services/support' }
];

const defaultSocialLinks = [
  { platform: 'WeChat', url: '#', icon: '💬' },
  { platform: 'Weibo', url: '#', icon: '📱' },
  { platform: 'LinkedIn', url: '#', icon: '💼' },
  { platform: 'Email', url: 'mailto:info@company.com', icon: '📧' }
];

const Footer: React.FC<FooterProps> = ({
  companyName = "Company Name",
  companyDescription = "We are a professional business service provider, committed to providing high-quality solutions and services to our clients.",
  contactInfo = {
    address: "Business Center, Chaoyang District, Beijing",
    phone: "+86 400-123-4567",
    email: "info@company.com"
  },
  quickLinks = defaultQuickLinks,
  services = defaultServices,
  socialLinks = defaultSocialLinks,
  showSocial = true,
  showCopyright = true
}) => {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            {/* Company Information */}
            <div className="footer-section company-info">
              <div className="company-logo">
                <span className="logo-icon">🏢</span>
                <h3>{companyName}</h3>
              </div>
              <p className="company-description">{companyDescription}</p>
              
              {/* Contact Information */}
              <div className="contact-info">
                {contactInfo.address && (
                  <div className="contact-item">
                    <span className="contact-icon">📍</span>
                    <span>{contactInfo.address}</span>
                  </div>
                )}
                {contactInfo.phone && (
                  <div className="contact-item">
                    <span className="contact-icon">📞</span>
                    <span>{contactInfo.phone}</span>
                  </div>
                )}
                {contactInfo.email && (
                  <div className="contact-item">
                    <span className="contact-icon">📧</span>
                    <span>{contactInfo.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="section-title">Quick Links</h4>
              <ul className="footer-links">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="footer-section">
              <h4 className="section-title">Services</h4>
              <ul className="footer-links">
                {services.map((service, index) => (
                  <li key={index}>
                    <a href={service.href} className="footer-link">
                      {service.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media */}
            {showSocial && (
              <div className="footer-section">
                <h4 className="section-title">Follow Us</h4>
                <div className="social-links">
                  {socialLinks.map((social, index) => (
                    <a 
                      key={index}
                      href={social.url} 
                      className="social-link"
                      aria-label={social.platform}
                      title={social.platform}
                    >
                      <span className="social-icon">{social.icon}</span>
                      <span className="social-label">{social.platform}</span>
                    </a>
                  ))}
                </div>
                
                {/* QR Code */}
                <div className="qr-code">
                  <div className="qr-placeholder">
                    <span>📱</span>
                    <p>Scan to Follow</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Copyright */}
          {showCopyright && (
            <div className="footer-bottom">
              <div className="copyright">
                <p>&copy; 2024 {companyName}. All rights reserved.</p>
              </div>
              <div className="footer-bottom-links">
                <a href="/privacy" className="bottom-link">Privacy Policy</a>
                <a href="/terms" className="bottom-link">Terms of Service</a>
                <a href="/sitemap" className="bottom-link">Sitemap</a>
              </div>
            </div>
          )}
        </div>
      </footer>

      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: #e2e8f0;
          position: relative;
          overflow: hidden;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #3b82f6, transparent);
        }

        .footer-content {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
          padding: 4rem 0 2rem;
        }

        .footer-section {
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .company-info {
          max-width: 300px;
        }

        .company-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .logo-icon {
          font-size: 2rem;
        }

        .company-logo h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: #f8fafc;
        }

        .company-description {
          color: #cbd5e1;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #cbd5e1;
          font-size: 0.9rem;
        }

        .contact-icon {
          font-size: 1rem;
        }

        .section-title {
          color: #f8fafc;
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          position: relative;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -0.5rem;
          left: 0;
          width: 2rem;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #06b6d4);
        }

        .footer-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-link {
          color: #cbd5e1;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          padding-left: 1rem;
        }

        .footer-link::before {
          content: '▶';
          position: absolute;
          left: 0;
          color: #3b82f6;
          font-size: 0.7rem;
          transition: transform 0.3s ease;
        }

        .footer-link:hover {
          color: #3b82f6;
          transform: translateX(0.25rem);
        }

        .footer-link:hover::before {
          transform: translateX(0.25rem);
        }

        .social-links {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #cbd5e1;
          text-decoration: none;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
        }

        .social-link:hover {
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
          transform: translateX(0.25rem);
        }

        .social-icon {
          font-size: 1.25rem;
        }

        .social-label {
          font-size: 0.9rem;
        }

        .qr-code {
          margin-top: 1rem;
        }

        .qr-placeholder {
          background: rgba(255, 255, 255, 0.05);
          border: 2px dashed #475569;
          border-radius: 0.5rem;
          padding: 1rem;
          text-align: center;
          color: #94a3b8;
        }

        .qr-placeholder span {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .qr-placeholder p {
          margin: 0;
          font-size: 0.8rem;
        }

        .footer-bottom {
          border-top: 1px solid #475569;
          padding: 2rem 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .copyright {
          color: #94a3b8;
        }

        .copyright p {
          margin: 0;
          font-size: 0.9rem;
        }

        .footer-bottom-links {
          display: flex;
          gap: 2rem;
        }

        .bottom-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .bottom-link:hover {
          color: #3b82f6;
        }

        @media (max-width: 1024px) {
          .footer-content {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 3rem 0 2rem;
          }

          .company-info {
            max-width: none;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .footer-bottom-links {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .footer-bottom-links {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;