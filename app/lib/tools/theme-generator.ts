/**
 * 主题生成器
 * 用于快速创建新主题的脚手架工具
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { ModernTheme, ThemeConfig, DesignTokens, ComponentMeta } from '../types/modern-theme';

// ============================================================================
// 主题模板定义
// ============================================================================

interface ThemeTemplate {
  name: string;
  description: string;
  category: 'blog' | 'portfolio' | 'business' | 'ecommerce' | 'landing' | 'custom';
  features: string[];
  designTokens: Partial<DesignTokens>;
  components: string[];
  layouts: string[];
}

const THEME_TEMPLATES: Record<string, ThemeTemplate> = {
  minimal: {
    name: 'Minimal',
    description: '简洁现代的极简主题',
    category: 'blog',
    features: ['responsive', 'dark-mode', 'typography'],
    designTokens: {
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        }
      } as any
    },
    components: ['Header', 'Footer', 'PostCard', 'Navigation'],
    layouts: ['DefaultLayout', 'PostLayout']
  },
  
  business: {
    name: 'Business Pro',
    description: '专业的商务主题',
    category: 'business',
    features: ['responsive', 'animations', 'forms', 'testimonials'],
    designTokens: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        }
      } as any
    },
    components: ['Hero', 'Services', 'Team', 'Contact', 'Testimonials'],
    layouts: ['HomeLayout', 'ServiceLayout', 'ContactLayout']
  },
  
  portfolio: {
    name: 'Creative Portfolio',
    description: '创意作品展示主题',
    category: 'portfolio',
    features: ['gallery', 'animations', 'lightbox', 'filtering'],
    designTokens: {
      colors: {
        primary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e'
        }
      } as any
    },
    components: ['Gallery', 'ProjectCard', 'Filter', 'Lightbox'],
    layouts: ['PortfolioLayout', 'ProjectLayout']
  }
};

// ============================================================================
// 主题生成器类
// ============================================================================

export class ThemeGenerator {
  private outputDir: string;
  private themeName: string = '';
  private template: ThemeTemplate | null = null;
  
  constructor(outputDir: string) {
    this.outputDir = outputDir;
  }
  
  /**
   * 生成新主题
   */
  async generateTheme(
    themeName: string,
    templateName: string,
    options: {
      author?: string;
      description?: string;
      version?: string;
      license?: string;
      customTokens?: Partial<DesignTokens>;
      additionalComponents?: string[];
    } = {}
  ): Promise<void> {
    this.themeName = themeName;
    const template = THEME_TEMPLATES[templateName];
    
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }
    
    this.template = template;
    
    const themeDir = join(this.outputDir, themeName);
    
    // 创建主题目录结构
    this.createDirectoryStructure(themeDir);
    
    // 生成主题文件
    await this.generateThemeFiles(themeDir, options);
    
    console.log(`✅ Theme '${themeName}' generated successfully at ${themeDir}`);
  }
  
  /**
   * 创建目录结构
   */
  private createDirectoryStructure(themeDir: string): void {
    const directories = [
      '',
      'src',
      'src/components',
      'src/components/layouts',
      'src/components/blocks',
      'src/components/widgets',
      'src/styles',
      'src/hooks',
      'src/utils',
      'src/types',
      'public',
      'public/images',
      'docs',
      'examples'
    ];
    
    directories.forEach(dir => {
      const fullPath = join(themeDir, dir);
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
      }
    });
  }
  
  /**
   * 生成主题文件
   */
  private async generateThemeFiles(
    themeDir: string,
    options: {
      author?: string;
      description?: string;
      version?: string;
      license?: string;
      customTokens?: Partial<DesignTokens>;
      additionalComponents?: string[];
    }
  ): Promise<void> {
    // 生成 package.json
    this.generatePackageJson(themeDir, options);
    
    // 生成主题入口文件
    this.generateThemeIndex(themeDir, options);
    
    // 生成设计令牌
    this.generateDesignTokens(themeDir, options.customTokens);
    
    // 生成组件
    this.generateComponents(themeDir, options.additionalComponents);
    
    // 生成样式文件
    this.generateStyles(themeDir);
    
    // 生成配置文件
    this.generateConfig(themeDir);
    
    // 生成文档
    this.generateDocumentation(themeDir, options);
    
    // 生成示例
    this.generateExamples(themeDir);
    
    // 生成开发工具配置
    this.generateDevConfig(themeDir);
  }
  
  /**
   * 生成 package.json
   */
  private generatePackageJson(
    themeDir: string,
    options: {
      author?: string;
      description?: string;
      version?: string;
      license?: string;
    }
  ): void {
    if (!this.template) throw new Error('Template not initialized');
    
    const packageJson = {
      name: `@themes/${this.themeName}`,
      version: options.version || '1.0.0',
      description: options.description || this.template.description,
      author: options.author || 'Theme Generator',
      license: options.license || 'MIT',
      main: 'dist/index.js',
      types: 'dist/index.d.ts',
      files: [
        'dist',
        'src',
        'public',
        'README.md'
      ],
      scripts: {
        build: 'tsc && npm run build:styles',
        'build:styles': 'postcss src/styles/globals.css -o dist/styles.css',
        dev: 'tsc --watch',
        lint: 'eslint src --ext .ts,.tsx',
        'lint:fix': 'eslint src --ext .ts,.tsx --fix',
        test: 'jest',
        'test:watch': 'jest --watch',
        storybook: 'storybook dev -p 6006',
        'build-storybook': 'storybook build'
      },
      dependencies: {
        react: '^18.0.0',
        'react-dom': '^18.0.0'
      },
      devDependencies: {
        '@types/react': '^18.0.0',
        '@types/react-dom': '^18.0.0',
        typescript: '^5.0.0',
        '@storybook/react': '^7.0.0',
        '@storybook/addon-essentials': '^7.0.0',
        postcss: '^8.0.0',
        tailwindcss: '^3.0.0',
        eslint: '^8.0.0',
        jest: '^29.0.0'
      },
      peerDependencies: {
        react: '>=18.0.0',
        'react-dom': '>=18.0.0'
      },
      keywords: [
        'theme',
        'react',
        'nextjs',
        'modern-theme-system',
        ...this.template.features,
        this.template.category
      ],
      repository: {
        type: 'git',
        url: `https://github.com/themes/${this.themeName}.git`
      },
      bugs: {
        url: `https://github.com/themes/${this.themeName}/issues`
      },
      homepage: `https://github.com/themes/${this.themeName}#readme`
    };
    
    writeFileSync(
      join(themeDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
  }
  
  /**
   * 生成主题入口文件
   */
  private generateThemeIndex(
    themeDir: string,
    options: {
      author?: string;
      description?: string;
      version?: string;
    }
  ): void {
    if (!this.template) throw new Error('Template not initialized');
    
    const indexContent = `/**
 * ${this.template.name} Theme
 * ${this.template.description}
 * 
 * @author ${options.author || 'Theme Generator'}
 * @version ${options.version || '1.0.0'}
 */

import React from 'react';
import { ModernTheme } from '@siteframe/modern-theme-system';

// 导入组件
${this.template.layouts.map(layout => 
  `import ${layout} from './src/components/layouts/${layout}';`
).join('\n')}

${this.template.components.map(component => 
  `import ${component} from './src/components/blocks/${component}';`
).join('\n')}

// 导入样式和配置
import designTokens from './src/styles/tokens';
import defaultConfig from './src/config/default';
import configSchema from './src/config/schema';

// 导入组件元数据
${this.template.layouts.map(layout => 
  `import ${layout}Meta from './src/components/layouts/${layout}/meta';`
).join('\n')}

${this.template.components.map(component => 
  `import ${component}Meta from './src/components/blocks/${component}/meta';`
).join('\n')}

const theme: ModernTheme = {
  metadata: {
    name: '${this.themeName}',
    version: '${options.version || '1.0.0'}',
    author: '${options.author || 'Theme Generator'}',
    description: '${options.description || this.template.description}',
    homepage: 'https://github.com/themes/${this.themeName}',
    repository: 'https://github.com/themes/${this.themeName}.git',
    license: 'MIT',
    tags: [${this.template.features.map(f => `'${f}'`).join(', ')}],
    screenshot: './public/images/screenshot.png',
    compatibility: {
      minVersion: '1.0.0'
    }
  },
  
  components: {
    layouts: {
      ${this.template.layouts.map(layout => `${layout}`).join(',\n      ')}
    },
    blocks: {
      ${this.template.components.map(component => `${component}`).join(',\n      ')}
    },
    widgets: {}
  },
  
  componentMeta: {
    layouts: {
      ${this.template.layouts.map(layout => `${layout}: ${layout}Meta`).join(',\n      ')}
    },
    blocks: {
      ${this.template.components.map(component => `${component}: ${component}Meta`).join(',\n      ')}
    },
    widgets: {}
  },
  
  styles: {
    tokens: designTokens,
    themes: {
      light: {
        'background': 'var(--color-neutral-50)',
        'foreground': 'var(--color-neutral-900)',
        'primary': 'var(--color-primary-500)',
        'secondary': 'var(--color-secondary-500)'
      },
      dark: {
        'background': 'var(--color-neutral-900)',
        'foreground': 'var(--color-neutral-50)',
        'primary': 'var(--color-primary-400)',
        'secondary': 'var(--color-secondary-400)'
      }
    },
    globalCSS: \`
      * {
        box-sizing: border-box;
      }
      
      body {
        margin: 0;
        font-family: var(--font-sans);
        background: var(--background);
        color: var(--foreground);
      }
    \`
  },
  
  hooks: {
    'theme:init': async (context) => {
      console.log('${this.template.name} theme initialized');
    }
  },
  
  configSchema,
  defaultConfig,
  
  templates: {},
  
  features: {
    customizer: true,
    darkMode: ${this.template.features.includes('dark-mode')},
    rtl: false,
    multiLanguage: false
  }
};

export default theme;
export * from './src/components';
export * from './src/hooks';
export * from './src/utils';
`;
    
    writeFileSync(join(themeDir, 'index.ts'), indexContent);
  }
  
  /**
   * 生成设计令牌
   */
  private generateDesignTokens(
    themeDir: string,
    customTokens?: Partial<DesignTokens>
  ): void {
    if (!this.template) throw new Error('Template not initialized');
    
    const tokens = {
      ...this.template.designTokens,
      ...customTokens,
      typography: {
        fontFamilies: {
          sans: 'system-ui, -apple-system, sans-serif',
          serif: 'Georgia, serif',
          mono: 'Menlo, Monaco, monospace'
        },
        fontSizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem'
        },
        fontWeights: {
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700
        },
        lineHeights: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75
        }
      },
      spacing: {
        px: '1px',
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem'
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        base: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px'
      },
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
      },
      breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      },
      zIndex: {
        auto: 0,
        base: 1,
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modal: 1040,
        popover: 1050,
        tooltip: 1060
      }
    };
    
    const tokensContent = `/**
 * ${this.template.name} Design Tokens
 */

import { DesignTokens } from '@siteframe/modern-theme-system';

const designTokens: DesignTokens = ${JSON.stringify(tokens, null, 2)};

export default designTokens;
`;
    
    writeFileSync(join(themeDir, 'src/styles/tokens.ts'), tokensContent);
  }
  
  /**
   * 生成组件
   */
  private generateComponents(
    themeDir: string,
    additionalComponents: string[] = []
  ): void {
    if (!this.template) throw new Error('Template not initialized');
    
    const allComponents = [...this.template.components, ...additionalComponents];
    const allLayouts = this.template.layouts;
    
    // 生成布局组件
    allLayouts.forEach(layout => {
      this.generateLayoutComponent(themeDir, layout);
    });
    
    // 生成块组件
    allComponents.forEach(component => {
      this.generateBlockComponent(themeDir, component);
    });
    
    // 生成组件索引文件
    this.generateComponentIndex(themeDir, allLayouts, allComponents);
  }
  
  /**
   * 生成布局组件
   */
  private generateLayoutComponent(themeDir: string, layoutName: string): void {
    const componentDir = join(themeDir, 'src/components/layouts', layoutName);
    mkdirSync(componentDir, { recursive: true });
    
    // 组件文件
    const componentContent = `/**
 * ${layoutName} Layout Component
 */

import React, { ReactNode } from 'react';
import { useTheme } from '@siteframe/modern-theme-system';

interface ${layoutName}Props {
  children: ReactNode;
  className?: string;
}

export default function ${layoutName}({ children, className = '' }: ${layoutName}Props) {
  const { config } = useTheme();
  
  return (
    <div className={\`${layoutName.toLowerCase()}-layout \${className}\`}>
      {/* Header */}
      {config?.layout?.header?.enabled && (
        <header className="layout-header">
          <h1>{config.site.title}</h1>
        </header>
      )}
      
      {/* Main Content */}
      <main className="layout-main">
        {children}
      </main>
      
      {/* Footer */}
      {config?.layout?.footer?.enabled && (
        <footer className="layout-footer">
          <p>&copy; 2024 {config.site.title}</p>
        </footer>
      )}
    </div>
  );
}
`;
    
    writeFileSync(join(componentDir, 'index.tsx'), componentContent);
    
    // 元数据文件
    const metaContent = `/**
 * ${layoutName} Layout Metadata
 */

import { ComponentMeta } from '@siteframe/modern-theme-system';

const meta: ComponentMeta = {
  name: '${layoutName}',
  displayName: '${layoutName} Layout',
  description: '${layoutName} layout component',
  category: 'layout',
  props: {
    children: {
      type: 'ReactNode',
      description: 'Layout content',
      required: true
    },
    className: {
      type: 'string',
      description: 'Additional CSS classes',
      required: false
    }
  }
};

export default meta;
`;
    
    writeFileSync(join(componentDir, 'meta.ts'), metaContent);
  }
  
  /**
   * 生成块组件
   */
  private generateBlockComponent(themeDir: string, componentName: string): void {
    const componentDir = join(themeDir, 'src/components/blocks', componentName);
    mkdirSync(componentDir, { recursive: true });
    
    // 组件文件
    const componentContent = `/**
 * ${componentName} Block Component
 */

import React from 'react';
import { useTheme } from '@siteframe/modern-theme-system';

interface ${componentName}Props {
  title?: string;
  content?: string;
  className?: string;
}

export default function ${componentName}({ 
  title = 'Default Title',
  content = 'Default content',
  className = '' 
}: ${componentName}Props) {
  const { theme } = useTheme();
  
  return (
    <div className={\`${componentName.toLowerCase()}-block \${className}\`}>
      {title && <h2 className="block-title">{title}</h2>}
      {content && <div className="block-content">{content}</div>}
    </div>
  );
}
`;
    
    writeFileSync(join(componentDir, 'index.tsx'), componentContent);
    
    // 元数据文件
    const metaContent = `/**
 * ${componentName} Block Metadata
 */

import { ComponentMeta } from '@siteframe/modern-theme-system';

const meta: ComponentMeta = {
  name: '${componentName}',
  displayName: '${componentName} Block',
  description: '${componentName} block component',
  category: 'block',
  props: {
    title: {
      type: 'string',
      description: 'Block title',
      required: false,
      default: 'Default Title'
    },
    content: {
      type: 'string',
      description: 'Block content',
      required: false,
      default: 'Default content'
    },
    className: {
      type: 'string',
      description: 'Additional CSS classes',
      required: false
    }
  },
  preview: {
    props: {
      title: 'Sample Title',
      content: 'This is a sample content for the ${componentName} component.'
    }
  }
};

export default meta;
`;
    
    writeFileSync(join(componentDir, 'meta.ts'), metaContent);
  }
  
  /**
   * 生成组件索引文件
   */
  private generateComponentIndex(
    themeDir: string,
    layouts: string[],
    components: string[]
  ): void {
    const indexContent = `/**
 * Components Index
 */

// Layouts
${layouts.map(layout => 
  `export { default as ${layout} } from './layouts/${layout}';`
).join('\n')}

// Blocks
${components.map(component => 
  `export { default as ${component} } from './blocks/${component}';`
).join('\n')}

// Widgets
// Add widget exports here
`;
    
    writeFileSync(join(themeDir, 'src/components/index.ts'), indexContent);
  }
  
  /**
   * 生成样式文件
   */
  private generateStyles(themeDir: string): void {
    if (!this.template) throw new Error('Template not initialized');
    
    const globalCSS = `/**
 * Global Styles for ${this.template.name}
*/

@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Custom styles */
.layout-header {
  @apply bg-white shadow-sm border-b;
}

.layout-main {
  @apply min-h-screen;
}

.layout-footer {
  @apply bg-gray-50 border-t py-8;
}

.block-title {
  @apply text-2xl font-bold mb-4;
}

.block-content {
  @apply prose max-w-none;
}

/* Theme-specific styles */
${this.template.category === 'portfolio' ? `
.gallery-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

.project-card {
  @apply bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow;
}
` : ''}

${this.template.category === 'business' ? `
.hero-section {
  @apply bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20;
}

.service-card {
  @apply bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow;
}
` : ''}
`;
    
    writeFileSync(join(themeDir, 'src/styles/globals.css'), globalCSS);
    
    // Tailwind 配置
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './examples/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          950: 'var(--color-primary-950)'
        }
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        serif: 'var(--font-serif)',
        mono: 'var(--font-mono)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ]
};
`;
    
    writeFileSync(join(themeDir, 'tailwind.config.js'), tailwindConfig);
  }
  
  /**
   * 生成配置文件
   */
  private generateConfig(themeDir: string): void {
    const configDir = join(themeDir, 'src/config');
    mkdirSync(configDir, { recursive: true });
    
    // 默认配置
    const defaultConfig = {
      site: {
        title: `My ${this.template.name} Site`,
        description: `A website built with ${this.template.name} theme`,
        logo: '/images/logo.png',
        favicon: '/favicon.ico'
      },
      layout: {
        header: {
          enabled: true,
          sticky: true,
          transparent: false
        },
        footer: {
          enabled: true,
          columns: 3
        },
        sidebar: {
          enabled: false,
          position: 'right' as const,
          width: '300px'
        }
      },
      styles: {
        theme: 'light',
        primaryColor: '#3b82f6',
        fontFamily: 'Inter',
        fontSize: '16px'
      },
      features: {
        search: this.template.features.includes('search'),
        comments: this.template.features.includes('comments'),
        newsletter: this.template.features.includes('newsletter'),
        analytics: false
      },
      custom: {}
    };
    
    const defaultConfigContent = `/**
 * Default Theme Configuration
 */

