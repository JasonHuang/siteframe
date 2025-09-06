#!/usr/bin/env node

/**
 * 主题生成脚本
 * 用法: npm run theme:generate <主题名> [模板类型]
 */

import { themeScannerService } from '../app/lib/services/theme-scanner';
import * as readline from 'readline';
import * as path from 'path';
import * as fs from 'fs';

// 颜色输出工具
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorLog(color: keyof typeof colors, message: string) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function printHeader() {
  console.log('');
  colorLog('magenta', '🎨 SiteFrame 主题生成器');
  console.log('━'.repeat(50));
  console.log('');
}

function printUsage() {
  console.log('');
  colorLog('bright', '用法:');
  console.log('  npm run theme:generate <主题名> [模板类型]');
  console.log('');
  colorLog('bright', '参数:');
  console.log('  主题名      - 主题的名称（必需）');
  console.log('  模板类型    - minimal | modern（可选，默认: minimal）');
  console.log('');
  colorLog('bright', '示例:');
  console.log('  npm run theme:generate my-blog-theme');
  console.log('  npm run theme:generate corporate-site modern');
  console.log('');
  colorLog('bright', '生成的主题结构:');
  console.log('  app/themes/<主题名>/');
  console.log('  ├── package.json     # NPM 包配置');
  console.log('  ├── theme.json       # 主题配置');
  console.log('  ├── README.md        # 主题说明');
  console.log('  └── src/             # 源代码目录（可选）');
  console.log('');
}

function validateThemeName(name: string): boolean {
  // 检查主题名称格式
  const nameRegex = /^[a-z][a-z0-9-]*[a-z0-9]$/;
  return nameRegex.test(name) && name.length >= 3 && name.length <= 50;
}

function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function askQuestion(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function interactiveMode(): Promise<{ themeName: string; template: 'minimal' | 'modern' }> {
  const rl = createReadlineInterface();
  
  try {
    colorLog('cyan', '🤖 交互式主题生成');
    console.log('');
    
    // 获取主题名称
    let themeName = '';
    while (!themeName) {
      const input = await askQuestion(rl, '请输入主题名称（例如: my-blog-theme）: ');
      
      if (!input) {
        colorLog('yellow', '⚠️ 主题名称不能为空');
        continue;
      }
      
      if (!validateThemeName(input)) {
        colorLog('yellow', '⚠️ 主题名称格式不正确');
        console.log('   • 只能包含小写字母、数字和连字符');
        console.log('   • 必须以字母开头，以字母或数字结尾');
        console.log('   • 长度在 3-50 个字符之间');
        continue;
      }
      
      themeName = input;
    }
    
    // 获取模板类型
    console.log('');
    colorLog('blue', '选择主题模板:');
    console.log('  1. minimal - 简洁模板（推荐新手）');
    console.log('  2. modern  - 现代模板（功能丰富）');
    console.log('');
    
    let template: 'minimal' | 'modern' = 'minimal';
    const templateInput = await askQuestion(rl, '请选择模板类型 [1-2] (默认: 1): ');
    
    if (templateInput === '2' || templateInput.toLowerCase() === 'modern') {
      template = 'modern';
    }
    
    return { themeName, template };
  } finally {
    rl.close();
  }
}

async function generateTheme(themeName: string, template: 'minimal' | 'modern') {
  try {
    // 检查主题是否已存在
    const themeDir = path.resolve(`./app/themes/${themeName}`);
    
    try {
      await fs.promises.access(themeDir);
      colorLog('red', `❌ 主题目录已存在: ${themeName}`);
      console.log('');
      colorLog('yellow', '💡 提示: 请选择不同的主题名称或删除现有目录');
      process.exit(1);
    } catch {
      // 目录不存在，可以继续
    }
    
    colorLog('blue', `🚀 正在生成主题: ${themeName}`);
    colorLog('cyan', `📋 使用模板: ${template}`);
    console.log('');
    
    // 生成主题
    await themeScannerService.generateThemeTemplate(themeName, template);
    
    console.log('');
    colorLog('green', '🎉 主题生成成功！');
    console.log('');
    
    // 显示后续步骤
    colorLog('bright', '📋 后续步骤:');
    console.log(`  1. 编辑主题配置: app/themes/${themeName}/theme.json`);
    console.log(`  2. 自定义主题样式和组件`);
    console.log(`  3. 运行扫描命令: npm run theme:scan`);
    console.log(`  4. 在管理后台激活主题`);
    console.log('');
    
    colorLog('cyan', '💡 有用的命令:');
    console.log('  npm run theme:scan        # 扫描并注册主题');
    console.log('  npm run theme:watch       # 监听主题变化');
    console.log('  npm run dev               # 启动开发服务器');
    console.log('');
    
  } catch (error) {
    colorLog('red', `❌ 生成主题失败: ${error instanceof Error ? error.message : '未知错误'}`);
    process.exit(1);
  }
}

async function main() {
  printHeader();
  
  const args = process.argv.slice(2);
  const hasHelp = args.includes('--help') || args.includes('-h');
  
  if (hasHelp) {
    printUsage();
    return;
  }
  
  let themeName = args[0];
  let template: 'minimal' | 'modern' = 'minimal';
  
  // 如果没有提供参数，启动交互模式
  if (!themeName) {
    const result = await interactiveMode();
    themeName = result.themeName;
    template = result.template;
  } else {
    // 验证主题名称
    if (!validateThemeName(themeName)) {
      colorLog('red', '❌ 主题名称格式不正确');
      console.log('');
      colorLog('yellow', '主题名称要求:');
      console.log('  • 只能包含小写字母、数字和连字符');
      console.log('  • 必须以字母开头，以字母或数字结尾');
      console.log('  • 长度在 3-50 个字符之间');
      console.log('');
      colorLog('cyan', '示例: my-blog-theme, corporate-site, portfolio-2024');
      process.exit(1);
    }
    
    // 获取模板类型
    const templateArg = args[1];
    if (templateArg === 'modern') {
      template = 'modern';
    } else if (templateArg && templateArg !== 'minimal') {
      colorLog('yellow', `⚠️ 未知模板类型: ${templateArg}，使用默认模板: minimal`);
    }
  }
  
  await generateTheme(themeName, template);
}

// 错误处理
process.on('unhandledRejection', (error) => {
  console.error('');
  colorLog('red', `❌ 未处理的错误: ${error}`);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('');
  colorLog('yellow', '👋 操作已取消');
  process.exit(0);
});

// 运行主函数
main().catch((error) => {
  console.error('');
  colorLog('red', `❌ 执行失败: ${error instanceof Error ? error.message : '未知错误'}`);
  process.exit(1);
});