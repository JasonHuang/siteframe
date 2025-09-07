export default {
  name: 'Contact',
  displayName: 'Contact Us',
  description: 'Contact form and corporate contact information display',
  category: 'form',
  icon: '📞',
  
  props: {
    title: {
      type: 'string',
      label: 'Title',
      default: 'Contact Us',
      description: 'Title of the contact section'
    },
    subtitle: {
      type: 'string',
      label: 'Subtitle',
      default: 'We look forward to working with you',
      description: 'Subtitle of the contact section'
    },
    showForm: {
      type: 'boolean',
      label: 'Show Contact Form',
      default: true,
      description: 'Whether to display the contact form'
    },
    showMap: {
      type: 'boolean',
      label: 'Show Map',
      default: false,
      description: 'Whether to display the map location'
    },
    contactInfo: {
      type: 'object',
      label: 'Contact Information',
      description: 'Corporate contact details',
      properties: {
        address: {
          type: 'string',
          label: 'Address',
          default: 'No.1 Jianguomenwai Street, Chaoyang District, Beijing'
        },
        phone: {
          type: 'string',
          label: 'Phone',
          default: '+86 10 1234 5678'
        },
        email: {
          type: 'email',
          label: 'Email',
          default: 'contact@company.com'
        },
        workingHours: {
          type: 'string',
          label: 'Working Hours',
          default: 'Monday to Friday 9:00-18:00'
        },
        website: {
          type: 'string',
          label: 'Website',
          default: 'www.company.com'
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
      name: 'form-only',
      label: 'Form Only',
      props: {
        showForm: true,
        contactInfo: {
          address: '',
          phone: '',
          email: '',
          workingHours: '',
          website: ''
        }
      }
    },
    {
      name: 'info-only',
      label: 'Contact Info Only',
      props: {
        showForm: false
      }
    },
    {
      name: 'with-map',
      label: 'With Map',
      props: {
        showMap: true
      }
    }
  ],
  
  examples: [
    {
      name: 'business',
      label: 'Business Contact',
      props: {
        title: 'Business Cooperation',
        subtitle: 'Looking forward to establishing long-term cooperation with you',
        contactInfo: {
          address: 'Lujiazui Financial Center, Pudong New Area, Shanghai',
          phone: '+86 21 1234 5678',
          email: 'business@company.com',
          workingHours: 'Monday to Friday 9:00-18:00',
          website: 'www.company.com'
        }
      }
    },
    {
      name: 'support',
      label: 'Technical Support',
      props: {
        title: 'Technical Support',
        subtitle: 'Our technical team is ready to serve you',
        contactInfo: {
          phone: '+86 400 1234 567',
          email: 'support@company.com',
          workingHours: '24/7 online support'
        }
      }
    }
  ]
};