import fs from 'fs/promises';
import path from 'path';
import type { Theme, CreateThemeInput } from '../types/theme';
import { ThemeService } from './themes';
import { createClient } from '@supabase/supabase-js';
import { themeHookManager } from './theme-hooks';

/**
 * 主题扫描和自动注册服务
 * 提供比 WordPress 更用户友好的主题发现机制
 */
export class ThemeScannerService {
  private themesDirectory: string;
  private registeredThemes: Set<string> = new Set();
  private themeService: ThemeService;

  constructor(themesDirectory: string = './app/themes') {
    this.themesDirectory = path.resolve(themesDirectory);
    
    // 使用服务角色密钥创建 Supabase 客户端，绕过 RLS 策略
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration for theme scanner');
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    this.themeService = new ThemeService(supabaseAdmin);
  }

  /**
   * 扫描主题目录并自动注册所有有效主题
   */
  async scanAndRegisterThemes(): Promise<{
    discovered: number;
    registered: number;
    errors: Array<{ theme: string; error: string }>;
  }> {
    const result = {
      discovered: 0,
      registered: 0,
      errors: [] as Array<{ theme: string; error: string }>
    };

    try {
      const themeDirectories = await this.discoverThemeDirectories();
      result.discovered = themeDirectories.length;

      for (const themeDir of themeDirectories) {
        try {
          const themeData = await this.loadThemeFromDirectory(themeDir);
          if (themeData) {
            await this.registerThemeIfNotExists(themeData);
            result.registered++;
          }
        } catch (error) {
          result.errors.push({
            theme: path.basename(themeDir),
            error: error instanceof Error ? error.message : '未知错误'
          });
        }
      }
    } catch (error) {
      result.errors.push({
        theme: 'scanner',
        error: `扫描失败: ${error instanceof Error ? error.message : '未知错误'}`
      });
    }

    return result;
  }

  /**
   * 发现主题目录
   * 自动识别包含有效主题配置的目录
   */
  private async discoverThemeDirectories(): Promise<string[]> {
    const themeDirectories: string[] = [];

    try {
      const entries = await fs.readdir(this.themesDirectory, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const themeDir = path.join(this.themesDirectory, entry.name);
          
          // 检查是否是有效的主题目录
          if (await this.isValidThemeDirectory(themeDir)) {
            themeDirectories.push(themeDir);
          }
        }
      }
    } catch (error) {
      console.error('扫描主题目录失败:', error);
    }

