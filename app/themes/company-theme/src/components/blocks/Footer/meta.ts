interface ComponentMeta {
  name: string;
  displayName: string;
  description: string;
  category: string;
  icon: string;
  props: Record<string, any>;
  preview: Record<string, any>;
}

const FooterMeta: ComponentMeta = {
  name: 'Footer',
  displayName: 'Site Footer',
  description: 'Main footer component with social links and copyright',
  category: 'block',
  icon: 'footer',
  props: {
    showSocial: {
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to show social media links'
    },
    showCopyright: {
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to show copyright information'
    },
    config: {
      type: 'object',
      required: false,
      description: 'Configuration object for the footer'
    }
  },
  preview: {
    width: 800,
    height: 120,
    background: '#f8fafc'
  }
};

export default FooterMeta;