'use client'
import React, { useState } from 'react';

interface ContactInfo {
  address?: string;
  phone?: string;
  email?: string;
  workingHours?: string;
  website?: string;
}

interface ContactProps {
  title?: string;
  subtitle?: string;
  contactInfo?: ContactInfo;
  showForm?: boolean;
  showMap?: boolean;
  config?: any;
}

const defaultContactInfo: ContactInfo = {
  address: '1 Jianguomenwai Avenue, Chaoyang District, Beijing',
  phone: '+86 10 1234 5678',
  email: 'contact@company.com',
  workingHours: 'Monday to Friday 9:00-18:00',
  website: 'www.company.com'
};

const Contact: React.FC<ContactProps> = ({ 
  title = "Contact Us",
  subtitle = "We look forward to working with you",
  contactInfo = defaultContactInfo,
  showForm = true,
  showMap = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Should call actual API here
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="container">
        <div className="contact-header">
          <h2 className="contact-title">{title}</h2>
          {subtitle && (
            <p className="contact-subtitle">{subtitle}</p>
          )}
        </div>
        
        <div className="contact-content">
          {/* Contact Information */}
          <div className="contact-info">
            <h3>Contact Information</h3>
            
            <div className="info-items">
              {contactInfo.address && (
                <div className="info-item">
                  <div className="info-icon">📍</div>
                  <div className="info-details">
                    <strong>Address</strong>
                    <p>{contactInfo.address}</p>
                  </div>
                </div>
              )}
              
              {contactInfo.phone && (
                <div className="info-item">
                  <div className="info-icon">📞</div>
                  <div className="info-details">
                    <strong>Phone</strong>
                    <p>{contactInfo.phone}</p>
                  </div>
                </div>
              )}
              
              {contactInfo.email && (
                <div className="info-item">
                  <div className="info-icon">✉️</div>
                  <div className="info-details">
                    <strong>Email</strong>
                    <p>{contactInfo.email}</p>
                  </div>
                </div>
              )}
              
              {contactInfo.workingHours && (
                <div className="info-item">
                  <div className="info-icon">🕒</div>
                  <div className="info-details">
                    <strong>Working Hours</strong>
                    <p>{contactInfo.workingHours}</p>
                  </div>
                </div>
              )}
              
              {contactInfo.website && (
                <div className="info-item">
                  <div className="info-icon">🌐</div>
                  <div className="info-details">
                    <strong>Website</strong>
                    <p>{contactInfo.website}</p>
                  </div>
                </div>
              )}
            </div>
            
            {showMap && (
              <div className="map-placeholder">
                <p>Map Location</p>
              </div>
            )}
          </div>
          
          {/* Contact Form */}
          {showForm && (
            <div className="contact-form">
              <h3>Send Message</h3>
              
              {submitStatus === 'success' && (
                <div className="alert alert-success">
                  ✅ Message sent successfully! We will contact you soon.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="alert alert-error">
                  ❌ Failed to send, please try again later.
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Please select inquiry type</option>
                    <option value="general">General Inquiry</option>
                    <option value="service">Service Inquiry</option>
                    <option value="partnership">Partnership</option>
                    <option value="support">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    required
                    disabled={isSubmitting}
                    placeholder="Please describe your requirements in detail..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .contact-section {
          padding: 6rem 0;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          position: relative;
        }
        
        .contact-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                      radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .contact-header {
          text-align: center;
          margin-bottom: 5rem;
          position: relative;
          z-index: 1;
        }
        
        .contact-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .contact-subtitle {
          font-size: 1.375rem;
          color: #64748b;
          line-height: 1.6;
        }
        
        .contact-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          position: relative;
          z-index: 1;
        }
        
        .contact-info h3,
        .contact-form h3 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 2.5rem;
          color: #1e293b;
          position: relative;
        }
        
        .contact-info h3::after,
        .contact-form h3::after {
          content: '';
          position: absolute;
          bottom: -0.5rem;
          left: 0;
          width: 3rem;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #06b6d4);
          border-radius: 2px;
        }
        
        .info-items {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        
        .info-icon {
          font-size: 1.25rem;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
        }
        
        .info-item:hover .info-icon {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }
        
        .info-details strong {
          display: block;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
          font-size: 1.0625rem;
        }
        
        .info-details p {
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }
        
        .map-placeholder {
          height: 200px;
          background: var(--muted);
          border: 2px dashed var(--border);
          border-radius: var(--border-radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--foreground);
          opacity: 0.6;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.75rem;
          font-size: 0.9375rem;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.75rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          color: #1e293b;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }
        
        .form-group input:disabled,
        .form-group select:disabled,
        .form-group textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }
        
        .btn-lg {
          padding: 1.25rem 2rem;
          font-size: 1.125rem;
          width: 100%;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          cursor: pointer;
        }
        
        .btn-lg:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
          background: linear-gradient(135deg, #2563eb, #0891b2);
        }
        
        .btn-lg:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .alert {
          padding: 1.25rem 1.5rem;
          border-radius: 0.75rem;
          margin-bottom: 2rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .alert-success {
          background: rgba(34, 197, 94, 0.1);
          color: #166534;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }
        
        .alert-error {
          background: rgba(239, 68, 68, 0.1);
          color: #991b1b;
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: var(--border-radius-base);
          margin-bottom: 1.5rem;
          font-weight: 500;
        }
        
        .alert-success {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }
        
        .alert-error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }
        
        @media (max-width: 768px) {
          .contact-section {
            padding: 3rem 0;
          }
          
          .contact-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .contact-title {
            font-size: 2rem;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;