import { ThemeConfig } from '@siteframe/modern-theme-system';

const defaultConfig: ThemeConfig = ${JSON.stringify(defaultConfig, null, 2)};

export default defaultConfig;
`;
    
    writeFileSync(join(configDir, 'default.ts'), defaultConfigContent);
    
    // 配置 Schema
    const configSchema = {
      type: 'object',
      properties: {
        site: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            logo: { type: 'string' },
            favicon: { type: 'string' }
          },
          required: ['title', 'description']
        },
        layout: {
          type: 'object',
          properties: {
            header: {
              type: 'object',
              properties: {
                enabled: { type: 'boolean' },
                sticky: { type: 'boolean' },
                transparent: { type: 'boolean' }
              }
            },
            footer: {
              type: 'object',
              properties: {
                enabled: { type: 'boolean' },
                columns: { type: 'number', minimum: 1, maximum: 6 }
              }
            }
          }
        },
        styles: {
          type: 'object',
          properties: {
            theme: { type: 'string', enum: ['light', 'dark', 'auto'] },
            primaryColor: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' },
            fontFamily: { type: 'string' },
            fontSize: { type: 'string' }
          }
        }
      },
      required: ['site']
    };
    
    const schemaContent = `/**
 * Theme Configuration Schema
 */

import { JSONSchema7 } from 'json-schema';

