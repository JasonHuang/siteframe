import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// 加载环境变量
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const testEmail = 'huangpengxiao@gmail.com'
const testPassword = 'test123456' // 假设的测试密码

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 模拟完整的权限系统流程
async function testCompletePermissionFlow() {
  console.log('=== 完整权限系统流程测试 ===')
  
  try {
    // 1. 模拟用户登录
    console.log('\n1. 模拟用户登录:')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })
    
    if (signInError) {
      console.log('❌ 登录失败:', signInError.message)
      console.log('提示：请确保用户已注册且密码正确')
      return
    }
    
    if (!signInData.user) {
      console.log('❌ 登录成功但未获取到用户信息')
      return
    }
    
    console.log('✅ 登录成功:', signInData.user.email)
    
    // 2. 检查会话状态
    console.log('\n2. 检查会话状态:')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.log('❌ 获取会话失败:', sessionError.message)
      return
    }
    
    if (!session) {
      console.log('❌ 无有效会话')
      return
    }
    
    console.log('✅ 会话有效，过期时间:', new Date(session.expires_at! * 1000))
    
    // 3. 检查用户是否已同步到 public.users
    console.log('\n3. 检查用户同步状态:')
    const { data: publicUser, error: publicUserError } = await supabase
      .from('users')
      .select('*')
      .eq('id', signInData.user.id)
      .single()
    
    if (publicUserError) {
      console.log('❌ 获取用户资料失败:', publicUserError.message)
      return
    }
    
    if (!publicUser) {
      console.log('❌ 用户未同步到 public.users 表')
      return
    }
    
    console.log('✅ 用户已同步:', {
      email: publicUser.email,
      role: publicUser.role,
      name: publicUser.name
    })
    
    // 4. 测试权限检查
    console.log('\n4. 测试权限检查:')
    const testPermissions = [
      'content:read',
      'content:write', 
      'users:read',
      'users:write',
      'settings:read',
      'settings:write'
    ]
    
    for (const permission of testPermissions) {
      const hasPermission = checkPermissionByRole(permission, publicUser.role)
      console.log(`  ${permission}: ${hasPermission ? '✅' : '❌'}`)
    }
    
    // 5. 模拟前端权限组件行为
    console.log('\n5. 模拟前端权限组件:')
    const usersReadPermission = checkPermissionByRole('users:read', publicUser.role)
    console.log(`  PermissionArea(permission="users:read"): ${usersReadPermission ? '显示内容' : '显示权限受限区域'}`)
    
    // 6. 登出
    console.log('\n6. 清理会话:')
    const { error: signOutError } = await supabase.auth.signOut()
    
    if (signOutError) {
      console.log('❌ 登出失败:', signOutError.message)
    } else {
      console.log('✅ 已登出')
    }
    
  } catch (error) {
    console.error('测试过程中发生错误:', error)
  }
}

// 模拟权限检查函数（与 auth.ts 中的逻辑一致）
function checkPermissionByRole(permission: string, role: string): boolean {
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
testCompletePermissionFlow().then(() => {
  console.log('\n=== 测试完成 ===')
  process.exit(0)
}).catch(error => {
  console.error('测试失败:', error)
  process.exit(1)
})