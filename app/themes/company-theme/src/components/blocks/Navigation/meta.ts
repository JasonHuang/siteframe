interface ComponentMeta {
  name: string;
  displayName: string;
  description: string;
  category: string;
  icon: string;
  props: Record<string, any>;
  preview: Record<string, any>;
}

const NavigationMeta: ComponentMeta = {
  name: 'Navigation',
  displayName: 'Navigation Menu',
  description: 'Navigation component for site menu links',
  category: 'block',
  icon: 'navigation',
  props: {
    items: {
      type: 'array',
      required: false,
      description: 'Array of navigation items with label, href, and active properties',
      default: [
        { label: 'Home', href: '/', active: true },
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' }
      ]
    },
    config: {
      type: 'object',
      required: false,
      description: 'Configuration object for the navigation'
    }
  },
  preview: {
    width: 600,
    height: 60,
    background: '#ffffff'
  }
};

export default NavigationMeta;