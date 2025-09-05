import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// 加载环境变量
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('缺少必要的环境变量')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function createUserTable() {
  try {
    console.log('🏗️ 尝试创建用户表...')
    
    // 尝试查询用户表，如果不存在会报错
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('❌ 用户表不存在，错误信息:', error.message)
      console.log('📋 请手动在 Supabase 控制台执行以下 SQL:')
      console.log('\n' + '='.repeat(80))
      console.log(`
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar TEXT,
  role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('ADMIN', 'EDITOR', 'USER')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`)
      console.log('='.repeat(80))
      const projectId = supabaseUrl?.split('//')[1]?.split('.')[0]
      if (projectId) {
        console.log('\n🔗 Supabase 控制台: https://supabase.com/dashboard/project/' + projectId + '/sql')
      }
      return false
    } else {
      console.log('✅ 用户表已存在')
      return true
    }
  } catch (error) {
    console.error('❌ 检查用户表时发生错误:', error)
    return false
  }
}

async function testUserCreation() {
  try {
    console.log('🧪 测试创建用户...')
    
    const testUser = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'test@example.com',
      name: '测试用户',
      role: 'ADMIN'
    }
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .upsert(testUser, {
        onConflict: 'email'
      })
      .select()
    
    if (error) {
      console.error('❌ 创建测试用户失败:', error)
      return false
    } else {
      console.log('✅ 测试用户创建成功:', data)
      
      // 删除测试用户
      await supabaseAdmin
        .from('users')
        .delete()
        .eq('email', 'test@example.com')
      
      console.log('🗑️ 测试用户已删除')
      return true
    }
  } catch (error) {
    console.error('❌ 测试用户创建时发生错误:', error)
    return false
  }
}

async function main() {
  console.log('🚀 开始检查数据库表结构...')
  
  const tableExists = await createUserTable()
  
  if (tableExists) {
    const testSuccess = await testUserCreation()
    if (testSuccess) {
      console.log('🎉 数据库表结构正常，可以正常创建用户！')
    } else {
      console.log('⚠️ 数据库表存在但无法正常操作')
    }
  } else {
    console.log('⚠️ 请先在 Supabase 控制台创建表结构')
  }
}

main()