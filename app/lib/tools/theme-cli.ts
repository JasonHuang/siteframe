#!/usr/bin/env node

/**
 * 主题开发CLI工具
 * 提供命令行接口来创建和管理主题
 */

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { ThemeGenerator, THEME_TEMPLATES, generateTheme } from './theme-generator';
import { DesignTokens } from '../types/modern-theme';

// ============================================================================
// CLI 程序定义
// ============================================================================

const program = new Command();

program
  .name('theme-cli')
  .description('现代化主题系统开发工具')
  .version('1.0.0');

// ============================================================================
// 创建主题命令
// ============================================================================

program
  .command('create')
  .description('创建新主题')
  .argument('[theme-name]', '主题名称')
  .option('-t, --template <template>', '使用的模板名称')
  .option('-o, --output <dir>', '输出目录', './themes')
  .option('-a, --author <author>', '作者名称')
  .option('-d, --description <desc>', '主题描述')
  .option('-v, --version <version>', '版本号', '1.0.0')
  .option('--interactive', '交互式创建', true)
  .action(async (themeName, options) => {
    try {
      if (options.interactive || !themeName || !options.template) {
        await createThemeInteractive(themeName, options);
      } else {
        await createThemeDirect(themeName, options);
      }
    } catch (error) {
      console.error(chalk.red('❌ 创建主题失败:'), error.message);
      process.exit(1);
    }
  });

// ============================================================================
// 列出模板命令
// ============================================================================

program
  .command('list-templates')
  .description('列出可用的主题模板')
  .action(() => {
    console.log(chalk.blue('\n📋 可用的主题模板:\n'));
    
    Object.entries(THEME_TEMPLATES).forEach(([key, template]) => {
      console.log(chalk.green(`  ${key}`));
      console.log(chalk.gray(`    名称: ${template.name}`));
      console.log(chalk.gray(`    描述: ${template.description}`));
      console.log(chalk.gray(`    类别: ${template.category}`));
      console.log(chalk.gray(`    特性: ${template.features.join(', ')}`));
      console.log();
    });
  });

// ============================================================================
// 验证主题命令
// ============================================================================

program
  .command('validate')
  .description('验证主题结构')
  .argument('<theme-path>', '主题路径')
  .action(async (themePath) => {
    const spinner = ora('验证主题结构...').start();
    
    try {
      const isValid = await validateTheme(themePath);
      
      if (isValid) {
        spinner.succeed(chalk.green('✅ 主题结构验证通过'));
      } else {
        spinner.fail(chalk.red('❌ 主题结构验证失败'));
        process.exit(1);
      }
    } catch (error) {
      spinner.fail(chalk.red('❌ 验证过程中出错:') + ` ${error.message}`);
      process.exit(1);
    }
  });

// ============================================================================
// 构建主题命令
// ============================================================================

program
  .command('build')
  .description('构建主题')
  .argument('<theme-path>', '主题路径')
  .option('-o, --output <dir>', '输出目录', './dist')
  .option('--watch', '监听文件变化', false)
  .action(async (themePath, options) => {
    const spinner = ora('构建主题...').start();
    
    try {
      await buildTheme(themePath, options);
      spinner.succeed(chalk.green('✅ 主题构建完成'));
    } catch (error) {
      spinner.fail(chalk.red('❌ 构建失败:') + ` ${error.message}`);
      process.exit(1);
    }
  });

// ============================================================================
// 开发服务器命令
// ============================================================================

program
  .command('dev')
  .description('启动开发服务器')
  .argument('<theme-path>', '主题路径')
  .option('-p, --port <port>', '端口号', '3000')
  .option('--host <host>', '主机地址', 'localhost')
  .action(async (themePath, options) => {
    console.log(chalk.blue('🚀 启动开发服务器...'));
    
    try {
      await startDevServer(themePath, options);
    } catch (error) {
      console.error(chalk.red('❌ 启动开发服务器失败:'), error.message);
      process.exit(1);
    }
  });

// ============================================================================
// 交互式创建主题
// ============================================================================

