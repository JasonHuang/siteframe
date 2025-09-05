import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    serviceKey: !!supabaseServiceKey
  })
  process.exit(1)
}

// 创建管理员客户端
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function clearAuthUsers() {
  try {
    console.log('正在检查 auth.users 表中的用户...')
    
    // 获取所有用户
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.error('获取用户列表失败:', listError)
      return
    }
    
    console.log(`找到 ${users.users.length} 个用户:`, users.users.map(u => ({ id: u.id, email: u.email })))
    
    if (users.users.length === 0) {
      console.log('auth.users 表中没有用户')
      return
    }
    
    // 删除所有用户
    for (const user of users.users) {
      console.log(`正在删除用户: ${user.email} (${user.id})`)
      
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)
      
      if (deleteError) {
        console.error(`删除用户 ${user.email} 失败:`, deleteError)
      } else {
        console.log(`成功删除用户: ${user.email}`)
      }
    }
    
    console.log('auth.users 表清理完成')
    
  } catch (error) {
    console.error('清理 auth.users 表时发生错误:', error)
  }
}

async function main() {
  await clearAuthUsers()
}

main().catch(console.error)