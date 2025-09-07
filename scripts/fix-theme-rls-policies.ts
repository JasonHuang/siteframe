import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixThemeRLSPolicies() {
  console.log('修复主题表RLS策略...');

  try {
    // 删除现有的主题表策略
    await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "Anyone can view themes" ON themes;
        DROP POLICY IF EXISTS "Admins can manage themes" ON themes;
        DROP POLICY IF EXISTS "Anyone can view theme settings" ON theme_settings;
        DROP POLICY IF EXISTS "Admins can manage theme settings" ON theme_settings;
      `
    });

    console.log('已删除旧的RLS策略');

    // 创建新的主题表策略
    await supabase.rpc('exec_sql', {
      sql: `
        -- 主题表的RLS策略
        -- 所有人可以查看主题
        CREATE POLICY "Anyone can view themes" ON themes
            FOR SELECT USING (true);

        -- 只有管理员可以管理主题，或者服务角色
        CREATE POLICY "Admins can manage themes" ON themes
            FOR ALL USING (
                auth.role() = 'service_role' OR
                EXISTS (
                    SELECT 1 FROM users
                    WHERE users.id::text = auth.uid()::text
                    AND users.role = 'ADMIN'
                )
            );

        -- 主题设置表的RLS策略
        -- 所有人可以查看主题设置
        CREATE POLICY "Anyone can view theme settings" ON theme_settings
            FOR SELECT USING (true);

        -- 只有管理员可以管理主题设置，或者服务角色
        CREATE POLICY "Admins can manage theme settings" ON theme_settings
            FOR ALL USING (
                auth.role() = 'service_role' OR
                EXISTS (
                    SELECT 1 FROM users
                    WHERE users.id::text = auth.uid()::text
                    AND users.role = 'ADMIN'
                )
            );
      `
    });

    console.log('✅ 主题表RLS策略修复完成！');
    console.log('现在主题激活应该可以正常工作了');

  } catch (error) {
    console.error('❌ 修复RLS策略时出错:', error);
    throw error;
  }
}

fixThemeRLSPolicies().catch(console.error);