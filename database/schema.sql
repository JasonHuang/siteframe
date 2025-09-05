-- SiteFrame 数据库表结构
-- 请在 Supabase 控制台的 SQL 编辑器中执行此文件

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_content_author ON content(author_id);
CREATE INDEX IF NOT EXISTS idx_content_category ON content(category_id);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_content_published ON content(published_at);
CREATE INDEX IF NOT EXISTS idx_content_slug ON content(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_media_uploader ON media(uploader_id);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

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
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tags_updated_at ON tags;
CREATE TRIGGER update_tags_updated_at 
    BEFORE UPDATE ON tags 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_updated_at ON content;
CREATE TRIGGER update_content_updated_at 
    BEFORE UPDATE ON content 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_media_updated_at ON media;
CREATE TRIGGER update_media_updated_at 
    BEFORE UPDATE ON media 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at 
    BEFORE UPDATE ON settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全策略 (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;

-- 创建基本的 RLS 策略
-- 用户表：简化策略避免循环引用
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (
        auth.uid()::text = id::text
        OR NOT EXISTS (SELECT 1 FROM users) -- 允许第一个用户注册
    );

-- 分类表：所有人可以查看，管理员可以修改
CREATE POLICY "Anyone can view categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert categories" ON categories
    FOR INSERT WITH CHECK (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

CREATE POLICY "Admins can update categories" ON categories
    FOR UPDATE USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

CREATE POLICY "Admins can delete categories" ON categories
    FOR DELETE USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

-- 标签表：所有人可以查看，管理员和编辑可以修改
CREATE POLICY "Anyone can view tags" ON tags
    FOR SELECT USING (true);

CREATE POLICY "Editors can insert tags" ON tags
    FOR INSERT WITH CHECK (
        (auth.jwt() -> 'user_metadata' ->> 'role') IN ('ADMIN', 'EDITOR')
        OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('ADMIN', 'EDITOR')
    );

CREATE POLICY "Editors can update tags" ON tags
    FOR UPDATE USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') IN ('ADMIN', 'EDITOR')
        OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('ADMIN', 'EDITOR')
    );

CREATE POLICY "Editors can delete tags" ON tags
    FOR DELETE USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') IN ('ADMIN', 'EDITOR')
        OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('ADMIN', 'EDITOR')
    );

-- 内容表：已发布内容所有人可以查看，作者可以管理自己的内容
CREATE POLICY "Anyone can view published content" ON content
    FOR SELECT USING (status = 'PUBLISHED' OR author_id::text = auth.uid()::text);

CREATE POLICY "Authors can insert own content" ON content
    FOR INSERT WITH CHECK (author_id::text = auth.uid()::text);

CREATE POLICY "Authors can update own content" ON content
    FOR UPDATE USING (author_id::text = auth.uid()::text);

CREATE POLICY "Authors can delete own content" ON content
    FOR DELETE USING (author_id::text = auth.uid()::text);

CREATE POLICY "Admins can manage all content" ON content
    FOR ALL USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

-- 媒体表：上传者可以管理自己的媒体文件
CREATE POLICY "Users can view all media" ON media
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own media" ON media
    FOR INSERT WITH CHECK (uploader_id::text = auth.uid()::text);

CREATE POLICY "Users can update own media" ON media
    FOR UPDATE USING (uploader_id::text = auth.uid()::text);

CREATE POLICY "Users can delete own media" ON media
    FOR DELETE USING (uploader_id::text = auth.uid()::text);

CREATE POLICY "Admins can manage all media" ON media
    FOR ALL USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

-- 设置表：只有管理员可以访问
CREATE POLICY "Admins can view settings" ON settings
    FOR SELECT USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

CREATE POLICY "Admins can insert settings" ON settings
    FOR INSERT WITH CHECK (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

CREATE POLICY "Admins can update settings" ON settings
    FOR UPDATE USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

CREATE POLICY "Admins can delete settings" ON settings
    FOR DELETE USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

-- 内容标签关联表：跟随内容表的权限
CREATE POLICY "Anyone can view content tags" ON content_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM content 
            WHERE content.id = content_tags.content_id
            AND (content.status = 'PUBLISHED' OR content.author_id::text = auth.uid()::text)
        )
    );

