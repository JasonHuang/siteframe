-- 主题系统数据库表结构
-- 创建主题表和主题设置表

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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_themes_name ON themes(name);
CREATE INDEX IF NOT EXISTS idx_themes_active ON themes(is_active);
CREATE INDEX IF NOT EXISTS idx_theme_settings_theme_id ON theme_settings(theme_id);
CREATE INDEX IF NOT EXISTS idx_theme_settings_key ON theme_settings(setting_key);

-- 创建更新时间触发器
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

CREATE TRIGGER trigger_update_themes_updated_at
    BEFORE UPDATE ON themes
    FOR EACH ROW
    EXECUTE FUNCTION update_themes_updated_at();

CREATE TRIGGER trigger_update_theme_settings_updated_at
    BEFORE UPDATE ON theme_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_theme_settings_updated_at();

-- 启用行级安全策略
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;

-- 主题表的RLS策略
-- 所有人可以查看主题
CREATE POLICY "Anyone can view themes" ON themes
    FOR SELECT USING (true);

-- 只有管理员可以管理主题，或者服务角色
CREATE POLICY "Admins can manage themes" ON themes
    FOR ALL USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
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
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- 插入默认主题
INSERT INTO themes (name, display_name, description, version, author, is_active, is_system, config)
VALUES 
    ('default', '默认主题', 'SiteFrame 系统默认主题', '1.0.0', 'SiteFrame Team', true, true, '{
        "colors": {
            "primary": "#3b82f6",
            "secondary": "#64748b",
            "accent": "#f59e0b",
            "background": "#ffffff",
            "surface": "#f8fafc",
            "text": "#1e293b"
        },
        "typography": {
            "fontFamily": "Inter, sans-serif",
            "fontSize": {
                "base": "16px",
                "h1": "2.5rem",
                "h2": "2rem",
                "h3": "1.5rem"
            }
        },
        "layout": {
            "maxWidth": "1200px",
            "spacing": "1rem",
            "borderRadius": "0.5rem"
        }
    }'),
    ('dark', '深色主题', '适合夜间使用的深色主题', '1.0.0', 'SiteFrame Team', false, true, '{
        "colors": {
            "primary": "#60a5fa",
            "secondary": "#94a3b8",
            "accent": "#fbbf24",
            "background": "#0f172a",
            "surface": "#1e293b",
            "text": "#f1f5f9"
        },
        "typography": {
            "fontFamily": "Inter, sans-serif",
            "fontSize": {
                "base": "16px",
                "h1": "2.5rem",
                "h2": "2rem",
                "h3": "1.5rem"
            }
        },
        "layout": {
            "maxWidth": "1200px",
            "spacing": "1rem",
            "borderRadius": "0.5rem"
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
        ('font_size_base', '"16px"', 'string', true, 7),
        ('max_width', '"1200px"', 'string', true, 8),
        ('border_radius', '"0.5rem"', 'string', true, 9),
        ('enable_animations', 'true', 'boolean', true, 10)
) AS settings(setting_key, setting_value, setting_type, is_customizable, display_order)
WHERE t.name = 'default'
ON CONFLICT (theme_id, setting_key) DO NOTHING;

COMMIT;