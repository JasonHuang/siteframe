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

async function checkThemes() {
  console.log('检查数据库中的主题记录...')
  
  const { data: themes, error } = await supabase
    .from('themes')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('查询主题失败:', error)
    return
  }
  
  console.log(`\n找到 ${themes.length} 个主题:`)
  themes.forEach((theme, index) => {
    console.log(`${index + 1}. ${theme.name} (${theme.display_name})${theme.is_active ? ' [活跃]' : ''}`)
    console.log(`   描述: ${theme.description || '无描述'}`)
    console.log(`   版本: ${theme.version}`)
    console.log(`   创建时间: ${new Date(theme.created_at).toLocaleString()}`)
    console.log('')
  })
}

checkThemes().catch(console.error)