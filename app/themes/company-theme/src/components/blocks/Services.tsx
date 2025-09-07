'use client'
import React from 'react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  link?: string;
}

interface ServicesProps {
  title?: string;
  subtitle?: string;
  services?: Service[];
  columns?: 2 | 3 | 4;
  config?: any;
}

const defaultServices: Service[] = [
  {
    id: '1',
    title: 'Professional Consulting',
    description: 'Providing professional industry consulting services to help enterprises develop strategies and solutions.',
    icon: '💼'
  },
  {
    id: '2',
    title: 'Technical Development',
    description: 'Our professional technical team provides customized software development services for clients.',
    icon: '⚙️'
  },
  {
    id: '3',
    title: 'Project Management',
    description: 'Experienced project management team ensuring projects are completed on time and with quality.',
    icon: '📊'
  },
  {
    id: '4',
    title: 'After-sales Support',
    description: 'Comprehensive after-sales support services to ensure customer satisfaction.',
    icon: '🛠️'
  }
];

const Services: React.FC<ServicesProps> = ({ 
  title = "Our Services",
  subtitle = "Providing comprehensive professional services for you",
  services = defaultServices,
  columns = 3
}) => {
  return (
    <section className="services-section">
      <div className="container">
        <div className="services-header">
          <h2 className="services-title">{title}</h2>
          {subtitle && (
            <p className="services-subtitle">{subtitle}</p>
          )}
        </div>
        
        <div className={`services-grid services-grid-${columns}`}>
          {services.map((service) => (
            <div key={service.id} className="service-card">
              {service.icon && (
                <div className="service-icon">
                  {service.icon}
                </div>
              )}
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              {service.link && (
                <a href={service.link} className="service-link">
                  Learn More →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .services-section {
          padding: 6rem 0;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          position: relative;
        }
        
        .services-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .services-header {
          text-align: center;
          margin-bottom: 5rem;
          position: relative;
          z-index: 1;
        }
        
        .services-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .services-subtitle {
          font-size: 1.375rem;
          color: #64748b;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }
        
        .services-grid {
          display: grid;
          gap: 2.5rem;
          position: relative;
          z-index: 1;
        }
        
        .services-grid-2 {
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
        
        .services-grid-3 {
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        
        .services-grid-4 {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }
        
        .service-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1.5rem;
          padding: 2.5rem;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          position: relative;
          overflow: hidden;
        }
        
        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #06b6d4);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        
        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border-color: rgba(59, 130, 246, 0.3);
        }
        
        .service-card:hover::before {
          transform: scaleX(1);
        }
        
        .service-icon {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          border-radius: 50%;
          margin: 0 auto 2rem;
          position: relative;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }
        
        .service-card:hover .service-icon {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
        }
        
        .service-title {
          font-size: 1.625rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          color: #1e293b;
          transition: color 0.3s ease;
        }
        
        .service-card:hover .service-title {
          color: #3b82f6;
        }
        
        .service-description {
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 2rem;
          font-size: 1.0625rem;
        }
        
        .service-link {
          color: #3b82f6;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          background: rgba(59, 130, 246, 0.1);
        }
        
        .service-link:hover {
          color: #ffffff;
          background: #3b82f6;
          transform: translateY(-2px);
          text-decoration: none;
        }
        
        @media (max-width: 768px) {
          .services-section {
            padding: 3rem 0;
          }
          
          .services-title {
            font-size: 2rem;
          }
          
          .services-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .service-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Services;