interface ComponentMeta {
  name: string;
  displayName: string;
  description: string;
  category: string;
  icon: string;
  props: Record<string, any>;
  preview: Record<string, any>;
}

const PostLayoutMeta: ComponentMeta = {
  name: 'PostLayout',
  displayName: 'Post Layout',
  description: 'Layout component specifically designed for blog posts',
  category: 'layout',
  icon: 'article',
  props: {
    children: {
      type: 'ReactNode',
      required: true,
      description: 'The post content to be rendered'
    },
    config: {
      type: 'object',
      required: false,
      description: 'Configuration object for the post layout'
    }
  },
  preview: {
    width: 800,
    height: 600,
    background: '#ffffff'
  }
};

export default PostLayoutMeta;