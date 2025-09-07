export default {
  name: 'About',
  displayName: 'About Us',
  description: 'Display company introduction, mission vision and team information',
  category: 'content',
  icon: '🏢',
  
  props: {
    title: {
      type: 'string',
      label: 'Title',
      default: 'About Us',
      description: 'Title of the About Us section'
    },
    description: {
      type: 'textarea',
      label: 'Company Introduction',
      default: 'We are a professional company focused on providing quality services to our clients. Since our establishment, we have always adhered to customer-oriented approach and technology-driven innovation, providing comprehensive solutions for clients across various industries.',
      description: 'Detailed company introduction'
    },
    mission: {
      type: 'textarea',
      label: 'Company Mission',
      default: 'Through professional services and innovative solutions, help clients achieve business goals and create greater value.',
      description: 'Company mission statement'
    },
    vision: {
      type: 'textarea',
      label: 'Company Vision',
      default: 'Become the industry-leading service provider, winning customer trust through excellent quality and service.',
      description: 'Company vision statement'
    },
    values: {
      type: 'array',
      label: 'Core Values',
      description: 'Company core values',
      itemType: {
        type: 'string'
      },
      default: ['Integrity First', 'Customer First', 'Continuous Innovation', 'Teamwork']
    },
    showTeam: {
      type: 'boolean',
      label: 'Show Team',
      default: true,
      description: 'Whether to display team member information'
    },
    teamMembers: {
      type: 'array',
      label: 'Team Members',
      description: 'Team member list',
      itemType: {
        type: 'object',
        properties: {
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
      },
      default: [
        {
          name: 'Mr. Zhang',
          position: 'Chief Executive Officer',
          bio: 'With 15 years of industry experience, dedicated to promoting enterprise innovation and development.'
        },
        {
          name: 'Manager Li',
          position: 'Chief Technology Officer',
          bio: 'Senior technical expert, responsible for company technical strategy planning and implementation.'
        }
      ]
    }
  },
  
  variants: [
    {
      name: 'default',
      label: 'Default Style',
      props: {}
    },
    {
      name: 'no-team',
      label: 'No Team Display',
      props: {
        showTeam: false
      }
    },
    {
      name: 'simple',
      label: 'Simplified Version',
      props: {
        showTeam: false,
        values: ['Professional', 'Innovation']
      }
    }
  ],
  
  examples: [
    {
      name: 'tech-company',
      label: 'Technology Company',
      props: {
        title: 'About Us',
        description: 'We are an innovative enterprise focused on artificial intelligence and big data technology.',
        mission: 'Use technology to change the world and make AI serve humanity.',
        vision: 'Become the world\'s leading AI technology service provider.',
        values: ['Technological Innovation', 'User First', 'Open Cooperation', 'Continuous Learning']
      }
    }
  ]
};