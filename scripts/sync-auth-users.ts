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

async function syncAuthUsers() {
  try {
    console.log('正在检查 auth.users 表中的用户...')
    
    // 获取所有认证用户
    const { data: authUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.error('获取认证用户列表失败:', listError)
      return
    }
    
    console.log(`找到 ${authUsers.users.length} 个认证用户`)
    
    if (authUsers.users.length === 0) {
      console.log('auth.users 表中没有用户')
      return
    }
    
    // 检查 public.users 表中的用户
    const { data: publicUsers, error: publicError } = await supabaseAdmin
      .from('users')
      .select('*')
    
    if (publicError) {
      console.error('获取 public.users 失败:', publicError)
      return
    }
    
    console.log(`public.users 表中有 ${publicUsers?.length || 0} 个用户`)
    
    // 同步用户数据
    for (const authUser of authUsers.users) {
      const existingUser = publicUsers?.find(u => u.id === authUser.id)
      
      if (!existingUser) {
        console.log(`正在同步用户: ${authUser.email} (${authUser.id})`)
        
        const userData = {
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '用户',
          avatar: authUser.user_metadata?.avatar || null,
          role: 'ADMIN', // 第一个用户设为管理员
          created_at: authUser.created_at,
          updated_at: new Date().toISOString()
        }
        
        const { error: insertError } = await supabaseAdmin
          .from('users')
          .insert(userData)
        
        if (insertError) {
          console.error(`同步用户 ${authUser.email} 失败:`, insertError)
        } else {
          console.log(`成功同步用户: ${authUser.email} (角色: ADMIN)`)
        }
      } else {
        console.log(`用户 ${authUser.email} 已存在于 public.users 表中`)
      }
    }
    
    console.log('用户同步完成')
    
  } catch (error) {
    console.error('同步用户时发生错误:', error)
  }
}

async function main() {
  await syncAuthUsers()
}

main().catch(console.error)