const configSchema: JSONSchema7 = ${JSON.stringify(configSchema, null, 2)};

export default configSchema;
`;
    
    writeFileSync(join(configDir, 'schema.ts'), schemaContent);
  }
  
  /**
   * 生成文档
   */
  private generateDocumentation(
    themeDir: string,
    options: {
      author?: string;
      description?: string;
      version?: string;
    }
  ): void {
    if (!this.template) throw new Error('Template not initialized');
    
    const readmeContent = `# ${this.template.name}\n\n${options.description || this.template.description}

## Features

${this.template.features.map(feature => `- ${feature}`).join('\n')}

## Installation

\`\`\`bash
npm install @themes/${this.themeName}
\`\`\`

## Usage

\`\`\`tsx
import theme from '@themes/${this.themeName}';
import { ThemeProvider } from '@siteframe/modern-theme-system';

function App() {
  return (
    <ThemeProvider initialTheme={{ id: '${this.themeName}', source: { type: 'npm', package: '@themes/${this.themeName}' } }}>
      {/* Your app content */}
    </ThemeProvider>
  );
}
\`\`\`

## Components

### Layouts

${this.template.layouts.map(layout => `- **${layout}**: ${layout} layout component`).join('\n')}

### Blocks

${this.template.components.map(component => `- **${component}**: ${component} block component`).join('\n')}

## Configuration

The theme can be configured through the theme configuration object:

\`\`\`tsx
const config = {
  site: {
    title: 'My Site',
    description: 'My awesome website'
  },
  styles: {
    theme: 'light',
    primaryColor: '#3b82f6'
  }
};
\`\`\`

## Development

\`\`\`bash
# Install dependencies
npm install

# Start development
npm run dev

# Build theme
npm run build

# Run tests
npm test

# Start Storybook
npm run storybook
\`\`\`

## License

MIT © ${options.author || 'Theme Generator'}
`;
    
    writeFileSync(join(themeDir, 'README.md'), readmeContent);
    
    // 组件文档
    const componentDocsContent = `# Components Documentation

## Overview

This theme includes the following components:

## Layouts

${this.template.layouts.map(layout => `### ${layout}

