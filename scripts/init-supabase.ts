import 'dotenv/config'
import { supabaseAdmin } from '../lib/supabase'
import { Database } from '../lib/supabase'

type Tables = Database['public']['Tables']

// 创建表的 SQL 语句
const createTablesSQL = `
-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar TEXT,
  role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('ADMIN', 'EDITOR', 'USER')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建标签表
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建内容表
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  type VARCHAR(20) DEFAULT 'POST' CHECK (type IN ('POST', 'PAGE')),
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建媒体表
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size INTEGER NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  uploader_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建设置表
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'STRING' CHECK (type IN ('STRING', 'NUMBER', 'BOOLEAN', 'JSON')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建内容标签关联表
CREATE TABLE IF NOT EXISTS content_tags (
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, tag_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_content_author ON content(author_id);
CREATE INDEX IF NOT EXISTS idx_content_category ON content(category_id);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_content_published ON content(published_at);
CREATE INDEX IF NOT EXISTS idx_media_uploader ON media(uploader_id);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表创建更新时间触发器
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tags_updated_at ON tags;
CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_updated_at ON content;
CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_media_updated_at ON media;
CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`

async function createTables() {
  console.log('🏗️ 创建数据库表结构...')
  
  const { error } = await supabaseAdmin.rpc('exec_sql', {
    sql: createTablesSQL
  })
  
  if (error) {
    console.error('❌ 创建表失败:', error)
    throw error
  }
  
  console.log('✅ 数据库表创建成功')
}

async function seedData() {
  console.log('🌱 开始初始化数据...')
  
  try {
    // 1. 创建管理员用户
    console.log('👤 创建管理员用户...')
    const { data: adminUser, error: userError } = await supabaseAdmin
      .from('users')
      .upsert({
        email: 'admin@example.com',
        name: 'Administrator',
        role: 'ADMIN'
      }, {
        onConflict: 'email'
      })
      .select()
      .single()
    
    if (userError) {
      console.error('❌ 创建用户失败:', userError)
      throw userError
    }
    
    console.log('✅ 管理员用户创建成功')
    
    // 2. 创建默认分类
    console.log('📁 创建默认分类...')
    const categories = [
      { name: '技术', slug: 'tech', description: '技术相关文章' },
      { name: '生活', slug: 'life', description: '生活感悟和经验分享' },
      { name: '随笔', slug: 'notes', description: '随想和笔记' }
    ]
    
    const { data: createdCategories, error: categoryError } = await supabaseAdmin
      .from('categories')
      .upsert(categories, {
        onConflict: 'slug'
      })
      .select()
    
    if (categoryError) {
      console.error('❌ 创建分类失败:', categoryError)
      throw categoryError
    }
    
    console.log('✅ 默认分类创建成功')
    
    // 3. 创建默认标签
    console.log('🏷️ 创建默认标签...')
    const tags = [
      { name: 'JavaScript', slug: 'javascript' },
      { name: 'React', slug: 'react' },
      { name: 'Next.js', slug: 'nextjs' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: '前端开发', slug: 'frontend' }
    ]
    
    const { error: tagError } = await supabaseAdmin
      .from('tags')
      .upsert(tags, {
        onConflict: 'slug'
      })
    
    if (tagError) {
      console.error('❌ 创建标签失败:', tagError)
      throw tagError
    }
    
    console.log('✅ 默认标签创建成功')
    
    // 4. 创建示例内容
    console.log('📝 创建示例内容...')
    const techCategory = createdCategories?.find(c => c.slug === 'tech')
    
    const contents = [
      {
        title: '欢迎使用 SiteFrame',
        slug: 'welcome',
        content: `# 欢迎使用 SiteFrame\n\n这是一个基于 Next.js 和 Supabase 构建的现代化内容管理系统。\n\n## 特性\n\n- 🚀 基于 Next.js 14 和 React 18\n- 💾 使用 Supabase 作为后端服务\n- 🎨 Tailwind CSS 样式框架\n- 📱 响应式设计\n- 🔐 用户认证和权限管理\n- 📝 富文本编辑器\n- 🏷️ 标签和分类系统\n- 📁 媒体文件管理\n\n开始探索你的新网站吧！`,
        excerpt: '欢迎使用基于 Next.js 和 Supabase 的现代化内容管理系统',
        status: 'PUBLISHED' as const,
        type: 'POST' as const,
        author_id: adminUser.id,
        category_id: techCategory?.id,
        published_at: new Date().toISOString()
      },
      {
        title: '关于我们',
        slug: 'about',
        content: `# 关于我们\n\n这里是关于页面的内容。你可以在这里介绍你的网站、团队或个人信息。\n\n## 我们的使命\n\n为用户提供优质的内容和服务。\n\n## 联系方式\n\n如有任何问题，请随时联系我们。`,
        excerpt: '了解更多关于我们的信息',
        status: 'PUBLISHED' as const,
        type: 'PAGE' as const,
        author_id: adminUser.id,
        published_at: new Date().toISOString()
      }
    ]
    
    const { error: contentError } = await supabaseAdmin
      .from('content')
      .upsert(contents, {
        onConflict: 'slug'
      })
    
    if (contentError) {
      console.error('❌ 创建内容失败:', contentError)
      throw contentError
    }
    
    console.log('✅ 示例内容创建成功')
    
    // 5. 创建系统设置
    console.log('⚙️ 创建系统设置...')
    const settings = [
      {
        key: 'site_title',
        value: 'SiteFrame',
        type: 'STRING' as const,
        description: '网站标题'
      },
      {
        key: 'site_description',
        value: '基于 Next.js 和 Supabase 的现代化内容管理系统',
        type: 'STRING' as const,
        description: '网站描述'
      },
      {
        key: 'posts_per_page',
        value: '10',
        type: 'NUMBER' as const,
        description: '每页显示的文章数量'
      },
      {
        key: 'allow_comments',
        value: 'true',
        type: 'BOOLEAN' as const,
        description: '是否允许评论'
      }
    ]
    
    const { error: settingsError } = await supabaseAdmin
      .from('settings')
      .upsert(settings, {
        onConflict: 'key'
      })
    
    if (settingsError) {
      console.error('❌ 创建设置失败:', settingsError)
      throw settingsError
    }
    
    console.log('✅ 系统设置创建成功')
    
  } catch (error) {
    console.error('❌ 数据初始化失败:', error)
    throw error
  }
}

async function main() {
  try {
    console.log('🚀 开始初始化 Supabase 数据库...')
    
    // 注意：在实际使用中，表结构应该通过 Supabase 控制台的 SQL 编辑器创建
    // 这里仅作为示例，实际项目中建议手动创建表结构
    console.log('⚠️ 请在 Supabase 控制台手动创建表结构，然后运行数据初始化')
    
    await seedData()
    
    console.log('🎉 Supabase 数据库初始化完成！')
    
  } catch (error) {
    console.error('💥 初始化失败:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { createTables, seedData }