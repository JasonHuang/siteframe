# 主题系统迁移指南

本文档说明如何将主题系统集成到现有的 SiteFrame 项目中。

## 📋 迁移步骤

### 1. 数据库迁移

#### 必需文件
- `database/themes-schema.sql` - 主题系统数据库表结构

#### 执行步骤
1. 打开 Supabase 控制台
2. 进入 SQL Editor
3. 执行 `database/themes-schema.sql` 文件内容

#### 创建的表
- `themes` - 主题基本信息表
- `theme_settings` - 主题设置表

#### 默认数据
- 默认主题 (default)
- 深色主题 (dark)
- 基础主题设置

### 2. 类型定义

#### 需要创建的文件
- `lib/types/theme.ts` - 主题相关 TypeScript 类型
- 更新 `lib/types/database.ts` - 添加主题表类型

### 3. 服务层

#### 需要创建的文件
- `lib/services/themes.ts` - 主题管理服务

### 4. 前端组件

#### 需要创建的文件
- `app/components/admin/ThemeManager.tsx` - 主题管理组件
- `app/components/admin/ThemeSelector.tsx` - 主题选择器
- `app/components/admin/ThemeCustomizer.tsx` - 主题定制器

### 5. 集成到管理界面

#### 需要修改的文件
- `app/admin/page.tsx` - 添加主题管理入口
- `app/components/admin/Sidebar.tsx` - 添加主题管理菜单

## 🔍 验证步骤

### 数据库验证
```sql
-- 检查表是否创建成功
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('themes', 'theme_settings');

-- 检查默认数据
SELECT name, display_name, is_active FROM themes;
```

### 功能验证
1. 访问管理界面
2. 检查主题管理菜单
3. 测试主题切换功能
4. 验证主题设置保存

## 📁 文件清单

### 已创建
- ✅ `database/themes-schema.sql`

### 待创建
- ⏳ `lib/types/theme.ts`
- ⏳ `lib/services/themes.ts`
- ⏳ `app/components/admin/ThemeManager.tsx`
- ⏳ `app/components/admin/ThemeSelector.tsx`
- ⏳ `app/components/admin/ThemeCustomizer.tsx`

### 待修改
- ⏳ `lib/types/database.ts`
- ⏳ `app/admin/page.tsx`
- ⏳ `app/components/admin/Sidebar.tsx`

## 🚀 快速开始

1. **执行数据库迁移**
   ```bash
   # 在 Supabase SQL Editor 中执行
   cat database/themes-schema.sql
   ```

2. **验证数据库**
   ```sql
   SELECT * FROM themes;
   SELECT * FROM theme_settings LIMIT 5;
   ```

3. **继续开发**
   - 创建类型定义
   - 实现服务层
   - 开发前端组件

## 📝 注意事项

- 确保 Supabase 项目已正确配置
- 执行 SQL 前请备份现有数据
- 主题系统使用 JSONB 存储配置，支持灵活的主题定制
- 默认启用行级安全策略，只有管理员可以管理主题