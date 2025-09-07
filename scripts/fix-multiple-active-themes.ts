import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixMultipleActiveThemes() {
  console.log('修复多个活跃主题问题...');

  try {
    // 首先获取所有活跃主题
    const { data: activeThemes, error: fetchError } = await supabase
      .from('themes')
      .select('*')
      .eq('is_active', true);

    if (fetchError) {
      throw new Error(`获取活跃主题失败: ${fetchError.message}`);
    }

    console.log(`发现 ${activeThemes?.length || 0} 个活跃主题:`);
    activeThemes?.forEach(theme => {
      console.log(`- ${theme.name} (${theme.display_name})`);
    });

    if (!activeThemes || activeThemes.length <= 1) {
      console.log('✅ 没有发现多个活跃主题的问题');
      return;
    }

    // 将所有主题设为非活跃
    console.log('\n将所有主题设为非活跃状态...');
    const { error: deactivateError } = await supabase
      .from('themes')
      .update({ is_active: false })
      .not('id', 'is', null);

    if (deactivateError) {
      throw new Error(`取消激活失败: ${deactivateError.message}`);
    }

    // 激活future-theme（用户想要激活的主题）
    console.log('激活future-theme...');
    const { data: futureTheme, error: activateError } = await supabase
      .from('themes')
      .update({ is_active: true })
      .eq('name', 'future-theme')
      .select()
      .single();

    if (activateError) {
      throw new Error(`激活future-theme失败: ${activateError.message}`);
    }

    console.log('✅ 成功激活future-theme');
    console.log(`当前活跃主题: ${futureTheme.name} (${futureTheme.display_name})`);

    // 验证修复结果
    const { data: verifyThemes, error: verifyError } = await supabase
      .from('themes')
      .select('name, display_name, is_active')
      .order('name');

    if (verifyError) {
      throw new Error(`验证失败: ${verifyError.message}`);
    }

    console.log('\n修复后的主题状态:');
    verifyThemes?.forEach(theme => {
      const status = theme.is_active ? '[活跃]' : '';
      console.log(`- ${theme.name} (${theme.display_name}) ${status}`);
    });

  } catch (error) {
    console.error('❌ 修复多个活跃主题时出错:', error);
    throw error;
  }
}

fixMultipleActiveThemes().catch(console.error);