async function createThemeInteractive(
  initialThemeName?: string,
  initialOptions: any = {}
): Promise<void> {
  console.log(chalk.blue('\n🎨 创建新主题\n'));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'themeName',
      message: '主题名称:',
      default: initialThemeName,
      validate: (input) => {
        if (!input.trim()) {
          return '请输入主题名称';
        }
        if (!/^[a-z0-9-]+$/.test(input)) {
          return '主题名称只能包含小写字母、数字和连字符';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'template',
      message: '选择模板:',
      choices: Object.entries(THEME_TEMPLATES).map(([key, template]) => ({
        name: `${template.name} - ${template.description}`,
        value: key
      })),
      default: initialOptions.template
    },
    {
      type: 'input',
      name: 'author',
      message: '作者名称:',
      default: initialOptions.author || process.env.USER || 'Anonymous'
    },
    {
      type: 'input',
      name: 'description',
      message: '主题描述:',
      default: initialOptions.description
    },
    {
      type: 'input',
      name: 'version',
      message: '版本号:',
      default: initialOptions.version || '1.0.0',
      validate: (input) => {
        if (!/^\d+\.\d+\.\d+$/.test(input)) {
          return '请输入有效的版本号 (例如: 1.0.0)';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'outputDir',
      message: '输出目录:',
      default: initialOptions.output || './themes'
    },
    {
      type: 'confirm',
      name: 'customizeColors',
      message: '是否自定义主色调?',
      default: false
    }
  ]);
  
  let customTokens: Partial<DesignTokens> | undefined;
  
  if (answers.customizeColors) {
    const colorAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'primaryColor',
        message: '主色调 (hex):',
        default: '#3b82f6',
        validate: (input) => {
          if (!/^#[0-9a-fA-F]{6}$/.test(input)) {
            return '请输入有效的十六进制颜色值 (例如: #3b82f6)';
          }
          return true;
        }
      }
    ]);
    
    // 生成色彩调色板
    customTokens = {
      colors: {
        primary: generateColorPalette(colorAnswers.primaryColor)
      }
    };
  }
  
  await createThemeDirect(answers.themeName, {
    template: answers.template,
    output: answers.outputDir,
    author: answers.author,
    description: answers.description,
    version: answers.version,
    customTokens
  });
}

// ============================================================================
// 直接创建主题
// ============================================================================

async function createThemeDirect(
  themeName: string,
  options: {
    template: string;
    output: string;
    author?: string;
    description?: string;
    version?: string;
    customTokens?: Partial<DesignTokens>;
  }
): Promise<void> {
  const spinner = ora(`创建主题 "${themeName}"...`).start();
  
  try {
    // 验证模板
    if (!ThemeGenerator.isValidTemplate(options.template)) {
      throw new Error(`无效的模板: ${options.template}`);
    }
    
    // 确保输出目录存在
    const outputDir = resolve(options.output);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    
    // 检查主题是否已存在
    const themeDir = join(outputDir, themeName);
    if (existsSync(themeDir)) {
      throw new Error(`主题目录已存在: ${themeDir}`);
    }
    
    // 生成主题
    await generateTheme(themeName, options.template, outputDir, {
      author: options.author,
      description: options.description,
      version: options.version,
      customTokens: options.customTokens
    });
    
    spinner.succeed(chalk.green(`✅ 主题 "${themeName}" 创建成功!`));
    
    // 显示后续步骤
    console.log(chalk.blue('\n📝 后续步骤:'));
    console.log(chalk.gray(`  cd ${themeDir}`));
    console.log(chalk.gray('  npm install'));
    console.log(chalk.gray('  npm run dev'));
    console.log();
    
  } catch (error) {
    spinner.fail(chalk.red('❌ 创建失败'));
    throw error;
  }
}

// ============================================================================
// 验证主题
// ============================================================================

