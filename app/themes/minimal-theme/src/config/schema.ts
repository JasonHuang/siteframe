/**
 * Configuration Schema for Minimal Theme
 * 主题配置的验证模式
 */

const configSchema = {
  type: 'object',
  properties: {
    site: {
      type: 'object',
      properties: {
        title: { type: 'string', minLength: 1, maxLength: 100 },
        description: { type: 'string', maxLength: 200 },
        url: { type: 'string', format: 'uri' },
        language: { type: 'string', pattern: '^[a-z]{2}(-[A-Z]{2})?$' },
        author: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            email: { type: 'string', format: 'email' },
            url: { type: 'string', format: 'uri' }
          },
          required: ['name']
        }
      },
      required: ['title']
    },
    
    styles: {
      type: 'object',
      properties: {
        theme: { 
          type: 'string', 
          enum: ['light', 'dark', 'auto'],
          default: 'light'
        },
        primaryColor: { 
          type: 'string', 
          pattern: '^#[0-9a-fA-F]{6}$',
          default: '#0ea5e9'
        },
        fontFamily: { 
          type: 'string',
          enum: ['Inter', 'Georgia', 'Arial', 'Helvetica'],
          default: 'Inter'
        },
        fontSize: {
          type: 'string',
          enum: ['xs', 'sm', 'base', 'lg', 'xl'],
          default: 'base'
        },
        borderRadius: {
          type: 'string',
          enum: ['none', 'sm', 'base', 'md', 'lg', 'xl'],
          default: 'base'
        },
        animations: { type: 'boolean', default: true }
      }
    },
    
    layout: {
      type: 'object',
      properties: {
        containerMaxWidth: { 
          type: 'string',
          pattern: '^\\d+(px|rem|em|%)$',
          default: '1200px'
        },
        headerHeight: { 
          type: 'string',
          pattern: '^\\d+(px|rem|em)$',
          default: '64px'
        },
        footerHeight: { 
          type: 'string',
          pattern: '^(auto|\\d+(px|rem|em))$',
          default: 'auto'
        },
        sidebarWidth: { 
          type: 'string',
          pattern: '^\\d+(px|rem|em|%)$',
          default: '280px'
        },
        contentPadding: { 
          type: 'string',
          pattern: '^\\d+(px|rem|em)$',
          default: '1rem'
        }
      }
    },
    
    navigation: {
      type: 'object',
      properties: {
        showLogo: { type: 'boolean', default: true },
        showSearch: { type: 'boolean', default: false },
        showThemeToggle: { type: 'boolean', default: true },
        showLanguageSwitch: { type: 'boolean', default: false },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              label: { type: 'string', minLength: 1 },
              href: { type: 'string', minLength: 1 },
              active: { type: 'boolean', default: false }
            },
            required: ['label', 'href']
          },
          maxItems: 10
        }
      }
    },
    
    footer: {
      type: 'object',
      properties: {
        showSocial: { type: 'boolean', default: true },
        showCopyright: { type: 'boolean', default: true },
        showBackToTop: { type: 'boolean', default: true },
        socialLinks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              platform: { 
                type: 'string',
                enum: ['twitter', 'facebook', 'instagram', 'linkedin', 'github', 'youtube']
              },
              url: { type: 'string', format: 'uri' }
            },
            required: ['platform', 'url']
          },
          maxItems: 6
        },
        copyrightText: { type: 'string', maxLength: 200 }
      }
    },
    
    blog: {
      type: 'object',
      properties: {
        postsPerPage: { 
          type: 'integer', 
          minimum: 1, 
          maximum: 50,
          default: 10
        },
        showAuthor: { type: 'boolean', default: true },
        showDate: { type: 'boolean', default: true },
        showTags: { type: 'boolean', default: true },
        showExcerpt: { type: 'boolean', default: true },
        showReadingTime: { type: 'boolean', default: false },
        showComments: { type: 'boolean', default: false },
        dateFormat: { 
          type: 'string',
          enum: ['YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY', 'MMM DD, YYYY'],
          default: 'YYYY-MM-DD'
        }
      }
    },
    
    seo: {
      type: 'object',
      properties: {
        enableOpenGraph: { type: 'boolean', default: true },
        enableTwitterCard: { type: 'boolean', default: true },
        enableJsonLd: { type: 'boolean', default: true },
        defaultImage: { type: 'string' }
      }
    },
    
    performance: {
      type: 'object',
      properties: {
        enableLazyLoading: { type: 'boolean', default: true },
        enableImageOptimization: { type: 'boolean', default: true },
        enableCodeSplitting: { type: 'boolean', default: true },
        enableServiceWorker: { type: 'boolean', default: false }
      }
    },
    
    features: {
      type: 'object',
      properties: {
        darkMode: { type: 'boolean', default: true },
        search: { type: 'boolean', default: false },
        comments: { type: 'boolean', default: false },
        analytics: { type: 'boolean', default: false },
        newsletter: { type: 'boolean', default: false },
        rss: { type: 'boolean', default: true }
      }
    },
    
    customProperties: {
      type: 'object',
      patternProperties: {
        '^--[a-zA-Z][a-zA-Z0-9-]*$': {
          type: 'string'
        }
      },
      additionalProperties: false
    }
  },
  
  required: ['site'],
  additionalProperties: false
};

export default configSchema;