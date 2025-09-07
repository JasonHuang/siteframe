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

// 要删除的旧主题
const themesToDelete = [
  'minimal-theme',
  'modern-blog-theme', 
  'original-homepage-theme',
  'test-auto-theme'
]

// 要保留的主题
const themesToKeep = [
  'original-theme',
  'company-theme',
  'future-theme'
]

async function deleteOldThemes() {
  console.log('开始删除旧主题...')
  
  for (const themeName of themesToDelete) {
    console.log(`删除主题: ${themeName}`)
    
    const { error } = await supabase
      .from('themes')
      .delete()
      .eq('name', themeName)
    
    if (error) {
      console.error(`删除主题 ${themeName} 失败:`, error)
    } else {
      console.log(`✓ 主题 ${themeName} 删除成功`)
    }
  }
  
  console.log('\n删除操作完成')
  console.log('保留的主题:', themesToKeep.join(', '))
}

deleteOldThemes().catch(console.error)