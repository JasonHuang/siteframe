-- 重建数据库脚本
-- 请在 Supabase 控制台的 SQL 编辑器中执行此文件

-- 警告：此操作将删除所有现有数据！
-- 请确保您已备份重要数据

-- 1. 删除所有现有的 RLS 策略
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Only admins can modify categories" ON categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;
DROP POLICY IF EXISTS "Anyone can view tags" ON tags;
DROP POLICY IF EXISTS "Editors and admins can modify tags" ON tags;
DROP POLICY IF EXISTS "Editors can insert tags" ON tags;
DROP POLICY IF EXISTS "Editors can update tags" ON tags;
DROP POLICY IF EXISTS "Editors can delete tags" ON tags;
DROP POLICY IF EXISTS "Anyone can view published content" ON content;
DROP POLICY IF EXISTS "Authors can manage own content" ON content;
DROP POLICY IF EXISTS "Authors can insert own content" ON content;
DROP POLICY IF EXISTS "Authors can update own content" ON content;
DROP POLICY IF EXISTS "Authors can delete own content" ON content;
DROP POLICY IF EXISTS "Admins can manage all content" ON content;
DROP POLICY IF EXISTS "Users can view all media" ON media;
DROP POLICY IF EXISTS "Users can manage own media" ON media;
DROP POLICY IF EXISTS "Users can insert own media" ON media;
DROP POLICY IF EXISTS "Users can update own media" ON media;
DROP POLICY IF EXISTS "Users can delete own media" ON media;
DROP POLICY IF EXISTS "Admins can manage all media" ON media;
DROP POLICY IF EXISTS "Only admins can access settings" ON settings;
DROP POLICY IF EXISTS "Admins can view settings" ON settings;
DROP POLICY IF EXISTS "Admins can insert settings" ON settings;
DROP POLICY IF EXISTS "Admins can update settings" ON settings;
DROP POLICY IF EXISTS "Admins can delete settings" ON settings;
DROP POLICY IF EXISTS "Content tags follow content permissions" ON content_tags;
DROP POLICY IF EXISTS "Anyone can view content tags" ON content_tags;
DROP POLICY IF EXISTS "Authors can manage own content tags" ON content_tags;
DROP POLICY IF EXISTS "Admins can manage all content tags" ON content_tags;

-- 2. 删除现有视图
DROP VIEW IF EXISTS published_content;
DROP VIEW IF EXISTS content_with_tags;

-- 3. 删除触发器（必须在删除函数之前）
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_tags_updated_at ON tags;
DROP TRIGGER IF EXISTS update_content_updated_at ON content;
DROP TRIGGER IF EXISTS update_media_updated_at ON media;
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
DROP TRIGGER IF EXISTS update_content_tags_updated_at ON content_tags;

-- 4. 删除现有函数
DROP FUNCTION IF EXISTS search_content(text);
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 5. 删除现有表（注意顺序，先删除有外键依赖的表）
DROP TABLE IF EXISTS content_tags;
DROP TABLE IF EXISTS content;
DROP TABLE IF EXISTS media;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- 6. 清理 auth.users 表中的数据（如果需要）
-- 注意：这将删除所有认证用户！
-- DELETE FROM auth.users;

SELECT '数据库清理完成，现在请执行 database/schema.sql 文件重建数据库结构' as message;