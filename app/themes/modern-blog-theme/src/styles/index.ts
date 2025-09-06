/**
 * Theme Styles - 主题样式
 * 定义主题的CSS变量和样式配置
 */

import tokens from './tokens';

// CSS变量生成函数
export const generateCSSVariables = () => {
  const cssVars: Record<string, string> = {};
  
  // 颜色变量
  Object.entries(tokens.colors).forEach(([category, colors]) => {
    if (typeof colors === 'object' && colors !== null) {
      Object.entries(colors).forEach(([shade, value]) => {
        cssVars[`--color-${category}-${shade}`] = String(value);
      });
    } else {
      cssVars[`--color-${category}`] = String(colors);
    }
  });
  
  // 字体变量
  Object.entries(tokens.typography.fontFamilies).forEach(([name, value]) => {
    cssVars[`--font-${name}`] = Array.isArray(value) ? value.join(', ') : String(value);
  });
  
  Object.entries(tokens.typography.fontSizes).forEach(([size, value]) => {
    cssVars[`--text-${size}`] = Array.isArray(value) ? String(value[0]) : String(value);
  });
  
  Object.entries(tokens.typography.lineHeights).forEach(([size, value]) => {
    cssVars[`--leading-${size}`] = String(value);
  });
  
  // 间距变量
  Object.entries(tokens.spacing).forEach(([size, value]) => {
    cssVars[`--spacing-${size}`] = String(value);
  });
  
  // 边框半径变量
  Object.entries(tokens.borderRadius).forEach(([size, value]) => {
    cssVars[`--radius-${size}`] = String(value);
  });
  
  // 阴影变量
  Object.entries(tokens.shadows).forEach(([size, value]) => {
    cssVars[`--shadow-${size}`] = String(value);
  });
  
  // 断点变量
  Object.entries(tokens.breakpoints).forEach(([size, value]) => {
    cssVars[`--screen-${size}`] = String(value);
  });
  
  // z-index变量
  Object.entries(tokens.zIndex).forEach(([level, value]) => {
    cssVars[`--z-${level}`] = String(value);
  });
  
  return cssVars;
};

// 生成CSS字符串
export const generateCSSString = () => {
  const variables = generateCSSVariables();
  const cssString = Object.entries(variables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
  
  return `:root {\n${cssString}\n}`;
};

// 主题样式配置
export const themeStyles = {
  // 基础样式
  base: {
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-base)',
    lineHeight: 'var(--leading-normal)',
    color: 'var(--color-foreground)',
    backgroundColor: 'var(--color-background)'
  },
  
  // 组件样式
  components: {
    button: {
      primary: {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-primary-foreground)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-2) var(--spacing-4)',
        fontSize: 'var(--text-sm)',
        fontWeight: '500',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: 'var(--color-primary-hover)'
        }
      },
      secondary: {
        backgroundColor: 'var(--color-secondary)',
        color: 'var(--color-secondary-foreground)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-2) var(--spacing-4)',
        fontSize: 'var(--text-sm)',
        fontWeight: '500',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: 'var(--color-secondary-hover)'
        }
      }
    },
    
    card: {
      backgroundColor: 'var(--color-card)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--spacing-6)',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: 'var(--shadow-md)'
      }
    },
    
    input: {
      backgroundColor: 'var(--color-background)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--spacing-2) var(--spacing-3)',
      fontSize: 'var(--text-sm)',
      color: 'var(--color-foreground)',
      transition: 'all 0.2s ease-in-out',
      '&:focus': {
        outline: 'none',
        borderColor: 'var(--color-primary)',
        boxShadow: '0 0 0 2px var(--color-primary-focus)'
      }
    }
  },
  
  // 布局样式
  layout: {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 var(--spacing-4)'
    },
    
    header: {
      backgroundColor: 'var(--color-card)',
      borderBottom: '1px solid var(--color-border)',
      padding: 'var(--spacing-4) 0'
    },
    
    footer: {
      backgroundColor: 'var(--color-muted)',
      borderTop: '1px solid var(--color-border)',
      padding: 'var(--spacing-12) 0'
    }
  }
};

// 导出所有样式相关内容
export { tokens };
export default {
  tokens,
  generateCSSVariables,
  generateCSSString,
  themeStyles
};