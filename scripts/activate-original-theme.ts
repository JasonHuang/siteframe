import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('缺少必要的环境变量')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function activateOriginalTheme() {
  console.log('开始激活 original-theme...')
  
  // 首先将所有主题设为非活跃状态
  console.log('将所有主题设为非活跃状态...')
  const { error: deactivateError } = await supabase
    .from('themes')
    .update({ is_active: false })
    .neq('id', '00000000-0000-0000-0000-000000000000') // 更新所有记录
  
  if (deactivateError) {
    console.error('取消激活所有主题失败:', deactivateError)
    return
  }
  
  console.log('✓ 所有主题已设为非活跃状态')
  
  // 激活 original-theme
  console.log('激活 original-theme...')
  const { error: activateError } = await supabase
    .from('themes')
    .update({ is_active: true })
    .eq('name', 'original-theme')
  
  if (activateError) {
    console.error('激活 original-theme 失败:', activateError)
    return
  }
  
  console.log('✓ original-theme 已成功激活')
  
  // 验证激活状态
  const { data: activeTheme, error: checkError } = await supabase
    .from('themes')
    .select('name, display_name, is_active')
    .eq('is_active', true)
    .single()
  
  if (checkError) {
    console.error('验证激活状态失败:', checkError)
    return
  }
  
  console.log(`\n当前活跃主题: ${activeTheme.name} (${activeTheme.display_name})`)
}

activateOriginalTheme().catch(console.error)