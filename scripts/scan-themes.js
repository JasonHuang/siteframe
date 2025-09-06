#!/usr/bin/env node

/**
 * 主题扫描脚本
 * 用于扫描和注册主题到系统中
 */

require('dotenv').config({ path: '.env.local' });

const { ThemeScannerService } = require('../app/lib/services/theme-scanner');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');

class ThemeScannerCLI {
  constructor() {
    this.scanner = new ThemeScannerService();
    this.themesDir = path.join(process.cwd(), 'app/themes');
  }

  async scanThemes() {
    console.log('🔍 开始扫描主题...');
    
    try {
      const result = await this.scanner.scanAndRegisterThemes();
      
      console.log('✅ 主题扫描完成!');
      console.log(`📊 扫描结果:`);
       console.log(`   - 发现主题: ${result.discovered}`);
       console.log(`   - 注册成功: ${result.registered}`);
       
       if (result.errors.length > 0) {
         console.log(`❌ 错误 (${result.errors.length}):`);
         result.errors.forEach(error => {
           console.log(`   - ${error.theme}: ${error.error}`);
         });
       }
      
      return result;
    } catch (error) {
      console.error('❌ 扫描失败:', error.message);
      process.exit(1);
    }
  }

  async watchThemes() {
    console.log('👀 开始监听主题目录变化...');
    console.log(`📁 监听目录: ${this.themesDir}`);
    
    const watcher = chokidar.watch(this.themesDir, {
      ignored: /(^|[\/\\])\../, // 忽略隐藏文件
      persistent: true,
      ignoreInitial: false
    });

    watcher
      .on('add', (filePath) => {
        if (path.basename(filePath) === 'theme.json') {
          console.log(`📄 发现新主题配置: ${filePath}`);
          this.handleThemeChange(path.dirname(filePath));
        }
      })
      .on('change', (filePath) => {
        if (path.basename(filePath) === 'theme.json') {
          console.log(`📝 主题配置更新: ${filePath}`);
          this.handleThemeChange(path.dirname(filePath));
        }
      })
      .on('unlink', (filePath) => {
        if (path.basename(filePath) === 'theme.json') {
          console.log(`🗑️ 主题配置删除: ${filePath}`);
          // 这里可以添加删除主题的逻辑
        }
      });

    console.log('✅ 监听已启动，按 Ctrl+C 停止');
    
    // 初始扫描
    await this.scanThemes();
  }

  async handleThemeChange(themeDir) {
    try {
      const themeName = path.basename(themeDir);
      console.log(`🔄 处理主题变化: ${themeName}`);
      
      const result = await this.scanner.scanAndRegisterThemes();
      console.log(`✅ 主题 ${themeName} 处理完成`);
    } catch (error) {
      console.error(`❌ 处理主题变化失败:`, error.message);
    }
  }

  showHelp() {
    console.log(`
🎨 主题扫描工具
`);
    console.log('用法:');
    console.log('  npm run theme:scan          # 扫描并注册所有主题');
    console.log('  npm run theme:watch         # 监听主题变化并自动注册');
    console.log('  npm run theme:generate      # 生成新主题模板\n');
    
    console.log('主题目录结构:');
    console.log('  app/themes/');
    console.log('  ├── theme-name/');
    console.log('  │   ├── theme.json          # 主题配置文件');
    console.log('  │   ├── layouts/            # 布局组件');
    console.log('  │   ├── blocks/             # 区块组件');
    console.log('  │   ├── styles/             # 样式文件');
    console.log('  │   └── hooks/              # 钩子函数\n');
    
    console.log('theme.json 格式:');
    console.log('  {');
    console.log('    "name": "主题名称",');
    console.log('    "version": "1.0.0",');
    console.log('    "description": "主题描述",');
    console.log('    "author": "作者",');
    console.log('    "layouts": ["default", "post"],');
    console.log('    "blocks": ["header", "footer"],');
    console.log('    "designTokens": { ... }');
    console.log('  }\n');
  }
}

// 主程序
async function main() {
  const args = process.argv.slice(2);
  const cli = new ThemeScannerCLI();

  if (args.includes('--help') || args.includes('-h')) {
    cli.showHelp();
    return;
  }

  if (args.includes('--watch') || args.includes('-w')) {
    await cli.watchThemes();
  } else {
    await cli.scanThemes();
  }
}

// 错误处理
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ 未处理的 Promise 拒绝:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ 未捕获的异常:', error);
  process.exit(1);
});

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n👋 再见!');
  process.exit(0);
});

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ThemeScannerCLI };