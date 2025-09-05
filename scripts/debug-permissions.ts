import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

// 创建客户端
const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function debugPermissions() {
  try {
    console.log('=== 权限调试开始 ===')
    
    // 1. 检查 auth.users
    console.log('\n1. 检查 auth.users 表:')
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    if (authError) {
      console.error('获取 auth.users 失败:', authError)
    } else {
      console.log(`找到 ${authUsers.users.length} 个认证用户:`)
      authUsers.users.forEach(user => {
        console.log(`  - ${user.email} (${user.id})`)
      })
    }
    
    // 2. 检查 public.users
    console.log('\n2. 检查 public.users 表:')
    const { data: publicUsers, error: publicError } = await supabaseAdmin
      .from('users')
      .select('*')
    
    if (publicError) {
      console.error('获取 public.users 失败:', publicError)
    } else {
      console.log(`找到 ${publicUsers?.length || 0} 个业务用户:`)
      publicUsers?.forEach(user => {
        console.log(`  - ${user.email} (${user.id}) - 角色: ${user.role}`)
      })
    }
    
    // 3. 模拟权限检查
    console.log('\n3. 模拟权限检查:')
    if (authUsers.users.length > 0) {
      const testUser = authUsers.users[0]
      if (testUser) {
        console.log(`测试用户: ${testUser.email}`)
        
        // 查找对应的 public.users 记录
        const publicUser = publicUsers?.find(u => u.id === testUser.id)
      if (publicUser) {
        console.log(`  - 找到对应的业务用户记录`)
        console.log(`  - 角色: ${publicUser.role}`)
        
        // 模拟权限检查逻辑
        const permissions = {
          'content:read': checkPermission(publicUser.role, 'content:read'),
          'content:write': checkPermission(publicUser.role, 'content:write'),
          'users:read': checkPermission(publicUser.role, 'users:read'),
          'users:write': checkPermission(publicUser.role, 'users:write')
        }
        
        console.log('  - 权限检查结果:')
        Object.entries(permissions).forEach(([perm, hasAccess]) => {
          console.log(`    ${perm}: ${hasAccess ? '✅' : '❌'}`)
        })
      } else {
          console.log(`  - ❌ 未找到对应的业务用户记录`)
        }
      }
    }
    
    // 4. 检查数据库连接
    console.log('\n4. 检查数据库连接:')
    const { data: testQuery, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('数据库连接测试失败:', testError)
    } else {
      console.log('✅ 数据库连接正常')
    }
    
    console.log('\n=== 权限调试结束 ===')
    
  } catch (error) {
    console.error('调试过程中发生错误:', error)
  }
}

// 权限检查逻辑（复制自 auth.ts）
function checkPermission(role: string, permission: string): boolean {
  switch (role) {
    case 'ADMIN':
      return true
    case 'EDITOR':
      return !permission.includes('users:') && !permission.includes('settings:')
    case 'AUTHOR':
      return permission.includes('content:read') || permission.includes('content:write') || permission.includes('media:')
    case 'USER':
      return permission.includes('content:read') || permission.includes('media:read')
    default:
      return false
  }
}

async function main() {
  await debugPermissions()
}

main().catch(console.error)