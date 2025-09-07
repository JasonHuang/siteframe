interface ComponentMeta {
  name: string;
  displayName: string;
  description: string;
  category: string;
  icon: string;
  props: Record<string, any>;
  preview: Record<string, any>;
}

const HeaderMeta: ComponentMeta = {
  name: 'Header',
  displayName: 'Site Header',
  description: 'Main header component with navigation and branding',
  category: 'block',
  icon: 'header',
  props: {
    showNavigation: {
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to show the navigation menu'
    },
    showLogo: {
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to show the site logo'
    },
    config: {
      type: 'object',
      required: false,
      description: 'Configuration object for the header'
    }
  },
  preview: {
    width: 800,
    height: 80,
    background: '#ffffff'
  }
};

export default HeaderMeta;