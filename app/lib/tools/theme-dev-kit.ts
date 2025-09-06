/**
 * 主题开发工具包
 * 提供主题验证、构建和开发辅助功能
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, resolve, extname, basename } from 'path';
import { ModernTheme, ThemeConfig, DesignTokens } from '../types/modern-theme';

// ============================================================================
// 主题验证器
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export class ThemeValidator {
  private themePath: string;
  private errors: string[] = [];
  private warnings: string[] = [];
  private suggestions: string[] = [];
  
  constructor(themePath: string) {
    this.themePath = resolve(themePath);
  }
  
  /**
   * 验证主题
   */
  async validate(): Promise<ValidationResult> {
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];
    
    // 检查目录结构
    this.validateDirectoryStructure();
    
    // 检查必需文件
    this.validateRequiredFiles();
    
    // 验证 package.json
    this.validatePackageJson();
    
    // 验证主题入口文件
    this.validateThemeIndex();
    
    // 验证组件结构
    this.validateComponents();
    
    // 验证配置文件
    this.validateConfig();
    
    // 验证样式文件
    this.validateStyles();
    
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      suggestions: this.suggestions
    };
  }
  
  /**
   * 验证目录结构
   */
  private validateDirectoryStructure(): void {
    if (!existsSync(this.themePath)) {
      this.errors.push(`主题目录不存在: ${this.themePath}`);
      return;
    }
    
    const requiredDirs = [
      'src',
      'src/components',
      'src/styles',
      'src/config'
    ];
    
    const recommendedDirs = [
      'src/components/layouts',
      'src/components/blocks',
      'src/components/widgets',
      'src/hooks',
      'src/utils',
      'src/types',
      'public',
      'docs',
      'examples'
    ];
    
    requiredDirs.forEach(dir => {
      const dirPath = join(this.themePath, dir);
      if (!existsSync(dirPath)) {
        this.errors.push(`缺少必需目录: ${dir}`);
      }
    });
    
    recommendedDirs.forEach(dir => {
      const dirPath = join(this.themePath, dir);
      if (!existsSync(dirPath)) {
        this.suggestions.push(`建议创建目录: ${dir}`);
      }
    });
  }
  
  /**
   * 验证必需文件
   */
  private validateRequiredFiles(): void {
    const requiredFiles = [
      'package.json',
      'index.ts',
      'src/components/index.ts',
      'src/styles/tokens.ts',
      'src/config/default.ts',
      'src/config/schema.ts'
    ];
    
    const recommendedFiles = [
      'README.md',
      'tsconfig.json',
      '.eslintrc.json',
      'tailwind.config.js'
    ];
    
    requiredFiles.forEach(file => {
      const filePath = join(this.themePath, file);
      if (!existsSync(filePath)) {
        this.errors.push(`缺少必需文件: ${file}`);
      }
    });
    
    recommendedFiles.forEach(file => {
      const filePath = join(this.themePath, file);
      if (!existsSync(filePath)) {
        this.suggestions.push(`建议创建文件: ${file}`);
      }
    });
  }
  
  /**
   * 验证 package.json
   */
  private validatePackageJson(): void {
    const packageJsonPath = join(this.themePath, 'package.json');
    
    if (!existsSync(packageJsonPath)) {
      return; // 已在 validateRequiredFiles 中报错
    }
    
    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      
      // 检查必需字段
      const requiredFields = ['name', 'version', 'description', 'main', 'types'];
      requiredFields.forEach(field => {
        if (!packageJson[field]) {
          this.errors.push(`package.json 缺少必需字段: ${field}`);
        }
      });
      
      // 检查主题命名规范
      if (packageJson.name && !packageJson.name.startsWith('@themes/')) {
        this.warnings.push('建议使用 @themes/ 命名空间');
      }
      
      // 检查依赖
      const requiredDeps = ['react', 'react-dom'];
      const deps = { ...packageJson.dependencies, ...packageJson.peerDependencies };
      
      requiredDeps.forEach(dep => {
        if (!deps[dep]) {
          this.warnings.push(`缺少依赖: ${dep}`);
        }
      });
      
      // 检查脚本
      const recommendedScripts = ['build', 'dev', 'lint', 'test'];
      recommendedScripts.forEach(script => {
        if (!packageJson.scripts?.[script]) {
          this.suggestions.push(`建议添加脚本: ${script}`);
        }
      });
      
    } catch (error) {
      this.errors.push('package.json 格式错误');
    }
  }
  
  /**
   * 验证主题入口文件
   */
  private validateThemeIndex(): void {
    const indexPath = join(this.themePath, 'index.ts');
    
    if (!existsSync(indexPath)) {
      return; // 已在 validateRequiredFiles 中报错
    }
    
    try {
      const content = readFileSync(indexPath, 'utf-8');
      
      // 检查必需的导出
      const requiredExports = [
        'metadata',
        'components',
        'styles',
        'configSchema',
        'defaultConfig'
      ];
      
      requiredExports.forEach(exportName => {
        if (!content.includes(exportName)) {
          this.warnings.push(`主题入口文件可能缺少: ${exportName}`);
        }
      });
      
      // 检查默认导出
      if (!content.includes('export default')) {
        this.errors.push('主题入口文件必须有默认导出');
      }
      
    } catch (error) {
      this.errors.push('无法读取主题入口文件');
    }
  }
  
  /**
   * 验证组件结构
   */
  private validateComponents(): void {
    const componentsPath = join(this.themePath, 'src/components');
    
    if (!existsSync(componentsPath)) {
      return; // 已在 validateDirectoryStructure 中报错
    }
    
    const componentTypes = ['layouts', 'blocks', 'widgets'];
    
    componentTypes.forEach(type => {
      const typePath = join(componentsPath, type);
      
      if (existsSync(typePath)) {
        this.validateComponentType(typePath, type);
      }
    });
  }
  
  /**
   * 验证特定类型的组件
   */
  private validateComponentType(typePath: string, type: string): void {
    const components = readdirSync(typePath).filter(item => {
      const itemPath = join(typePath, item);
      return statSync(itemPath).isDirectory();
    });
    
    if (components.length === 0) {
      this.warnings.push(`${type} 目录为空`);
      return;
    }
    
    components.forEach(component => {
      const componentPath = join(typePath, component);
      
      // 检查组件文件
      const indexFile = join(componentPath, 'index.tsx');
      const metaFile = join(componentPath, 'meta.ts');
      
      if (!existsSync(indexFile)) {
        this.errors.push(`组件 ${component} 缺少 index.tsx`);
      }
      
      if (!existsSync(metaFile)) {
        this.warnings.push(`组件 ${component} 缺少 meta.ts`);
      }
      
      // 验证组件内容
      if (existsSync(indexFile)) {
        this.validateComponentFile(indexFile, component);
      }
      
      if (existsSync(metaFile)) {
        this.validateComponentMeta(metaFile, component);
      }
    });
  }
  
  /**
   * 验证组件文件
   */
  private validateComponentFile(filePath: string, componentName: string): void {
    try {
      const content = readFileSync(filePath, 'utf-8');
      
      // 检查默认导出
      if (!content.includes('export default')) {
        this.errors.push(`组件 ${componentName} 缺少默认导出`);
      }
      
      // 检查 React 导入
      if (!content.includes('import React') && !content.includes('import { ')) {
        this.warnings.push(`组件 ${componentName} 可能缺少 React 导入`);
      }
      
      // 检查 TypeScript 接口
      if (!content.includes('interface') && !content.includes('type')) {
        this.suggestions.push(`建议为组件 ${componentName} 添加 TypeScript 接口`);
      }
      
    } catch (error) {
      this.errors.push(`无法读取组件文件: ${componentName}`);
    }
  }
  
  /**
   * 验证组件元数据
   */
  private validateComponentMeta(filePath: string, componentName: string): void {
    try {
      const content = readFileSync(filePath, 'utf-8');
      
      const requiredFields = ['name', 'displayName', 'description', 'category'];
      
      requiredFields.forEach(field => {
        if (!content.includes(`${field}:`)) {
          this.warnings.push(`组件 ${componentName} 元数据缺少字段: ${field}`);
        }
      });
      
    } catch (error) {
      this.warnings.push(`无法读取组件元数据: ${componentName}`);
    }
  }
  
  /**
   * 验证配置文件
   */
  private validateConfig(): void {
    const configPath = join(this.themePath, 'src/config');
    
    if (!existsSync(configPath)) {
      return; // 已在 validateDirectoryStructure 中报错
    }
    
    // 验证默认配置
    const defaultConfigPath = join(configPath, 'default.ts');
    if (existsSync(defaultConfigPath)) {
      this.validateConfigFile(defaultConfigPath, 'default');
    }
    
    // 验证配置 Schema
    const schemaPath = join(configPath, 'schema.ts');
    if (existsSync(schemaPath)) {
      this.validateConfigFile(schemaPath, 'schema');
    }
  }
  
  /**
   * 验证配置文件
   */
  private validateConfigFile(filePath: string, type: string): void {
    try {
      const content = readFileSync(filePath, 'utf-8');
      
      if (!content.includes('export default')) {
        this.errors.push(`配置文件 ${type} 缺少默认导出`);
      }
      
      if (type === 'default') {
        const requiredSections = ['site', 'layout', 'styles'];
        requiredSections.forEach(section => {
          if (!content.includes(`${section}:`)) {
            this.warnings.push(`默认配置缺少部分: ${section}`);
          }
        });
      }
      
    } catch (error) {
      this.errors.push(`无法读取配置文件: ${type}`);
    }
  }
  
  /**
   * 验证样式文件
   */
  private validateStyles(): void {
    const stylesPath = join(this.themePath, 'src/styles');
    
    if (!existsSync(stylesPath)) {
      return; // 已在 validateDirectoryStructure 中报错
    }
    
    // 验证设计令牌
    const tokensPath = join(stylesPath, 'tokens.ts');
    if (existsSync(tokensPath)) {
      this.validateTokensFile(tokensPath);
    }
    
    // 检查全局样式
    const globalStylesPath = join(stylesPath, 'globals.css');
    if (!existsSync(globalStylesPath)) {
      this.suggestions.push('建议创建全局样式文件: src/styles/globals.css');
    }
  }
  
  /**
   * 验证设计令牌文件
   */
  private validateTokensFile(filePath: string): void {
    try {
      const content = readFileSync(filePath, 'utf-8');
      
      if (!content.includes('export default')) {
        this.errors.push('设计令牌文件缺少默认导出');
      }
      
      const requiredTokens = ['colors', 'typography', 'spacing', 'breakpoints'];
      requiredTokens.forEach(token => {
        if (!content.includes(`${token}:`)) {
          this.warnings.push(`设计令牌缺少: ${token}`);
        }
      });
      
    } catch (error) {
      this.errors.push('无法读取设计令牌文件');
    }
  }
}

