import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// 加载环境变量
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 模拟前端权限检查流程
async function testFrontendPermissions() {
  console.log('=== 前端权限检查测试 ===')
  
  try {
    // 1. 获取当前用户（模拟前端getCurrentUser）
    console.log('\n1. 获取当前用户:')
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.log('❌ 获取用户失败:', userError.message)
      return
    }
    
    if (!user) {
      console.log('❌ 未找到当前用户')
      return
    }
    
    console.log('✅ 找到用户:', user.email, user.id)
    
    // 2. 获取用户资料（模拟getUserProfile）
    console.log('\n2. 获取用户资料:')
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError) {
      console.log('❌ 获取用户资料失败:', profileError.message)
      return
    }
    
    if (!userProfile) {
      console.log('❌ 未找到用户资料')
      return
    }
    
    console.log('✅ 用户资料:', {
      email: userProfile.email,
      role: userProfile.role,
      id: userProfile.id
    })
    
    // 3. 测试权限检查（模拟checkPermission函数）
    console.log('\n3. 测试权限检查:')
    const testPermissions = ['users:read', 'users:write', 'content:read', 'content:write']
    
    for (const permission of testPermissions) {
      const hasPermission = await checkPermission(permission, userProfile.role)
      console.log(`  ${permission}: ${hasPermission ? '✅' : '❌'}`)
    }
    
    // 4. 检查会话状态
    console.log('\n4. 检查会话状态:')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.log('❌ 获取会话失败:', sessionError.message)
    } else if (session) {
      console.log('✅ 会话有效，过期时间:', new Date(session.expires_at! * 1000))
    } else {
      console.log('❌ 无有效会话')
    }
    
  } catch (error) {
    console.error('测试过程中发生错误:', error)
  }
}

// 模拟权限检查函数
async function checkPermission(permission: string, role: string): Promise<boolean> {
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

// 运行测试
testFrontendPermissions().then(() => {
  console.log('\n=== 测试完成 ===')
  process.exit(0)
}).catch(error => {
  console.error('测试失败:', error)
  process.exit(1)
})