CREATE POLICY "Authors can manage own content tags" ON content_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM content 
            WHERE content.id = content_tags.content_id
            AND content.author_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Admins can manage all content tags" ON content_tags
    FOR ALL USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

-- 插入初始数据
INSERT INTO categories (name, slug, description) VALUES
    ('技术', 'tech', '技术相关文章'),
    ('生活', 'life', '生活感悟和经验分享'),
    ('随笔', 'notes', '随想和笔记')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tags (name, slug) VALUES
    ('JavaScript', 'javascript'),
    ('React', 'react'),
    ('Next.js', 'nextjs'),
    ('TypeScript', 'typescript'),
    ('前端开发', 'frontend'),
    ('后端开发', 'backend'),
    ('数据库', 'database'),
    ('设计', 'design')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO settings (key, value, type, description) VALUES
    ('site_title', 'SiteFrame', 'STRING', '网站标题'),
    ('site_description', '基于 Next.js 和 Supabase 的现代化内容管理系统', 'STRING', '网站描述'),
    ('posts_per_page', '10', 'NUMBER', '每页显示的文章数量'),
    ('allow_comments', 'true', 'BOOLEAN', '是否允许评论'),
    ('site_logo', '', 'STRING', '网站 Logo URL'),
    ('contact_email', 'admin@example.com', 'STRING', '联系邮箱'),
    ('social_links', '{"twitter": "", "github": "", "linkedin": ""}', 'JSON', '社交媒体链接')
ON CONFLICT (key) DO NOTHING;

-- 创建一些实用的视图
CREATE OR REPLACE VIEW published_content AS
SELECT 
    c.*,
    u.name as author_name,
    u.email as author_email,
    cat.name as category_name,
    cat.slug as category_slug
FROM content c
LEFT JOIN users u ON c.author_id = u.id
LEFT JOIN categories cat ON c.category_id = cat.id
WHERE c.status = 'PUBLISHED'
ORDER BY c.published_at DESC;

CREATE OR REPLACE VIEW content_with_tags AS
SELECT 
    c.*,
    COALESCE(
        json_agg(
            json_build_object(
                'id', t.id,
                'name', t.name,
                'slug', t.slug
            )
        ) FILTER (WHERE t.id IS NOT NULL),
        '[]'::json
    ) as tags
FROM content c
LEFT JOIN content_tags ct ON c.id = ct.content_id
LEFT JOIN tags t ON ct.tag_id = t.id
GROUP BY c.id;

-- 创建全文搜索索引
CREATE INDEX IF NOT EXISTS idx_content_search ON content 
USING gin(to_tsvector('english', title || ' ' || COALESCE(content, '') || ' ' || COALESCE(excerpt, '')));

-- 创建搜索函数
CREATE OR REPLACE FUNCTION search_content(search_query text)
RETURNS TABLE(
    id uuid,
    title varchar,
    slug varchar,
    excerpt text,
    published_at timestamptz,
    rank real
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.title,
        c.slug,
        c.excerpt,
        c.published_at,
        ts_rank(to_tsvector('english', c.title || ' ' || COALESCE(c.content, '') || ' ' || COALESCE(c.excerpt, '')), plainto_tsquery('english', search_query)) as rank
    FROM content c
    WHERE 
        c.status = 'PUBLISHED'
        AND to_tsvector('english', c.title || ' ' || COALESCE(c.content, '') || ' ' || COALESCE(c.excerpt, '')) @@ plainto_tsquery('english', search_query)
    ORDER BY rank DESC, c.published_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 完成提示
SELECT 'SiteFrame 数据库初始化完成！' as message;