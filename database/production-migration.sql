-- SiteFrame 生产环境完整数据库迁移脚本
-- 版本: 1.0.0
-- 创建日期: 2024
-- 说明: 此脚本包含完整的数据库表结构、索引、触发器、RLS策略和初始数据
-- 使用方法: 在 Supabase 控制台的 SQL 编辑器中执行此文件

-- ============================================================================
-- 1. 启用必要的扩展
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- 用于模糊搜索
CREATE EXTENSION IF NOT EXISTS "unaccent"; -- 用于去除重音符号

-- ============================================================================
-- 2. 创建核心数据表
-- ============================================================================

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar TEXT,
  role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('ADMIN', 'EDITOR', 'USER')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 内容表
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

-- 媒体表
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

-- 设置表
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'STRING' CHECK (type IN ('STRING', 'NUMBER', 'BOOLEAN', 'JSON')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 内容标签关联表
CREATE TABLE IF NOT EXISTS content_tags (
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, tag_id)
);

-- ============================================================================
-- 3. 创建主题系统表
-- ============================================================================

-- 主题表
CREATE TABLE IF NOT EXISTS themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    author VARCHAR(100),
    preview_image TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    is_system BOOLEAN DEFAULT FALSE,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 主题设置表
CREATE TABLE IF NOT EXISTS theme_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value JSONB,
    setting_type VARCHAR(50) DEFAULT 'string',
    is_customizable BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(theme_id, setting_key)
);

-- ============================================================================
-- 4. 创建性能优化索引
-- ============================================================================

-- 核心表索引
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

-- 主题系统索引
CREATE INDEX IF NOT EXISTS idx_themes_name ON themes(name);
CREATE INDEX IF NOT EXISTS idx_themes_active ON themes(is_active);
CREATE INDEX IF NOT EXISTS idx_theme_settings_theme_id ON theme_settings(theme_id);
CREATE INDEX IF NOT EXISTS idx_theme_settings_key ON theme_settings(setting_key);

-- 全文搜索索引
CREATE INDEX IF NOT EXISTS idx_content_search ON content 
USING gin(to_tsvector('english', title || ' ' || COALESCE(content, '') || ' ' || COALESCE(excerpt, '')));

-- 复合索引用于常见查询
CREATE INDEX IF NOT EXISTS idx_content_status_published ON content(status, published_at DESC) WHERE status = 'PUBLISHED';
CREATE INDEX IF NOT EXISTS idx_content_author_status ON content(author_id, status);

-- ============================================================================
-- 5. 创建触发器函数
-- ============================================================================

-- 通用更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 主题系统专用触发器函数
CREATE OR REPLACE FUNCTION update_themes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_theme_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. 创建触发器
-- ============================================================================

-- 核心表触发器
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

-- 主题系统触发器
DROP TRIGGER IF EXISTS trigger_update_themes_updated_at ON themes;
CREATE TRIGGER trigger_update_themes_updated_at
    BEFORE UPDATE ON themes
    FOR EACH ROW
    EXECUTE FUNCTION update_themes_updated_at();

DROP TRIGGER IF EXISTS trigger_update_theme_settings_updated_at ON theme_settings;
CREATE TRIGGER trigger_update_theme_settings_updated_at
    BEFORE UPDATE ON theme_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_theme_settings_updated_at();

-- ============================================================================
-- 7. 启用行级安全策略 (RLS)
-- ============================================================================

-- 核心表 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;

-- 主题系统 RLS
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 8. 创建 RLS 策略
-- ============================================================================

-- 用户表策略
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (
        auth.uid()::text = id::text
        OR NOT EXISTS (SELECT 1 FROM users)
    );

-- 分类表策略
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
CREATE POLICY "Anyone can view categories" ON categories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
CREATE POLICY "Admins can insert categories" ON categories
    FOR INSERT WITH CHECK (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

DROP POLICY IF EXISTS "Admins can update categories" ON categories;
CREATE POLICY "Admins can update categories" ON categories
    FOR UPDATE USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

DROP POLICY IF EXISTS "Admins can delete categories" ON categories;
CREATE POLICY "Admins can delete categories" ON categories
    FOR DELETE USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

-- 标签表策略
DROP POLICY IF EXISTS "Anyone can view tags" ON tags;
CREATE POLICY "Anyone can view tags" ON tags
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Editors can insert tags" ON tags;
CREATE POLICY "Editors can insert tags" ON tags
    FOR INSERT WITH CHECK (
        (auth.jwt() -> 'user_metadata' ->> 'role') IN ('ADMIN', 'EDITOR')
        OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('ADMIN', 'EDITOR')
    );

DROP POLICY IF EXISTS "Editors can update tags" ON tags;
CREATE POLICY "Editors can update tags" ON tags
    FOR UPDATE USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') IN ('ADMIN', 'EDITOR')
        OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('ADMIN', 'EDITOR')
    );

