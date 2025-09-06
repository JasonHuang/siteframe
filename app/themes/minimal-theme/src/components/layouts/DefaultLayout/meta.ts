interface ComponentMeta {
  name: string;
  displayName: string;
  description: string;
  category: string;
  icon: string;
  props: Record<string, any>;
  preview: Record<string, any>;
}

const DefaultLayoutMeta: ComponentMeta = {
  name: 'DefaultLayout',
  displayName: 'Default Layout',
  description: 'The default layout component for pages',
  category: 'layout',
  icon: 'layout',
  props: {
    children: {
      type: 'ReactNode',
      required: true,
      description: 'The content to be rendered inside the layout'
    },
    config: {
      type: 'object',
      required: false,
      description: 'Configuration object for the layout'
    }
  },
  preview: {
    width: 800,
    height: 600,
    background: '#ffffff'
  }
};

export default DefaultLayoutMeta;