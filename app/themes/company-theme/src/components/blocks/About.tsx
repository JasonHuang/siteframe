'use client'
import React from 'react';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  avatar?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

interface AboutProps {
  title?: string;
  description?: string;
  mission?: string;
  vision?: string;
  values?: string[];
  teamMembers?: TeamMember[];
  showTeam?: boolean;
  config?: any;
}

const defaultTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Zhang',
    position: 'Chief Executive Officer',
    bio: 'With 15 years of industry experience, dedicated to driving enterprise innovation and development.',
    avatar: '/images/team/ceo.jpg'
  },
  {
    id: '2',
    name: 'Lisa Li',
    position: 'Chief Technology Officer',
    bio: 'Senior technical expert responsible for company technology strategy planning and implementation.',
    avatar: '/images/team/cto.jpg'
  },
  {
    id: '3',
    name: 'Michael Wang',
    position: 'Chief Marketing Officer',
    bio: 'Marketing expert specializing in brand building and market expansion.',
    avatar: '/images/team/cmo.jpg'
  }
];

const defaultValues = [
  'Integrity First',
  'Customer Focused',
  'Continuous Innovation',
  'Team Collaboration'
];

const About: React.FC<AboutProps> = ({ 
  title = "About Us",
  description = "We are a professional enterprise focused on providing high-quality services to our clients. Since our establishment, we have always adhered to customer-oriented approach and technology-driven innovation, providing comprehensive solutions for clients across various industries.",
  mission = "Through professional services and innovative solutions, we help clients achieve their business goals and create greater value.",
  vision = "To become the industry-leading service provider, winning customer trust through excellent quality and service.",
  values = defaultValues,
  teamMembers = defaultTeamMembers,
  showTeam = true
}) => {
  return (
    <section className="about-section">
      <div className="container">
        {/* Company Introduction */}
        <div className="about-intro">
          <div className="about-content">
            <h2 className="about-title">{title}</h2>
            <p className="about-description">{description}</p>
            
            <div className="about-details">
              <div className="detail-item">
                <h3>Our Mission</h3>
                <p>{mission}</p>
              </div>
              
              <div className="detail-item">
                <h3>Our Vision</h3>
                <p>{vision}</p>
              </div>
              
              <div className="detail-item">
                <h3>Core Values</h3>
                <div className="values-grid">
                  {values.map((value, index) => (
                    <div key={index} className="value-item">
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="about-image">
            <div className="image-placeholder">
              <span>Company Image</span>
            </div>
          </div>
        </div>
        
        {/* Team Introduction */}
        {showTeam && teamMembers.length > 0 && (
          <div className="team-section">
            <h3 className="team-title">Our Team</h3>
            <div className="team-grid">
              {teamMembers.map((member) => (
                <div key={member.id} className="team-member">
                  <div className="member-avatar">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h4 className="member-name">{member.name}</h4>
                  <p className="member-position">{member.position}</p>
                  {member.bio && (
                    <p className="member-bio">{member.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .about-section {
          padding: 5rem 0;
          background: var(--muted);
        }
        
        .about-intro {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          margin-bottom: 5rem;
        }
        
        .about-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--foreground);
        }
        
        .about-description {
          font-size: 1.125rem;
          line-height: 1.7;
          color: var(--foreground);
          opacity: 0.8;
          margin-bottom: 2rem;
        }
        
        .about-details {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .detail-item h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--primary);
        }
        
        .detail-item p {
          color: var(--foreground);
          opacity: 0.8;
          line-height: 1.6;
        }
        
        .values-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .value-item {
          background: var(--primary);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius-base);
          text-align: center;
          font-weight: 500;
        }
        
        .about-image {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .image-placeholder {
          width: 100%;
          height: 400px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border-radius: var(--border-radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.25rem;
          font-weight: 500;
        }
        
        .team-section {
          text-align: center;
        }
        
        .team-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 3rem;
          color: var(--foreground);
        }
        
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }
        
        .team-member {
          background: var(--card);
          border-radius: var(--border-radius-lg);
          padding: 2rem;
          text-align: center;
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s ease;
        }
        
        .team-member:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        
        .member-avatar {
          margin-bottom: 1.5rem;
        }
        
        .member-avatar img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .avatar-placeholder {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 600;
          margin: 0 auto;
        }
        
        .member-name {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--card-foreground);
        }
        
        .member-position {
          color: var(--primary);
          font-weight: 500;
          margin-bottom: 1rem;
        }
        
        .member-bio {
          color: var(--card-foreground);
          opacity: 0.8;
          line-height: 1.5;
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .about-section {
            padding: 3rem 0;
          }
          
          .about-intro {
            grid-template-columns: 1fr;
            gap: 2rem;
            margin-bottom: 3rem;
          }
          
          .about-title {
            font-size: 2rem;
          }
          
          .values-grid {
            grid-template-columns: 1fr;
          }
          
          .team-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .image-placeholder {
            height: 250px;
          }
        }
      `}</style>
    </section>
  );
};

export default About;