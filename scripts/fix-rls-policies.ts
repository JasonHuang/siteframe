#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// 加载环境变量
config({ path: '.env.local' });

// 从环境变量获取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 缺少必要的环境变量:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

// 创建 Supabase 管理员客户端
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixRLSPolicies() {
  try {
    console.log('🔧 开始修复 RLS 策略...');
    console.log('⚠️  注意：需要在 Supabase 控制台的 SQL 编辑器中手动执行以下 SQL 语句：');
    console.log('');
    
    const sqlStatements = [
      'DROP POLICY IF EXISTS "Users can view own profile" ON users;',
      'DROP POLICY IF EXISTS "Users can update own profile" ON users;',
      `CREATE POLICY "Users can view profiles" ON users
          FOR SELECT USING (
              auth.uid()::text = id::text 
              OR EXISTS (
                  SELECT 1 FROM users 
                  WHERE id::text = auth.uid()::text 
                  AND role = 'ADMIN'
              )
          );`,
      `CREATE POLICY "Users can update profiles" ON users
          FOR UPDATE USING (
              auth.uid()::text = id::text 
              OR EXISTS (
                  SELECT 1 FROM users 
                  WHERE id::text = auth.uid()::text 
                  AND role = 'ADMIN'
              )
          );`,
      `CREATE POLICY "Admins can insert users" ON users
          FOR INSERT WITH CHECK (
              EXISTS (
                  SELECT 1 FROM users 
                  WHERE id::text = auth.uid()::text 
                  AND role = 'ADMIN'
              )
              OR NOT EXISTS (SELECT 1 FROM users)
          );`
    ];
    
    console.log('-- 复制以下 SQL 到 Supabase 控制台执行：');
    console.log('-- ==========================================');
    sqlStatements.forEach((sql, index) => {
      console.log(`-- 步骤 ${index + 1}:`);
      console.log(sql);
      console.log('');
    });
    console.log('-- ==========================================');
    
    // 尝试检查当前用户权限
    console.log('🔍 检查当前数据库连接状态...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, role')
      .limit(1);
    
    if (usersError) {
      console.log('❌ 当前无法访问用户表，这证实了权限问题:', usersError.message);
      console.log('📋 请在 Supabase 控制台执行上述 SQL 语句来修复权限问题。');
    } else {
      console.log('✅ 可以访问用户表，找到用户:', users?.length || 0, '个');
    }
    
  } catch (error) {
    console.error('❌ 检查过程中出错:', error);
  }
}

fixRLSPolicies();