async function validateTheme(themePath: string): Promise<boolean> {
  const themeDir = resolve(themePath);
  
  if (!existsSync(themeDir)) {
    throw new Error(`主题目录不存在: ${themeDir}`);
  }
  
  const requiredFiles = [
    'package.json',
    'index.ts',
    'src/components/index.ts',
    'src/styles/tokens.ts',
    'src/config/default.ts',
    'src/config/schema.ts'
  ];
  
  const missingFiles: string[] = [];
  
  for (const file of requiredFiles) {
    const filePath = join(themeDir, file);
    if (!existsSync(filePath)) {
      missingFiles.push(file);
    }
  }
  
  if (missingFiles.length > 0) {
    console.log(chalk.red('\n❌ 缺少必需文件:'));
    missingFiles.forEach(file => {
      console.log(chalk.gray(`  - ${file}`));
    });
    return false;
  }
  
  // 验证 package.json
  try {
    const packageJsonPath = join(themeDir, 'package.json');
    const packageJson = require(packageJsonPath);
    
    if (!packageJson.name || !packageJson.version) {
      console.log(chalk.red('❌ package.json 缺少必需字段 (name, version)'));
      return false;
    }
  } catch (error) {
    console.log(chalk.red('❌ package.json 格式错误'));
    return false;
  }
  
  return true;
}

// ============================================================================
// 构建主题
// ============================================================================

async function buildTheme(
  themePath: string,
  options: {
    output: string;
    watch: boolean;
  }
): Promise<void> {
  const themeDir = resolve(themePath);
  const outputDir = resolve(options.output);
  
  if (!existsSync(themeDir)) {
    throw new Error(`主题目录不存在: ${themeDir}`);
  }
  
  // 确保输出目录存在
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  
  // 这里可以集成实际的构建工具 (webpack, rollup, etc.)
  console.log(chalk.blue(`构建主题: ${themeDir}`));
  console.log(chalk.blue(`输出目录: ${outputDir}`));
  
  if (options.watch) {
    console.log(chalk.yellow('👀 监听文件变化...'));
    // 实现文件监听逻辑
  }
}

// ============================================================================
// 开发服务器
// ============================================================================

async function startDevServer(
  themePath: string,
  options: {
    port: string;
    host: string;
  }
): Promise<void> {
  const themeDir = resolve(themePath);
  
  if (!existsSync(themeDir)) {
    throw new Error(`主题目录不存在: ${themeDir}`);
  }
  
  console.log(chalk.blue(`主题目录: ${themeDir}`));
  console.log(chalk.blue(`服务器地址: http://${options.host}:${options.port}`));
  
  // 这里可以集成开发服务器 (webpack-dev-server, vite, etc.)
  console.log(chalk.yellow('🔧 开发服务器功能待实现...'));
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 生成颜色调色板
 */
function generateColorPalette(baseColor: string): Record<string, string> {
  // 简化的调色板生成逻辑
  // 实际应用中可以使用更复杂的颜色理论算法
  const palette: Record<string, string> = {
    500: baseColor
  };
  
  // 生成更浅的色调 (50-400)
  const lighterShades = [50, 100, 200, 300, 400];
  lighterShades.forEach((shade, index) => {
    const opacity = 0.1 + (index * 0.15);
    palette[shade.toString()] = adjustColorBrightness(baseColor, 1 + (0.8 - opacity));
  });
  
  // 生成更深的色调 (600-950)
  const darkerShades = [600, 700, 800, 900, 950];
  darkerShades.forEach((shade, index) => {
    const factor = 0.8 - (index * 0.15);
    palette[shade.toString()] = adjustColorBrightness(baseColor, factor);
  });
  
  return palette;
}

/**
 * 调整颜色亮度
 */
function adjustColorBrightness(hex: string, factor: number): string {
  // 移除 # 符号
  const color = hex.replace('#', '');
  
  // 转换为 RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // 调整亮度
  const newR = Math.round(Math.min(255, Math.max(0, r * factor)));
  const newG = Math.round(Math.min(255, Math.max(0, g * factor)));
  const newB = Math.round(Math.min(255, Math.max(0, b * factor)));
  
  // 转换回十六进制
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

// ============================================================================
// 启动 CLI
// ============================================================================

if (require.main === module) {
  program.parse();
}

export {
  createThemeInteractive,
  createThemeDirect,
  validateTheme,
  buildTheme,
  startDevServer,
  generateColorPalette
};