// ============================================================================
// 主题构建器
// ============================================================================

export interface BuildOptions {
  outputDir: string;
  minify?: boolean;
  sourcemap?: boolean;
  watch?: boolean;
  target?: 'es5' | 'es2015' | 'es2020';
}

export class ThemeBuilder {
  private themePath: string;
  
  constructor(themePath: string) {
    this.themePath = resolve(themePath);
  }
  
  /**
   * 构建主题
   */
  async build(options: BuildOptions): Promise<void> {
    const { outputDir, minify = true, sourcemap = true, target = 'es2020' } = options;
    
    // 确保输出目录存在
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    
    // 复制静态文件
    await this.copyStaticFiles(outputDir);
    
    // 编译 TypeScript
    await this.compileTypeScript(outputDir, { target, sourcemap });
    
    // 处理样式
    await this.processStyles(outputDir, { minify });
    
    // 生成类型定义
    await this.generateTypes(outputDir);
    
    // 创建包清单
    await this.createManifest(outputDir);
    
    console.log('✅ 主题构建完成');
  }
  
  /**
   * 复制静态文件
   */
  private async copyStaticFiles(outputDir: string): Promise<void> {
    const staticDirs = ['public', 'docs'];
    
    for (const dir of staticDirs) {
      const srcDir = join(this.themePath, dir);
      const destDir = join(outputDir, dir);
      
      if (existsSync(srcDir)) {
        await this.copyDirectory(srcDir, destDir);
      }
    }
    
    // 复制 package.json 和 README.md
    const files = ['package.json', 'README.md'];
    for (const file of files) {
      const srcFile = join(this.themePath, file);
      const destFile = join(outputDir, file);
      
      if (existsSync(srcFile)) {
        const content = readFileSync(srcFile, 'utf-8');
        writeFileSync(destFile, content);
      }
    }
  }
  
