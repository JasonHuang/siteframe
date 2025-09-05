#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ 缺少必要的环境变量：')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function rebuildDatabase() {
  console.log('🚀 开始重建数据库...')
  
  try {
    // 读取重建脚本
    const rebuildScript = readFileSync(join(__dirname, '../database/rebuild-database.sql'), 'utf8')
    const schemaScript = readFileSync(join(__dirname, '..', 'database', 'schema.sql'), 'utf8')
    
    console.log('\n📋 重建步骤：')
    console.log('1. 清理现有数据库结构')
    console.log('2. 重新创建表和策略')
    console.log('3. 插入初始数据')
    
    console.log('\n⚠️  警告：此操作将删除所有现有数据！')
    console.log('\n请手动在 Supabase 控制台执行以下步骤：')
    console.log('\n=== 步骤 1: 清理现有结构 ===')
    console.log('在 SQL 编辑器中执行以下 SQL：')
    console.log('\n```sql')
    console.log(rebuildScript)
    console.log('```')
    
    console.log('\n=== 步骤 2: 重建数据库结构 ===')
    console.log('然后执行 database/schema.sql 文件：')
    console.log('\n```sql')
    console.log(schemaScript)
    console.log('```')
    
    console.log('\n✅ 重建完成后，请运行以下命令清理本地数据：')
    console.log('npx tsx scripts/clear-auth-users.ts')
    console.log('npx tsx scripts/clear-users.ts')
    
    console.log('\n🎯 然后可以重新测试应用程序')
    
  } catch (error) {
    console.error('❌ 重建过程中出现错误：', error)
    process.exit(1)
  }
}

rebuildDatabase()