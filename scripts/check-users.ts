import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('缺少必要的环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUsers() {
  try {
    console.log('检查用户表中的所有用户...');
    
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('查询用户失败:', error);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log('用户表中没有用户');
      return;
    }
    
    console.log(`找到 ${users.length} 个用户:`);
    console.log('\n用户列表:');
    console.log('=' .repeat(80));
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. 用户信息:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   邮箱: ${user.email}`);
      console.log(`   姓名: ${user.name}`);
      console.log(`   角色: ${user.role}`);
      console.log(`   创建时间: ${user.created_at}`);
      console.log(`   更新时间: ${user.updated_at}`);
      console.log('-'.repeat(40));
    });
    
    // 检查管理员用户
    const adminUsers = users.filter(user => user.role === 'ADMIN');
    console.log(`\n管理员用户数量: ${adminUsers.length}`);
    
    if (adminUsers.length > 0) {
      console.log('管理员用户:');
      adminUsers.forEach(admin => {
        console.log(`  - ${admin.email} (${admin.name})`);
      });
    }
    
  } catch (error) {
    console.error('检查用户时发生错误:', error);
  }
}

checkUsers();