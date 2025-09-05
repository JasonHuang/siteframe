import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// 加载环境变量
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function clearUsers() {
  console.log('=== 清理用户数据 ===')
  
  try {
    // 清理 public.users 表
    console.log('\n清理 public.users 表...')
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // 删除所有用户
    
    if (deleteError) {
      console.error('清理 public.users 失败:', deleteError)
    } else {
      console.log('✅ public.users 表已清理')
    }
    
    // 检查结果
    const { data: remainingUsers, error: checkError } = await supabase
      .from('users')
      .select('*')
    
    if (checkError) {
      console.error('检查剩余用户失败:', checkError)
    } else {
      console.log(`剩余用户数量: ${remainingUsers?.length || 0}`)
    }
    
  } catch (error) {
    console.error('清理过程中发生错误:', error)
  }
}

// 运行清理
clearUsers().then(() => {
  console.log('\n=== 清理完成 ===')
  process.exit(0)
}).catch(error => {
  console.error('清理失败:', error)
  process.exit(1)
})