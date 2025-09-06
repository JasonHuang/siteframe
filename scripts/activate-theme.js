const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 缺少 Supabase 配置');
  console.error('需要: NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function activateTheme(themeName) {
  try {
    console.log(`🎯 激活主题: ${themeName}`);
    
    // 首先将所有主题设置为未激活
    console.log('📝 将所有主题设置为未激活...');
    const { error: deactivateError } = await supabase
      .from('themes')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // 更新所有记录
    
    if (deactivateError) {
      console.error('❌ 取消激活主题失败:', deactivateError);
      return;
    }
    
    // 激活指定主题
    console.log(`✅ 激活主题: ${themeName}`);
    const { data, error: activateError } = await supabase
      .from('themes')
      .update({ is_active: true })
      .eq('name', themeName)
      .select();
    
    if (activateError) {
      console.error('❌ 激活主题失败:', activateError);
      return;
    }
    
    if (!data || data.length === 0) {
      console.error(`❌ 找不到主题: ${themeName}`);
      return;
    }
    
    console.log(`🎉 成功激活主题: ${data[0].display_name} (${data[0].name})`);
    console.log(`📅 激活时间: ${new Date().toLocaleString()}`);
    
    // 验证激活状态
    console.log('\n🔍 验证激活状态...');
    const { data: activeThemes, error: checkError } = await supabase
      .from('themes')
      .select('*')
      .eq('is_active', true);
    
    if (checkError) {
      console.error('❌ 验证失败:', checkError);
      return;
    }
    
    console.log(`✅ 当前激活的主题数量: ${activeThemes.length}`);
    if (activeThemes.length === 1) {
      console.log(`✅ 激活的主题: ${activeThemes[0].display_name} (${activeThemes[0].name})`);
    } else if (activeThemes.length > 1) {
      console.log('⚠️  发现多个激活的主题:');
      activeThemes.forEach(theme => {
        console.log(`   - ${theme.display_name} (${theme.name})`);
      });
    } else {
      console.log('❌ 没有激活的主题');
    }
    
  } catch (error) {
    console.error('❌ 激活主题时出错:', error);
  }
}

// 获取命令行参数
const themeName = process.argv[2];

if (!themeName) {
  console.log('📋 使用方法: node scripts/activate-theme.js <theme-name>');
  console.log('\n🔧 可用的主题:');
  console.log('   - minimal-theme');
  console.log('   - modern-blog-theme');
  console.log('   - original-homepage-theme');
  console.log('   - test-auto-theme');
  console.log('\n💡 推荐激活: original-homepage-theme (官方主题)');
  process.exit(1);
}

activateTheme(themeName);