  /**
   * 编译 TypeScript
   */
  private async compileTypeScript(
    outputDir: string,
    options: { target: string; sourcemap: boolean }
  ): Promise<void> {
    // 这里应该集成实际的 TypeScript 编译器
    // 简化实现：直接复制 .ts 文件并重命名为 .js
    
    const srcDir = join(this.themePath, 'src');
    const destDir = join(outputDir, 'dist');
    
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    
    await this.copyDirectory(srcDir, destDir);
    
    console.log('📦 TypeScript 编译完成');
  }
  
  /**
   * 处理样式
   */
  private async processStyles(
    outputDir: string,
    options: { minify: boolean }
  ): Promise<void> {
    const stylesDir = join(this.themePath, 'src/styles');
    const outputStylesDir = join(outputDir, 'dist/styles');
    
    if (!existsSync(stylesDir)) {
      return;
    }
    
    if (!existsSync(outputStylesDir)) {
      mkdirSync(outputStylesDir, { recursive: true });
    }
    
    // 处理 CSS 文件
    const cssFiles = readdirSync(stylesDir).filter(file => 
      extname(file) === '.css'
    );
    
    for (const file of cssFiles) {
      const srcFile = join(stylesDir, file);
      const destFile = join(outputStylesDir, file);
      
      let content = readFileSync(srcFile, 'utf-8');
      
      if (options.minify) {
        // 简化的 CSS 压缩
        content = content
          .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
          .replace(/\s+/g, ' ') // 压缩空白
          .replace(/;\s*}/g, '}') // 移除最后的分号
          .trim();
      }
      
      writeFileSync(destFile, content);
    }
    
