const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Environment check:');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少 Supabase 配置');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkThemes() {
  try {
    console.log('🔍 检查数据库中的主题...');
    
    // 查询所有主题
    const { data: themes, error } = await supabase
      .from('themes')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('❌ 查询主题失败:', error);
      return;
    }
    
    if (!themes || themes.length === 0) {
      console.log('📭 数据库中没有主题');
      return;
    }
    
    console.log(`📊 找到 ${themes.length} 个主题:`);
    console.log('\n主题列表:');
    console.log('='.repeat(80));
    
    themes.forEach((theme, index) => {
      console.log(`${index + 1}. ${theme.display_name} (${theme.name})`);
      console.log(`   ID: ${theme.id}`);
      console.log(`   激活状态: ${theme.is_active ? '✅ 已激活' : '❌ 未激活'}`);
      console.log(`   系统主题: ${theme.is_system ? '是' : '否'}`);
      console.log(`   版本: ${theme.version}`);
      console.log(`   作者: ${theme.author || '未知'}`);
      console.log(`   创建时间: ${new Date(theme.created_at).toLocaleString()}`);
      console.log('-'.repeat(40));
    });
    
    // 检查激活的主题
    const activeThemes = themes.filter(theme => theme.is_active);
    console.log(`\n🎯 激活的主题数量: ${activeThemes.length}`);
    
    if (activeThemes.length === 0) {
      console.log('\n⚠️  没有激活的主题！');
      console.log('\n💡 建议操作:');
      console.log('1. 选择一个主题设置为激活状态');
      console.log('2. 在数据库中将某个主题的 is_active 字段设置为 true');
      console.log('3. 确保只有一个主题处于激活状态');
      
      if (themes.length > 0) {
        console.log('\n🔧 可以激活的主题:');
        themes.forEach((theme, index) => {
          console.log(`   ${index + 1}. ${theme.display_name} (${theme.name})`);
        });
      }
    } else if (activeThemes.length > 1) {
      console.log('\n⚠️  发现多个激活的主题！');
      console.log('激活的主题:');
      activeThemes.forEach(theme => {
        console.log(`   - ${theme.display_name} (${theme.name})`);
      });
      console.log('\n💡 建议: 只保留一个主题为激活状态');
    } else {
      console.log(`\n✅ 当前激活的主题: ${activeThemes[0].display_name} (${activeThemes[0].name})`);
    }
    
  } catch (error) {
    console.error('❌ 检查主题时出错:', error);
  }
}

checkThemes();