    return themeDirectories;
  }

  /**
   * 检查目录是否包含有效的主题
   * 支持多种主题配置格式
   */
  private async isValidThemeDirectory(themeDir: string): Promise<boolean> {
    const requiredFiles = [
      'index.ts',     // TypeScript 主题入口
      'index.js',     // JavaScript 主题入口
      'theme.json',   // JSON 配置文件
      'package.json'  // NPM 包配置
    ];

    // 检查是否存在任一必需文件
    for (const file of requiredFiles) {
      try {
        const filePath = path.join(themeDir, file);
        await fs.access(filePath);
        return true;
      } catch {
        // 文件不存在，继续检查下一个
      }
    }

    return false;
  }

  /**
   * 从目录加载主题数据
   * 支持多种配置格式的自动识别
   */
  private async loadThemeFromDirectory(themeDir: string): Promise<CreateThemeInput | null> {
    const themeName = path.basename(themeDir);

    try {
      // 1. 尝试加载 TypeScript/JavaScript 主题
      const tsTheme = await this.loadTSTheme(themeDir);
      if (tsTheme) return tsTheme;

      // 2. 尝试加载 JSON 配置主题
      const jsonTheme = await this.loadJSONTheme(themeDir);
      if (jsonTheme) return jsonTheme;

      // 3. 尝试从 package.json 加载主题信息
      const packageTheme = await this.loadPackageTheme(themeDir);
      if (packageTheme) return packageTheme;

      console.warn(`无法识别主题格式: ${themeName}`);
      return null;
    } catch (error) {
      console.error(`加载主题失败 ${themeName}:`, error);
      return null;
    }
  }

  /**
   * 加载 TypeScript/JavaScript 主题
   */
  private async loadTSTheme(themeDir: string): Promise<CreateThemeInput | null> {
    const indexFiles = ['index.ts', 'index.js'];
    
    for (const indexFile of indexFiles) {
      try {
        const indexPath = path.join(themeDir, indexFile);
        await fs.access(indexPath);
        
        // 读取文件内容并尝试解析（避免动态导入）
        const fileContent = await fs.readFile(indexPath, 'utf-8');
        
        // 简单的主题名称提取（从目录名）
        const themeName = path.basename(themeDir);
        
        return {
          name: themeName,
          display_name: themeName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: `主题: ${themeName}`,
          config: {},
          is_active: false
        };
      } catch {
        // 文件不存在或读取失败，继续尝试下一个
      }
    }
    
    return null;
  }

  /**
   * 加载 JSON 配置主题
   */
  private async loadJSONTheme(themeDir: string): Promise<CreateThemeInput | null> {
    try {
      const configPath = path.join(themeDir, 'theme.json');
      const configContent = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(configContent);
      
      if (config.name) {
        return {
          name: config.name,
          display_name: config.displayName || config.name,
          description: config.description || '',
          config: config.config || config.settings || {},
          is_active: false
        };
      }
    } catch {
      // 文件不存在或解析失败
    }
    
    return null;
  }

  /**
   * 从 package.json 加载主题信息
   */
  private async loadPackageTheme(themeDir: string): Promise<CreateThemeInput | null> {
    try {
      const packagePath = path.join(themeDir, 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf-8');
      const packageData = JSON.parse(packageContent);
      
      // 检查是否是主题包
      if (packageData.keywords?.includes('theme') || packageData.theme) {
        const themeName = path.basename(themeDir);
        
        return {
          name: packageData.name || themeName,
          display_name: packageData.displayName || packageData.name || themeName,
          description: packageData.description || '',
          config: packageData.theme || {},
          is_active: false
        };
      }
    } catch {
      // 文件不存在或解析失败
    }
    
    return null;
  }

  /**
   * 注册主题（如果不存在）
   */
  private async registerThemeIfNotExists(themeData: CreateThemeInput): Promise<void> {
    console.log(`🔍 检查主题是否存在: ${themeData.name}`);
    console.log(`📋 主题数据:`, JSON.stringify(themeData, null, 2));
    
    // 检查主题是否已存在
    console.log(`🔍 调用 themeService.getThemeByName(${themeData.name})`);
    const existingTheme = await this.themeService.getThemeByName(themeData.name);
    console.log(`🔍 查询结果:`, JSON.stringify(existingTheme, null, 2));
    
    if (existingTheme.error || !existingTheme.data) {
      console.log(`➕ 主题不存在，开始注册: ${themeData.name}`);
      
      // 自动加载主题钩子
      const themePath = path.join(this.themesDirectory, themeData.name);
      console.log(`🪝 加载主题钩子: ${themePath}`);
      await themeHookManager.autoLoadThemeHooks(themeData.name, themePath);
      
      // 执行注册前钩子
      console.log(`🪝 执行注册前钩子`);
      const modifiedThemeData = await themeHookManager.executeBeforeRegister(themeData);
      console.log(`🪝 钩子处理后的主题数据:`, JSON.stringify(modifiedThemeData, null, 2));
      
      // 主题不存在，创建新主题
      console.log(`💾 调用 themeService.createTheme`);
      const result = await this.themeService.createTheme(modifiedThemeData);
      console.log(`💾 创建结果:`, JSON.stringify(result, null, 2));
      
      if (result.error) {
        console.error(`❌ 注册主题失败:`, result.error);
        throw new Error(`注册主题失败: ${result.error}`);
      }
      
      if (result.data) {
        console.log(`🪝 执行注册后钩子`);
        // 执行注册后钩子
        await themeHookManager.executeAfterRegister(result.data);
      }
      
      this.registeredThemes.add(themeData.name);
      console.log(`✅ 主题已注册: ${themeData.display_name}`);
    } else {
      console.log(`ℹ️ 主题已存在: ${themeData.display_name}`);
      
      // 即使主题已存在，也尝试加载钩子（用于热重载）
      const themePath = path.join(this.themesDirectory, themeData.name);
      console.log(`🪝 为已存在主题加载钩子: ${themePath}`);
      await themeHookManager.autoLoadThemeHooks(themeData.name, themePath);
    }
  }

  /**
   * 监听主题目录变化并自动注册新主题
   * 注意：此功能暂时禁用以避免服务器端编译问题
   */
  async watchThemeDirectory(): Promise<void> {
    console.log('⚠️ 文件监听功能暂时禁用，请使用手动检测功能');
    return;
    
    // TODO: 在客户端环境中启用文件监听
    // 目前chokidar在Next.js服务器端编译时会导致问题
  }

  /**
   * 轻量级检测新主题（不注册）
   */
  async detectNewThemes(): Promise<{
    newThemes: string[];
    existingThemes: string[];
  }> {
    const result = {
      newThemes: [] as string[],
      existingThemes: [] as string[]
    };

    try {
      const themeDirectories = await this.discoverThemeDirectories();
      
      for (const themeDir of themeDirectories) {
        const themeName = path.basename(themeDir);
        
        // 检查主题是否已在数据库中注册
        const existingTheme = await this.themeService.getThemeByName(themeName);
        
        if (existingTheme.error || !existingTheme.data) {
          result.newThemes.push(themeName);
        } else {
          result.existingThemes.push(themeName);
        }
      }
    } catch (error) {
      console.error('检测新主题失败:', error);
    }

    return result;
  }

  /**
   * 检测并自动注册新主题
   */
  async detectAndRegisterNewThemes(): Promise<{
    detected: number;
    registered: number;
    errors: Array<{ theme: string; error: string }>;
  }> {
    const result = {
      detected: 0,
      registered: 0,
      errors: [] as Array<{ theme: string; error: string }>
    };

    try {
      const detection = await this.detectNewThemes();
      result.detected = detection.newThemes.length;

      for (const themeName of detection.newThemes) {
        try {
          const themeDir = path.join(this.themesDirectory, themeName);
          const themeData = await this.loadThemeFromDirectory(themeDir);
          
          if (themeData) {
            await this.registerThemeIfNotExists(themeData);
            result.registered++;
          }
        } catch (error) {
          result.errors.push({
            theme: themeName,
            error: error instanceof Error ? error.message : '未知错误'
          });
        }
      }
    } catch (error) {
      result.errors.push({
        theme: 'detector',
        error: `检测失败: ${error instanceof Error ? error.message : '未知错误'}`
      });
    }

    return result;
  }

  /**
   * 获取已注册的主题列表
   */
  getRegisteredThemes(): string[] {
    return Array.from(this.registeredThemes);
  }

  /**
   * 生成主题开发模板
   */
  async generateThemeTemplate(themeName: string, template: 'minimal' | 'modern' = 'minimal'): Promise<void> {
    const themeDir = path.join(this.themesDirectory, themeName);
    
    try {
      // 创建主题目录
      await fs.mkdir(themeDir, { recursive: true });
      
      // 生成基础文件
      await this.generateThemeFiles(themeDir, themeName, template);
      
      console.log(`🎨 主题模板已生成: ${themeName}`);
      console.log(`📁 位置: ${themeDir}`);
      console.log(`🚀 运行 'npm run theme:scan' 来注册主题`);
    } catch (error) {
      throw new Error(`生成主题模板失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 生成主题文件
   */
  private async generateThemeFiles(themeDir: string, themeName: string, template: string): Promise<void> {
    const displayName = themeName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    // 生成 package.json
    const packageJson = {
      name: themeName,
      version: '1.0.0',
      description: `${displayName} theme for SiteFrame`,
      keywords: ['theme', 'siteframe'],
      author: 'Theme Developer',
      license: 'MIT',
      theme: {
        name: themeName,
        displayName,
        description: `A ${template} theme for SiteFrame`,
        version: '1.0.0'
      }
    };
    
    await fs.writeFile(
      path.join(themeDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // 生成 theme.json
    const themeConfig = {
      name: themeName,
      displayName,
      description: `A ${template} theme for SiteFrame`,
      version: '1.0.0',
      author: 'Theme Developer',
      config: {
        colors: {
          primary: '#3b82f6',
          secondary: '#64748b',
          background: '#ffffff',
          text: '#1f2937'
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '16px',
          lineHeight: '1.6'
        },
        layout: {
          maxWidth: '1200px',
          padding: '1rem'
        }
      }
    };
    
    await fs.writeFile(
      path.join(themeDir, 'theme.json'),
      JSON.stringify(themeConfig, null, 2)
    );

    // 生成 README.md
    const readme = `# ${displayName}

${themeConfig.description}

## 安装

1. 将主题文件放置在 \`app/themes/${themeName}\` 目录
2. 运行 \`npm run theme:scan\` 扫描并注册主题
3. 在主题管理界面激活主题

## 配置

主题支持以下配置选项：

- **颜色**: 自定义主色调、背景色等
- **字体**: 设置字体家族、大小、行高
- **布局**: 调整最大宽度、内边距等

## 开发

要自定义此主题，请编辑 \`theme.json\` 文件中的配置选项。

## 许可证

MIT
`;
    
    await fs.writeFile(path.join(themeDir, 'README.md'), readme);
  }
}

// 导出单例实例
export const themeScannerService = new ThemeScannerService();