    console.log('🎨 样式处理完成');
  }
  
  /**
   * 生成类型定义
   */
  private async generateTypes(outputDir: string): Promise<void> {
    const typesDir = join(outputDir, 'dist/types');
    
    if (!existsSync(typesDir)) {
      mkdirSync(typesDir, { recursive: true });
    }
    
    // 生成主题类型定义
    const themeTypes = `
import { ModernTheme } from '@siteframe/modern-theme-system';

declare const theme: ModernTheme;
export default theme;

export * from './src/components';
export * from './src/hooks';
export * from './src/utils';
`;
    
    writeFileSync(join(typesDir, 'index.d.ts'), themeTypes);
    
    console.log('📝 类型定义生成完成');
  }
  
  /**
   * 创建包清单
   */
  private async createManifest(outputDir: string): Promise<void> {
    const packageJsonPath = join(this.themePath, 'package.json');
    
    if (!existsSync(packageJsonPath)) {
      return;
    }
    
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    
    const manifest = {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      author: packageJson.author,
      license: packageJson.license,
      buildTime: new Date().toISOString(),
      files: await this.getFileList(outputDir)
    };
    
    writeFileSync(
      join(outputDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    console.log('📋 包清单创建完成');
  }
  
  /**
   * 获取文件列表
   */
  private async getFileList(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    const scan = (currentDir: string, relativePath = '') => {
      const items = readdirSync(currentDir);
      
      for (const item of items) {
        const itemPath = join(currentDir, item);
        const relativeItemPath = join(relativePath, item);
        
        if (statSync(itemPath).isDirectory()) {
          scan(itemPath, relativeItemPath);
        } else {
          files.push(relativeItemPath);
        }
      }
    };
    
    scan(dir);
    return files;
  }
  
  /**
   * 复制目录
   */
  private async copyDirectory(src: string, dest: string): Promise<void> {
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }
    
    const items = readdirSync(src);
    
    for (const item of items) {
      const srcPath = join(src, item);
      const destPath = join(dest, item);
      
      if (statSync(srcPath).isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        const content = readFileSync(srcPath);
        writeFileSync(destPath, content);
      }
    }
  }
}