DROP POLICY IF EXISTS "Editors can delete tags" ON tags;
CREATE POLICY "Editors can delete tags" ON tags
    FOR DELETE USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') IN ('ADMIN', 'EDITOR')
        OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('ADMIN', 'EDITOR')
    );

-- 内容表策略
DROP POLICY IF EXISTS "Anyone can view published content" ON content;
CREATE POLICY "Anyone can view published content" ON content
    FOR SELECT USING (status = 'PUBLISHED' OR author_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Authors can insert own content" ON content;
CREATE POLICY "Authors can insert own content" ON content
    FOR INSERT WITH CHECK (author_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Authors can update own content" ON content;
CREATE POLICY "Authors can update own content" ON content
    FOR UPDATE USING (author_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Authors can delete own content" ON content;
CREATE POLICY "Authors can delete own content" ON content
    FOR DELETE USING (author_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Admins can manage all content" ON content;
CREATE POLICY "Admins can manage all content" ON content
    FOR ALL USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

-- 媒体表策略
DROP POLICY IF EXISTS "Users can view all media" ON media;
CREATE POLICY "Users can view all media" ON media
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own media" ON media;
CREATE POLICY "Users can insert own media" ON media
    FOR INSERT WITH CHECK (uploader_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update own media" ON media;
CREATE POLICY "Users can update own media" ON media
    FOR UPDATE USING (uploader_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can delete own media" ON media;
CREATE POLICY "Users can delete own media" ON media
    FOR DELETE USING (uploader_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Admins can manage all media" ON media;
CREATE POLICY "Admins can manage all media" ON media
    FOR ALL USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

-- 设置表策略
DROP POLICY IF EXISTS "Admins can view settings" ON settings;
CREATE POLICY "Admins can view settings" ON settings
    FOR SELECT USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

DROP POLICY IF EXISTS "Admins can insert settings" ON settings;
CREATE POLICY "Admins can insert settings" ON settings
    FOR INSERT WITH CHECK (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

DROP POLICY IF EXISTS "Admins can update settings" ON settings;
CREATE POLICY "Admins can update settings" ON settings
    FOR UPDATE USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

DROP POLICY IF EXISTS "Admins can delete settings" ON settings;
CREATE POLICY "Admins can delete settings" ON settings
    FOR DELETE USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

-- 内容标签关联表策略
DROP POLICY IF EXISTS "Anyone can view content tags" ON content_tags;
CREATE POLICY "Anyone can view content tags" ON content_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM content 
            WHERE content.id = content_tags.content_id
            AND (content.status = 'PUBLISHED' OR content.author_id::text = auth.uid()::text)
        )
    );

DROP POLICY IF EXISTS "Authors can manage own content tags" ON content_tags;
CREATE POLICY "Authors can manage own content tags" ON content_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM content 
            WHERE content.id = content_tags.content_id
            AND content.author_id::text = auth.uid()::text
        )
    );

DROP POLICY IF EXISTS "Admins can manage all content tags" ON content_tags;
CREATE POLICY "Admins can manage all content tags" ON content_tags
    FOR ALL USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN'
    );

-- 主题表策略
DROP POLICY IF EXISTS "Anyone can view themes" ON themes;
CREATE POLICY "Anyone can view themes" ON themes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage themes" ON themes;
CREATE POLICY "Admins can manage themes" ON themes
    FOR ALL USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- 主题设置表策略
DROP POLICY IF EXISTS "Anyone can view theme settings" ON theme_settings;
CREATE POLICY "Anyone can view theme settings" ON theme_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage theme settings" ON theme_settings;
CREATE POLICY "Admins can manage theme settings" ON theme_settings
    FOR ALL USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- ============================================================================
-- 9. 创建实用视图
-- ============================================================================

-- 已发布内容视图
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

-- 带标签的内容视图
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

-- 主题配置视图
CREATE OR REPLACE VIEW theme_configurations AS
SELECT 
    t.*,
    COALESCE(
        json_object_agg(
            ts.setting_key, 
            json_build_object(
                'value', ts.setting_value,
                'type', ts.setting_type,
                'customizable', ts.is_customizable,
                'order', ts.display_order
            )
        ) FILTER (WHERE ts.id IS NOT NULL),
        '{}'
    ) as settings
FROM themes t
LEFT JOIN theme_settings ts ON t.id = ts.theme_id
GROUP BY t.id;

-- ============================================================================
-- 10. 创建实用函数
-- ============================================================================

-- 全文搜索函数
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

-- 获取活跃主题函数
CREATE OR REPLACE FUNCTION get_active_theme()
RETURNS TABLE(
    id uuid,
    name varchar,
    display_name varchar,
    config jsonb
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        t.display_name,
        t.config
    FROM themes t
    WHERE t.is_active = true
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- 统计函数
CREATE OR REPLACE FUNCTION get_site_stats()
RETURNS TABLE(
    total_posts bigint,
    published_posts bigint,
    total_categories bigint,
    total_tags bigint,
    total_users bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM content WHERE type = 'POST') as total_posts,
        (SELECT COUNT(*) FROM content WHERE type = 'POST' AND status = 'PUBLISHED') as published_posts,
        (SELECT COUNT(*) FROM categories) as total_categories,
        (SELECT COUNT(*) FROM tags) as total_tags,
        (SELECT COUNT(*) FROM users) as total_users;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 11. 插入初始数据
-- ============================================================================

-- 插入默认分类
INSERT INTO categories (name, slug, description) VALUES
    ('技术', 'tech', '技术相关文章'),
    ('生活', 'life', '生活感悟和经验分享'),
    ('随笔', 'notes', '随想和笔记'),
    ('产品', 'product', '产品设计和用户体验'),
    ('创业', 'startup', '创业经验和思考')
ON CONFLICT (slug) DO NOTHING;

-- 插入默认标签
INSERT INTO tags (name, slug) VALUES
    ('JavaScript', 'javascript'),
    ('React', 'react'),
    ('Next.js', 'nextjs'),
    ('TypeScript', 'typescript'),
    ('前端开发', 'frontend'),
    ('后端开发', 'backend'),
    ('数据库', 'database'),
    ('设计', 'design'),
    ('用户体验', 'ux'),
    ('产品管理', 'product-management'),
    ('人工智能', 'ai'),
    ('机器学习', 'machine-learning')
ON CONFLICT (slug) DO NOTHING;

-- 插入系统设置
INSERT INTO settings (key, value, type, description) VALUES
    ('site_title', 'SiteFrame', 'STRING', '网站标题'),
    ('site_description', '基于 Next.js 和 Supabase 的现代化内容管理系统', 'STRING', '网站描述'),
    ('site_keywords', 'CMS, Next.js, Supabase, TypeScript, React', 'STRING', '网站关键词'),
    ('posts_per_page', '10', 'NUMBER', '每页显示的文章数量'),
    ('allow_comments', 'true', 'BOOLEAN', '是否允许评论'),
    ('allow_registration', 'false', 'BOOLEAN', '是否允许用户注册'),
    ('site_logo', '', 'STRING', '网站 Logo URL'),
    ('site_favicon', '', 'STRING', '网站 Favicon URL'),
    ('contact_email', 'admin@example.com', 'STRING', '联系邮箱'),
    ('social_links', '{"twitter": "", "github": "", "linkedin": "", "facebook": ""}', 'JSON', '社交媒体链接'),
    ('analytics_code', '', 'STRING', 'Google Analytics 代码'),
    ('seo_meta', '{"author": "", "robots": "index,follow"}', 'JSON', 'SEO 元数据'),
    ('maintenance_mode', 'false', 'BOOLEAN', '维护模式'),
    ('cache_duration', '3600', 'NUMBER', '缓存持续时间（秒）')
ON CONFLICT (key) DO NOTHING;

-- 插入默认主题
INSERT INTO themes (name, display_name, description, version, author, is_active, is_system, config)
VALUES 
    ('default', '默认主题', 'SiteFrame 系统默认主题，简洁现代的设计风格', '1.0.0', 'SiteFrame Team', true, true, '{
        "colors": {
            "primary": "#3b82f6",
            "secondary": "#64748b",
            "accent": "#f59e0b",
            "background": "#ffffff",
            "surface": "#f8fafc",
            "text": "#1e293b",
            "textSecondary": "#64748b",
            "border": "#e2e8f0",
            "success": "#10b981",
            "warning": "#f59e0b",
            "error": "#ef4444"
        },
        "typography": {
            "fontFamily": "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
            "fontSize": {
                "xs": "0.75rem",
                "sm": "0.875rem",
                "base": "1rem",
                "lg": "1.125rem",
                "xl": "1.25rem",
                "2xl": "1.5rem",
                "3xl": "1.875rem",
                "4xl": "2.25rem",
                "5xl": "3rem"
            },
            "fontWeight": {
                "normal": "400",
                "medium": "500",
                "semibold": "600",
                "bold": "700"
            },
            "lineHeight": {
                "tight": "1.25",
                "normal": "1.5",
                "relaxed": "1.75"
            }
        },
        "layout": {
            "maxWidth": "1200px",
            "spacing": {
                "xs": "0.25rem",
                "sm": "0.5rem",
                "md": "1rem",
                "lg": "1.5rem",
                "xl": "2rem",
                "2xl": "3rem"
            },
            "borderRadius": {
                "sm": "0.25rem",
                "md": "0.5rem",
                "lg": "0.75rem",
                "xl": "1rem"
            },
            "shadow": {
                "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
            }
        },
        "animation": {
            "duration": {
                "fast": "150ms",
                "normal": "300ms",
                "slow": "500ms"
            },
            "easing": {
                "ease": "ease",
                "easeIn": "ease-in",
                "easeOut": "ease-out",
                "easeInOut": "ease-in-out"
            }
        }
    }'),
    ('dark', '深色主题', '适合夜间使用的深色主题，护眼且专业', '1.0.0', 'SiteFrame Team', false, true, '{
        "colors": {
            "primary": "#60a5fa",
            "secondary": "#94a3b8",
            "accent": "#fbbf24",
            "background": "#0f172a",
            "surface": "#1e293b",
            "text": "#f1f5f9",
            "textSecondary": "#94a3b8",
            "border": "#334155",
            "success": "#34d399",
            "warning": "#fbbf24",
            "error": "#f87171"
        },
        "typography": {
            "fontFamily": "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
            "fontSize": {
                "xs": "0.75rem",
                "sm": "0.875rem",
                "base": "1rem",
                "lg": "1.125rem",
                "xl": "1.25rem",
                "2xl": "1.5rem",
                "3xl": "1.875rem",
                "4xl": "2.25rem",
                "5xl": "3rem"
            },
            "fontWeight": {
                "normal": "400",
                "medium": "500",
                "semibold": "600",
                "bold": "700"
            },
            "lineHeight": {
                "tight": "1.25",
                "normal": "1.5",
                "relaxed": "1.75"
            }
        },
        "layout": {
            "maxWidth": "1200px",
            "spacing": {
                "xs": "0.25rem",
                "sm": "0.5rem",
                "md": "1rem",
                "lg": "1.5rem",
                "xl": "2rem",
                "2xl": "3rem"
            },
            "borderRadius": {
                "sm": "0.25rem",
                "md": "0.5rem",
                "lg": "0.75rem",
                "xl": "1rem"
            },
            "shadow": {
                "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
                "md": "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
                "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
                "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.4)"
            }
        },
        "animation": {
            "duration": {
                "fast": "150ms",
                "normal": "300ms",
                "slow": "500ms"
            },
            "easing": {
                "ease": "ease",
                "easeIn": "ease-in",
                "easeOut": "ease-out",
                "easeInOut": "ease-in-out"
            }
        }
    }')
ON CONFLICT (name) DO NOTHING;

-- 插入默认主题设置
INSERT INTO theme_settings (theme_id, setting_key, setting_value, setting_type, is_customizable, display_order)
SELECT 
    t.id,
    setting_key,
    setting_value::jsonb,
    setting_type,
    is_customizable,
    display_order
FROM themes t,
(
    VALUES 
        ('primary_color', '"#3b82f6"', 'color', true, 1),
        ('secondary_color', '"#64748b"', 'color', true, 2),
        ('accent_color', '"#f59e0b"', 'color', true, 3),
        ('background_color', '"#ffffff"', 'color', true, 4),
        ('text_color', '"#1e293b"', 'color', true, 5),
        ('font_family', '"Inter, sans-serif"', 'string', true, 6),
        ('font_size_base', '"1rem"', 'string', true, 7),
        ('max_width', '"1200px"', 'string', true, 8),
        ('border_radius', '"0.5rem"', 'string', true, 9),
        ('enable_animations', 'true', 'boolean', true, 10),
        ('header_height', '"4rem"', 'string', true, 11),
        ('sidebar_width', '"16rem"', 'string', true, 12),
        ('content_padding', '"2rem"', 'string', true, 13),
        ('card_shadow', '"0 4px 6px -1px rgba(0, 0, 0, 0.1)"', 'string', true, 14),
        ('transition_duration', '"300ms"', 'string', true, 15)
) AS settings(setting_key, setting_value, setting_type, is_customizable, display_order)
WHERE t.name = 'default'
ON CONFLICT (theme_id, setting_key) DO NOTHING;

-- ============================================================================
-- 12. 创建生产环境优化配置
-- ============================================================================

-- 设置数据库参数优化
-- 注意：这些设置需要数据库管理员权限，在 Supabase 中可能无法直接执行
-- 可以在 Supabase 控制台的数据库设置中配置

-- 创建分区表（如果数据量很大）
-- 这里以内容表为例，按创建时间分区
-- CREATE TABLE content_2024 PARTITION OF content
-- FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- 创建物化视图用于复杂查询缓存
CREATE MATERIALIZED VIEW IF NOT EXISTS popular_content AS
SELECT 
    c.id,
    c.title,
    c.slug,
    c.excerpt,
    c.published_at,
    c.author_id,
    u.name as author_name,
    cat.name as category_name,
    COUNT(ct.tag_id) as tag_count
FROM content c
LEFT JOIN users u ON c.author_id = u.id
LEFT JOIN categories cat ON c.category_id = cat.id
LEFT JOIN content_tags ct ON c.id = ct.content_id
WHERE c.status = 'PUBLISHED'
GROUP BY c.id, u.name, cat.name
ORDER BY c.published_at DESC;

-- 创建刷新物化视图的函数
CREATE OR REPLACE FUNCTION refresh_popular_content()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW popular_content;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 13. 创建备份和维护函数
-- ============================================================================

-- 清理过期数据函数
CREATE OR REPLACE FUNCTION cleanup_old_data(days_to_keep integer DEFAULT 365)
RETURNS void AS $$
BEGIN
    -- 清理超过指定天数的草稿内容
    DELETE FROM content 
    WHERE status = 'DRAFT' 
    AND created_at < NOW() - INTERVAL '1 day' * days_to_keep;
    
    -- 清理未使用的媒体文件（这里只是示例，实际需要更复杂的逻辑）
    -- DELETE FROM media 
    -- WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep
    -- AND id NOT IN (SELECT DISTINCT featured_image::uuid FROM content WHERE featured_image IS NOT NULL);
END;
$$ LANGUAGE plpgsql;

-- 数据库统计函数
CREATE OR REPLACE FUNCTION get_database_stats()
RETURNS TABLE(
    table_name text,
    row_count bigint,
    size_pretty text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname||'.'||tablename as table_name,
        n_tup_ins - n_tup_del as row_count,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size_pretty
    FROM pg_stat_user_tables 
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 14. 完成消息
-- ============================================================================

-- 验证安装
DO $$
DECLARE
    table_count integer;
    index_count integer;
    function_count integer;
BEGIN
    -- 检查表数量
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE';
    
    -- 检查索引数量
    SELECT COUNT(*) INTO index_count
    FROM pg_indexes 
    WHERE schemaname = 'public';
    
    -- 检查函数数量
    SELECT COUNT(*) INTO function_count
    FROM information_schema.routines 
    WHERE routine_schema = 'public' 
    AND routine_type = 'FUNCTION';
    
    RAISE NOTICE '=== SiteFrame 生产环境数据库迁移完成 ===';
    RAISE NOTICE '创建表数量: %', table_count;
    RAISE NOTICE '创建索引数量: %', index_count;
    RAISE NOTICE '创建函数数量: %', function_count;
    RAISE NOTICE '=== 数据库已准备就绪 ===';
END
$$;

-- 最终提示
SELECT 
    'SiteFrame 生产环境数据库迁移成功完成！' as status,
    '请确保配置正确的环境变量并测试应用功能。' as next_step,
    NOW() as completed_at;

-- 提交事务
COMMIT;