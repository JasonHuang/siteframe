export default {
  name: 'CompanyHomepage',
  displayName: 'Company Homepage',
  description: 'Complete corporate website homepage template, including hero section, service introduction, about us and contact information',
  category: 'page',
  icon: '🏢',
  
  props: {
    heroData: {
      type: 'object',
      label: 'Hero Section Data',
      description: 'Content for the hero section at the top of the homepage',
      properties: {
        title: {
          type: 'string',
          label: 'Main Title',
          default: 'Professional Enterprise Services'
        },
        subtitle: {
          type: 'string',
          label: 'Subtitle',
          default: 'Trusted Business Partner'
        },
        description: {
          type: 'textarea',
          label: 'Description',
          default: 'We are committed to providing customers with the highest quality services and solutions to help enterprises achieve sustainable development.'
        },
        ctaText: {
          type: 'string',
          label: 'CTA Button Text',
          default: 'Learn More'
        },
        ctaLink: {
          type: 'string',
          label: 'CTA Button Link',
          default: '#about'
        },
        backgroundImage: {
          type: 'image',
          label: 'Background Image'
        }
      }
    },
    servicesData: {
      type: 'object',
      label: 'Services Section Data',
      description: 'Content for the enterprise services showcase section',
      properties: {
        title: {
          type: 'string',
          label: 'Title',
          default: 'Our Services'
        },
        subtitle: {
      type: 'string',
      label: 'Subtitle',
      default: 'Professional Solutions'
    },
    columns: {
      type: 'select',
      label: 'Columns',
      options: [
        { value: 2, label: '2 Columns' },
        { value: 3, label: '3 Columns' },
        { value: 4, label: '4 Columns' }
      ],
      default: 3
    },
    services: {
      type: 'array',
      label: 'Services List',
          itemType: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                label: 'ID',
                required: true
              },
              title: {
              type: 'string',
              label: 'Service Name',
              required: true
            },
            description: {
              type: 'textarea',
              label: 'Service Description',
              required: true
            },
            icon: {
              type: 'string',
              label: 'Icon'
            }
            }
          }
        }
      }
    },
    aboutData: {
      type: 'object',
      label: 'About Us Data',
      description: 'Content for the company introduction section',
      properties: {
        title: {
          type: 'string',
          label: 'Title',
          default: 'About Us'
        },
        description: {
          type: 'textarea',
          label: 'Company Description'
        },
        mission: {
          type: 'textarea',
          label: 'Company Mission'
        },
        vision: {
          type: 'textarea',
          label: 'Company Vision'
        },
        values: {
          type: 'array',
          label: 'Core Values',
          itemType: {
            type: 'string'
          }
        },
        showTeam: {
          type: 'boolean',
          label: 'Show Team',
          default: true
        },
        teamMembers: {
          type: 'array',
          label: 'Team Members',
          itemType: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                label: 'ID',
                required: true
              },
              name: {
                type: 'string',
                label: 'Name',
                required: true
              },
              position: {
                type: 'string',
                label: 'Position',
                required: true
              },
              bio: {
                type: 'textarea',
                label: 'Bio'
              },
              avatar: {
                type: 'image',
                label: 'Avatar'
              }
            }
          }
        }
      }
    },
    contactData: {
      type: 'object',
      label: 'Contact Us Data',
      description: 'Content for the contact information section',
      properties: {
        title: {
          type: 'string',
          label: 'Title',
          default: 'Contact Us'
        },
        subtitle: {
          type: 'string',
          label: 'Subtitle',
          default: 'We look forward to working with you'
        },
        showForm: {
          type: 'boolean',
          label: 'Show Contact Form',
          default: true
        },
        contactInfo: {
          type: 'object',
          label: 'Contact Information',
          properties: {
            address: {
              type: 'string',
              label: 'Address'
            },
            phone: {
              type: 'string',
              label: 'Phone'
            },
            email: {
              type: 'email',
              label: 'Email'
            },
            workingHours: {
              type: 'string',
              label: 'Working Hours'
            },
            website: {
              type: 'string',
              label: 'Website'
            }
          }
        }
      }
    }
  },
  
  variants: [
    {
      name: 'default',
      label: 'Default Style',
      props: {}
    },
    {
      name: 'tech-company',
      label: 'Technology Company',
      props: {
        heroData: {
          title: 'Innovative Technology Solutions',
          subtitle: 'Leading Digital Transformation',
          description: 'We focus on artificial intelligence, big data and cloud computing technologies to provide cutting-edge digital solutions for enterprises.'
        },
        servicesData: {
          title: 'Core Technologies',
          subtitle: 'Cutting-edge Technology Services',
          services: [
            {
              id: 'ai',
              title: 'Artificial Intelligence',
              description: 'AI algorithm development and machine learning solutions',
              icon: '🤖'
            },
            {
              id: 'bigdata',
              title: 'Big Data Analytics',
              description: 'Massive data processing and business intelligence analysis',
              icon: '📊'
            },
            {
              id: 'cloud',
              title: 'Cloud Computing Services',
              description: 'Elastic cloud architecture and DevOps solutions',
              icon: '☁️'
            }
          ]
        }
      }
    },
    {
      name: 'consulting',
      label: 'Consulting Company',
      props: {
        heroData: {
          title: 'Professional Business Consulting',
          subtitle: 'Empowering Enterprise Growth',
          description: 'With rich industry experience and professional knowledge, we provide strategic planning and management consulting services for enterprises.'
        },
        servicesData: {
          title: 'Consulting Services',
          subtitle: 'Comprehensive Business Solutions',
          services: [
            {
              id: 'strategy',
              title: 'Strategic Consulting',
              description: 'Corporate strategic planning and market analysis',
              icon: '🎯'
            },
            {
              id: 'management',
              title: 'Management Consulting',
              description: 'Organizational optimization and process improvement',
              icon: '📈'
            },
            {
              id: 'finance',
              title: 'Financial Consulting',
              description: 'Financial planning and investment advice',
              icon: '💰'
            }
          ]
        }
      }
    }
  ],
  
  examples: [
    {
      name: 'default-company',
      label: 'Standard Corporate Website',
      props: {}
    }
  ]
};