'use client'
import React from 'react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  config?: any;
}

const Hero: React.FC<HeroProps> = ({ 
  title = "Welcome to Our Enterprise",
  subtitle = "Professional · Innovative · Reliable",
  description = "We are committed to providing our clients with the highest quality products and services, leveraging professional expertise and innovative concepts to drive your business success.",
  ctaText = "Learn More",
  ctaLink = "/about",
  backgroundImage
}) => {
  const heroStyle = backgroundImage ? {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : {};

  return (
    <section className="hero-section" style={heroStyle}>
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            {subtitle && (
              <p className="hero-subtitle">{subtitle}</p>
            )}
            <h1 className="hero-title">{title}</h1>
            {description && (
              <p className="hero-description">{description}</p>
            )}
            {ctaText && ctaLink && (
              <div className="hero-actions">
                <a href={ctaLink} className="btn btn-primary btn-lg">
                  {ctaText}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .hero-section {
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%);
          color: white;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .hero-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 4rem 2rem;
          position: relative;
          z-index: 1;
          animation: fadeInUp 1s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .hero-subtitle {
          font-size: 1.25rem;
          font-weight: 300;
          margin-bottom: 1rem;
          opacity: 0.9;
          letter-spacing: 0.05em;
        }
        
        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          background: linear-gradient(45deg, #ffffff, #e0f2fe);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .hero-description {
          font-size: 1.25rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
          opacity: 0.95;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .hero-actions {
          margin-top: 2rem;
        }
        
        .btn-lg {
          padding: 1.25rem 2.5rem;
          font-size: 1.125rem;
          border-radius: 0.75rem;
          background: linear-gradient(45deg, #ffffff, #f0f9ff);
          color: #1e3a8a;
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
          border: none;
        }
        
        .btn-lg:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.4);
          background: linear-gradient(45deg, #f8fafc, #e0f2fe);
        }
        
        @media (max-width: 768px) {
          .hero-section {
            min-height: 80vh;
          }
          
          .hero-title {
            font-size: 2.75rem;
          }
          
          .hero-subtitle {
            font-size: 1.125rem;
          }
          
          .hero-description {
            font-size: 1.125rem;
          }
          
          .hero-content {
            padding: 2rem 1rem;
          }
          
          .btn-lg {
            padding: 1rem 2rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;