#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// 环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('缺少必要的环境变量: NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// 主题目录
const THEMES_DIR = path.join(process.cwd(), 'app/themes')

// 主题配置接口
interface ThemeConfig {
  name: string
  display_name: string
  description: string
  version: string
  author?: string
  homepage?: string
  repository?: string
  license?: string
  tags?: string[]
  preview_image?: string
  is_active?: boolean
}

/**
 * 读取主题配置文件
 */
function readThemeConfig(themePath: string): ThemeConfig | null {
  const configPath = path.join(themePath, 'theme.json')
  
  if (!fs.existsSync(configPath)) {
    console.warn(`主题配置文件不存在: ${configPath}`)
    return null
  }
  
  try {
    const configContent = fs.readFileSync(configPath, 'utf-8')
    return JSON.parse(configContent)
  } catch (error) {
    console.error(`读取主题配置失败: ${configPath}`, error)
    return null
  }
}

/**
 * 注册单个主题到数据库
 */
async function registerTheme(config: ThemeConfig): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('themes')
      .upsert({
        name: config.name,
        display_name: config.display_name,
        description: config.description,
        version: config.version,
        author: config.author || null,
        preview_image: config.preview_image || null,
        is_active: config.is_active || false,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'name'
      })
    
    if (error) {
      console.error(`注册主题失败: ${config.name}`, error)
      return false
    }
    
    console.log(`✓ 主题已注册: ${config.display_name} (${config.name})`)
    return true
  } catch (error) {
    console.error(`注册主题异常: ${config.name}`, error)
    return false
  }
}

/**
 * 扫描并注册所有主题
 */
async function registerAllThemes(): Promise<void> {
  console.log('开始注册主题...')
  
  if (!fs.existsSync(THEMES_DIR)) {
    console.error(`主题目录不存在: ${THEMES_DIR}`)
    return
  }
  
  const themeDirs = fs.readdirSync(THEMES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
  
  if (themeDirs.length === 0) {
    console.log('没有找到主题目录')
    return
  }
  
  let successCount = 0
  let totalCount = 0
  
  for (const themeDir of themeDirs) {
    const themePath = path.join(THEMES_DIR, themeDir)
    const config = readThemeConfig(themePath)
    
    if (config) {
      totalCount++
      const success = await registerTheme(config)
      if (success) {
        successCount++
      }
    }
  }
  
  console.log(`\n注册完成: ${successCount}/${totalCount} 个主题注册成功`)
}

/**
 * 激活指定主题
 */
async function activateTheme(themeName: string): Promise<void> {
  try {
    // 先取消所有主题的激活状态
    await supabase
      .from('themes')
      .update({ is_active: false })
      .neq('name', '')
    
    // 激活指定主题
    const { error } = await supabase
      .from('themes')
      .update({ is_active: true })
      .eq('name', themeName)
    
    if (error) {
      console.error(`激活主题失败: ${themeName}`, error)
      return
    }
    
    console.log(`✓ 主题已激活: ${themeName}`)
  } catch (error) {
    console.error(`激活主题异常: ${themeName}`, error)
  }
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    // 注册所有主题
    await registerAllThemes()
  } else if (args[0] === 'activate' && args[1]) {
    // 激活指定主题
    await activateTheme(args[1])
  } else {
    console.log('用法:')
    console.log('  注册所有主题: npm run register-themes')
    console.log('  激活主题: npm run register-themes activate <theme-name>')
  }
}

// 运行主函数
main().catch(console.error)