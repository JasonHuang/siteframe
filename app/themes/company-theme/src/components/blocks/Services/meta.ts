export default {
  name: 'Services',
  displayName: 'Services Display',
  description: 'Display various services provided by the enterprise',
  category: 'content',
  icon: '🛠️',
  
  props: {
    title: {
      type: 'string',
      label: 'Title',
      default: 'Our Services',
      description: 'Title of the services section'
    },
    subtitle: {
      type: 'string',
      label: 'Subtitle',
      default: 'Providing comprehensive professional services for you',
      description: 'Subtitle of the services section'
    },
    columns: {
      type: 'select',
      label: 'Columns',
      options: [
        { value: 2, label: '2 Columns' },
        { value: 3, label: '3 Columns' },
        { value: 4, label: '4 Columns' }
      ],
      default: 3,
      description: 'Number of columns for service cards layout'
    },
    services: {
      type: 'array',
      label: 'Services List',
      description: 'List of services provided by the enterprise',
      itemType: {
        type: 'object',
        properties: {
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
            label: 'Icon',
            description: 'Service icon (emoji or image URL)'
          },
          link: {
            type: 'string',
            label: 'Link',
            description: 'Service details page link'
          }
        }
      },
      default: [
        {
          title: 'Professional Consulting',
          description: 'Provide professional industry consulting services to help enterprises formulate development strategies and solutions.',
          icon: '💼'
        },
        {
          title: 'Technology Development',
          description: 'Professional technical team providing customized software development services for clients.',
          icon: '⚙️'
        },
        {
          title: 'Project Management',
          description: 'Experienced project management team ensuring projects are completed on time and with quality.',
          icon: '📊'
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
      name: 'two-columns',
      label: 'Two Columns Layout',
      props: {
        columns: 2
      }
    },
    {
      name: 'four-columns',
      label: 'Four Columns Layout',
      props: {
        columns: 4
      }
    }
  ],
  
  examples: [
    {
      name: 'consulting',
      label: 'Consulting Services',
      props: {
        title: 'Professional Consulting Services',
        subtitle: 'Providing professional guidance for your business development',
        services: [
          {
            title: 'Strategic Planning',
            description: 'Help enterprises formulate long-term development strategies and goal planning.',
            icon: '🎯'
          },
          {
            title: 'Market Analysis',
            description: 'In-depth analysis of market trends, providing data support for business decisions.',
            icon: '📈'
          }
        ]
      }
    }
  ]
};