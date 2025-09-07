export default {
  name: 'Hero',
  displayName: 'Hero Section',
  description: 'Hero section at the top of the homepage for displaying key information and call-to-action',
  category: 'layout',
  icon: '🎯',
  
  props: {
    title: {
      type: 'string',
      label: 'Main Title',
      default: 'Welcome to Our Enterprise',
      description: 'Main title of the hero section'
    },
    subtitle: {
      type: 'string',
      label: 'Subtitle',
      default: 'Professional · Innovative · Reliable',
      description: 'Subtitle of the hero section'
    },
    description: {
      type: 'textarea',
      label: 'Description Text',
      default: 'We are committed to providing customers with the highest quality products and services, using professional technology and innovative concepts to help your business development.',
      description: 'Detailed description of the hero section'
    },
    ctaText: {
      type: 'string',
      label: 'Button Text',
      default: 'Learn More',
      description: 'Text for the call-to-action button'
    },
    ctaLink: {
      type: 'string',
      label: 'Button Link',
      default: '/about',
      description: 'Link address for the call-to-action button'
    },
    backgroundImage: {
      type: 'image',
      label: 'Background Image',
      description: 'Background image for the hero section (optional)'
    }
  },
  
  variants: [
    {
      name: 'default',
      label: 'Default Style',
      props: {}
    },
    {
      name: 'with-background',
      label: 'With Background Image',
      props: {
        backgroundImage: '/images/hero-bg.jpg'
      }
    }
  ],
  
  examples: [
    {
      name: 'corporate',
      label: 'Corporate Homepage',
      props: {
        title: 'Professional Enterprise Services',
        subtitle: 'Trusted Business Partner',
        description: 'We provide comprehensive professional services for enterprises to help your business grow.',
        ctaText: 'Contact Us',
        ctaLink: '/contact'
      }
    }
  ]
};