Description of ${layout} layout.

**Props:**
- \`children\`: ReactNode - Layout content
- \`className\`: string - Additional CSS classes

**Usage:**
\`\`\`tsx
import { ${layout} } from '@themes/${this.themeName}';

<${layout}>
  <div>Your content here</div>
</${layout}>
\`\`\`
`).join('\n')}

## Blocks

${this.template.components.map(component => `### ${component}

Description of ${component} block.

**Props:**
- \`title\`: string - Block title
- \`content\`: string - Block content
- \`className\`: string - Additional CSS classes

**Usage:**
\`\`\`tsx
import { ${component} } from '@themes/${this.themeName}';

<${component} title="My Title" content="My content" />
\`\`\`
`).join('\n')}
`;
    
    writeFileSync(join(themeDir, 'docs/components.md'), componentDocsContent);
  }
  
  /**
   * 生成示例
   */
  private generateExamples(themeDir: string): void {
    if (!this.template) throw new Error('Template not initialized');
    
    const exampleContent = `/**
 * Theme Usage Example
 */

import React from 'react';
import theme from '../index';
import { ThemeProvider, ThemeComponent } from '@siteframe/modern-theme-system';

export default function ExampleApp() {
  return (
    <ThemeProvider 
      initialTheme={{ 
        id: '${this.themeName}', 
        source: { type: 'local', path: '../index' } 
      }}
    >
      <ThemeComponent type="layout" name="${this.template.layouts[0]}">
        ${this.template.components.map(component => 
          `<ThemeComponent type="block" name="${component}" props={{ title: "${component} Example" }} />`
        ).join('\n        ')}
      </ThemeComponent>
    </ThemeProvider>
  );
}
`;
    
    writeFileSync(join(themeDir, 'examples/basic.tsx'), exampleContent);
  }
  
  /**
   * 生成开发工具配置
   */
  private generateDevConfig(themeDir: string): void {
    // TypeScript 配置
    const tsConfig = {
      compilerOptions: {
        target: 'ES2020',
        lib: ['DOM', 'DOM.Iterable', 'ES6'],
        allowJs: true,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: false,
        declaration: true,
        outDir: 'dist',
        jsx: 'react-jsx'
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', 'examples']
    };
    
    writeFileSync(
      join(themeDir, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );
    
    // ESLint 配置
    const eslintConfig = {
      extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
      ],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'react', 'react-hooks'],
      rules: {
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/no-explicit-any': 'warn'
      },
      settings: {
        react: {
          version: 'detect'
        }
      }
    };
    
    writeFileSync(
      join(themeDir, '.eslintrc.json'),
      JSON.stringify(eslintConfig, null, 2)
    );
    
    // Storybook 配置
    const storybookDir = join(themeDir, '.storybook');
    mkdirSync(storybookDir, { recursive: true });
    
    const storybookMain = `module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-docs'
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  }
};
`;
    
    writeFileSync(join(storybookDir, 'main.js'), storybookMain);
  }
  
  /**
   * 获取可用模板列表
   */
  static getAvailableTemplates(): Record<string, ThemeTemplate> {
    return THEME_TEMPLATES;
  }
  
  /**
   * 验证模板名称
   */
  static isValidTemplate(templateName: string): boolean {
    return templateName in THEME_TEMPLATES;
  }
}

// 导出工具函数
export function generateTheme(
  themeName: string,
  templateName: string,
  outputDir: string,
  options?: {
    author?: string;
    description?: string;
    version?: string;
    license?: string;
    customTokens?: Partial<DesignTokens>;
    additionalComponents?: string[];
  }
): Promise<void> {
  const generator = new ThemeGenerator(outputDir);
  return generator.generateTheme(themeName, templateName, options);
}

export { THEME_TEMPLATES };
export type { ThemeTemplate };