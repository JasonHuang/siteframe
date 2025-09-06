interface ComponentMeta {
  name: string;
  displayName: string;
  description: string;
  category: string;
  icon: string;
  props: Record<string, any>;
  preview: Record<string, any>;
}

const PostCardMeta: ComponentMeta = {
  name: 'PostCard',
  displayName: 'Post Card',
  description: 'Card component for displaying blog post information',
  category: 'block',
  icon: 'card',
  props: {
    title: {
      type: 'string',
      required: false,
      default: 'Sample Post Title',
      description: 'The title of the post'
    },
    excerpt: {
      type: 'string',
      required: false,
      description: 'Brief excerpt of the post content'
    },
    author: {
      type: 'string',
      required: false,
      description: 'Author of the post'
    },
    date: {
      type: 'string',
      required: false,
      description: 'Publication date of the post'
    },
    tags: {
      type: 'array',
      required: false,
      description: 'Tags associated with the post'
    },
    showAuthor: {
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to show the author information'
    },
    showDate: {
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to show the publication date'
    },
    showTags: {
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to show the tags'
    },
    showExcerpt: {
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to show the post excerpt'
    },
    variant: {
      type: 'string',
      required: false,
      default: 'default',
      enum: ['default', 'featured'],
      description: 'Visual variant of the post card'
    },
    config: {
      type: 'object',
      required: false,
      description: 'Configuration object for the post card'
    }
  },
  preview: {
    width: 400,
    height: 300,
    background: '#ffffff'
  }
};

export default PostCardMeta;