// ============================================================================
// 主题开发服务器
// ============================================================================

export interface DevServerOptions {
  port: number;
  host: string;
  open?: boolean;
  hot?: boolean;
}

export class ThemeDevServer {
  private themePath: string;
  
  constructor(themePath: string) {
    this.themePath = resolve(themePath);
  }
  
  /**
   * 启动开发服务器
   */
  async start(options: DevServerOptions): Promise<void> {
    const { port, host, open = true, hot = true } = options;
    
    console.log(`🚀 启动开发服务器...`);
    console.log(`📁 主题目录: ${this.themePath}`);
    console.log(`🌐 服务器地址: http://${host}:${port}`);
    
    if (hot) {
      console.log('🔥 热重载已启用');
    }
    
    // 这里应该集成实际的开发服务器
    // 例如 webpack-dev-server, vite 等
    
    console.log('⚠️  开发服务器功能需要集成具体的构建工具');
  }
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 验证主题
 */
export async function validateTheme(themePath: string): Promise<ValidationResult> {
  const validator = new ThemeValidator(themePath);
  return await validator.validate();
}

/**
 * 构建主题
 */
export async function buildTheme(
  themePath: string,
  options: BuildOptions
): Promise<void> {
  const builder = new ThemeBuilder(themePath);
  return await builder.build(options);
}

/**
 * 启动开发服务器
 */
export async function startDevServer(
  themePath: string,
  options: DevServerOptions
): Promise<void> {
  const server = new ThemeDevServer(themePath);
  return await server.start(options);
}

/**
 * 获取主题信息
 */
export function getThemeInfo(themePath: string): any {
  const packageJsonPath = join(themePath, 'package.json');
  
  if (!existsSync(packageJsonPath)) {
    throw new Error('找不到 package.json 文件');
  }
  
  try {
    return JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  } catch (error) {
    throw new Error('package.json 格式错误');
  }
}

/**
 * 检查主题兼容性
 */
export function checkCompatibility(
  themePath: string,
  systemVersion: string
): { compatible: boolean; issues: string[] } {
  const issues: string[] = [];
  
  try {
    const themeInfo = getThemeInfo(themePath);
    
    // 检查最低版本要求
    if (themeInfo.engines?.['modern-theme-system']) {
      const requiredVersion = themeInfo.engines['modern-theme-system'];
      // 这里应该实现版本比较逻辑
      console.log(`主题要求版本: ${requiredVersion}, 系统版本: ${systemVersion}`);
    }
    
    // 检查依赖
    const deps = { ...themeInfo.dependencies, ...themeInfo.peerDependencies };
    
    if (!deps.react) {
      issues.push('缺少 React 依赖');
    }
    
    return {
      compatible: issues.length === 0,
      issues
    };
    
  } catch (error) {
    return {
      compatible: false,
      issues: ['无法读取主题信息']
    };
  }
}