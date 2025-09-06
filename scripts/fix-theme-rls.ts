import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function fixThemeRLS() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase configuration');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  try {
    console.log('Updating RLS policies for themes...');
    
    // 删除现有策略
    await supabase.rpc('exec_sql', {
      sql: `DROP POLICY IF EXISTS "Admins can manage themes" ON themes;`
    });
    
    // 创建新策略
    await supabase.rpc('exec_sql', {
      sql: `CREATE POLICY "Admins can manage themes" ON themes
        FOR ALL USING (
          auth.role() = 'service_role' OR
          EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
          )
        );`
    });
    
    // 删除现有主题设置策略
    await supabase.rpc('exec_sql', {
      sql: `DROP POLICY IF EXISTS "Admins can manage theme settings" ON theme_settings;`
    });
    
    // 创建新主题设置策略
    await supabase.rpc('exec_sql', {
      sql: `CREATE POLICY "Admins can manage theme settings" ON theme_settings
        FOR ALL USING (
          auth.role() = 'service_role' OR
          EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
          )
        );`
    });
    
    console.log('✅ RLS policies updated successfully');
  } catch (error) {
    console.error('❌ Error updating RLS policies:', error);
    process.exit(1);
  }
}

fixThemeRLS();