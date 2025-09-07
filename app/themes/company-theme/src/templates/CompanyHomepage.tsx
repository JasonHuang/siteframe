'use client'
import React from 'react';
import DefaultLayout from '../components/layouts/DefaultLayout';
import Hero from '../components/blocks/Hero';
import Services from '../components/blocks/Services';
import About from '../components/blocks/About';
import Contact from '../components/blocks/Contact';

interface CompanyHomepageProps {
  heroData?: {
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
    backgroundImage?: string;
  };
  servicesData?: {
    title?: string;
    subtitle?: string;
    columns?: 2 | 3 | 4;
    services?: Array<{
      id: string;
      title: string;
      description: string;
      icon?: string;
    }>;
  };
  aboutData?: {
    title?: string;
    description?: string;
    mission?: string;
    vision?: string;
    values?: string[];
    showTeam?: boolean;
    teamMembers?: Array<{
      id: string;
      name: string;
      position: string;
      bio?: string;
      avatar?: string;
    }>;
  };
  contactData?: {
    title?: string;
    subtitle?: string;
    showForm?: boolean;
    contactInfo?: {
      address?: string;
      phone?: string;
      email?: string;
      workingHours?: string;
      website?: string;
    };
  };
}

const CompanyHomepage: React.FC<CompanyHomepageProps> = ({
  heroData = {
    title: 'Professional Enterprise Services',
    subtitle: 'Trusted Business Partner',
    description: 'We are committed to providing customers with the highest quality services and solutions to help enterprises achieve sustainable development.',
    ctaText: 'Learn More',
    ctaLink: '#about'
  },
  servicesData = {
    title: 'Our Services',
    subtitle: 'Professional Solutions',
    columns: 3 as const,
    services: [
      {
        id: 'consulting',
        title: 'Consulting Services',
        description: 'Professional business consulting and strategic planning services',
        icon: '💼'
      },
      {
        id: 'technical-support',
        title: 'Technical Support',
        description: 'Comprehensive technical support and maintenance services',
        icon: '🔧'
      },
      {
        id: 'training',
        title: 'Training Services',
        description: 'Customized employee training and capability enhancement',
        icon: '📚'
      }
    ]
  },
  aboutData = {
    title: 'About Us',
    description: 'We are a professional company focused on providing quality services to our clients. Since our establishment, we have always adhered to customer-oriented approach and technology-driven innovation.',
    mission: 'Through professional services and innovative solutions, help clients achieve business goals and create greater value.',
    vision: 'Become the industry-leading service provider, winning customer trust through excellent quality and service.',
    values: ['Integrity First', 'Customer First', 'Continuous Innovation', 'Teamwork'],
    showTeam: true,
    teamMembers: [
      {
        id: 'ceo',
        name: 'Mr. Zhang',
        position: 'Chief Executive Officer',
        bio: 'With 15 years of industry experience, dedicated to promoting enterprise innovation and development.'
      },
      {
        id: 'cto',
        name: 'Manager Li',
        position: 'Chief Technology Officer',
        bio: 'Senior technical expert, responsible for company technical strategy planning and implementation.'
      }
    ]
  },
  contactData = {
    title: 'Contact Us',
    subtitle: 'We look forward to working with you',
    showForm: true,
    contactInfo: {
      address: 'No.1 Jianguomenwai Street, Chaoyang District, Beijing',
      phone: '+86 10 1234 5678',
      email: 'contact@company.com',
      workingHours: 'Monday to Friday 9:00-18:00',
      website: 'www.company.com'
    }
  },
  ...props
}) => {
  return (
    <DefaultLayout {...props}>
      <div className="company-homepage">
        {/* Hero Section */}
        <section id="hero">
          <Hero {...heroData} />
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <Services {...servicesData} />
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-16">
          <div className="container mx-auto px-4">
            <About {...aboutData} />
          </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <Contact {...contactData} />
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
};

export default CompanyHomepage;