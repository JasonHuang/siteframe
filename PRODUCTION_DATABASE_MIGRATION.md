# SiteFrame 生产环境数据库迁移指南

本指南详细说明如何将 SiteFrame 数据库迁移到生产环境。

## 📋 迁移文件说明

### 1. 完整版迁移脚本
**文件**: `database/production-migration.sql`
- **用途**: 完整的生产环境数据库迁移
- **包含**: 所有表结构、索引、触发器、RLS策略、视图、函数和初始数据
- **大小**: ~1000+ 行，包含详细注释和优化配置
- **推荐**: 首次部署或完整重建时使用

### 2. 简化版迁移脚本
**文件**: `database/production-migration-simple.sql`
- **用途**: 快速部署的简化版本
- **包含**: 核心表结构、基础索引、触发器和必要数据
- **大小**: ~200+ 行，精简高效
- **推荐**: 快速部署或测试环境使用

### 3. 原始文件
- `database/schema.sql`: 原始数据库架构
- `database/themes-schema.sql`: 主题系统架构
- `scripts/init-supabase.ts`: TypeScript 初始化脚本

## 🚀 部署方法

### 方法一：Supabase 控制台部署（推荐）

1. **登录 Supabase 控制台**
   ```
   https://app.supabase.com/
   ```

2. **选择项目并进入 SQL 编辑器**
   - 导航到 `SQL Editor`
   - 点击 `New query`

3. **执行迁移脚本**
   
   **选项 A: 完整版部署**
   ```sql
   -- 复制 database/production-migration.sql 的全部内容
   -- 粘贴到 SQL 编辑器中
   -- 点击 "Run" 执行
   ```
   
   **选项 B: 简化版部署**
   ```sql
   -- 复制 database/production-migration-simple.sql 的全部内容
   -- 粘贴到 SQL 编辑器中
   -- 点击 "Run" 执行
   ```

4. **验证部署**
   ```sql
   -- 检查表是否创建成功
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   
   -- 检查初始数据
   SELECT * FROM categories;
   SELECT * FROM tags;
   SELECT * FROM settings;
   SELECT * FROM themes;
   ```

### 方法二：命令行部署

1. **安装 Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **登录并链接项目**
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. **执行迁移**
   ```bash
   # 完整版
   supabase db reset --db-url "postgresql://[user]:[password]@[host]:[port]/[database]"
   
   # 或者直接执行 SQL 文件
   psql "postgresql://[user]:[password]@[host]:[port]/[database]" < database/production-migration.sql
   ```

### 方法三：使用项目脚本

1. **配置环境变量**
   ```bash
   # 创建 .env.production 文件
   cp .env.example .env.production
   
   # 编辑生产环境配置
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. **运行初始化脚本**
   ```bash
   # 使用 TypeScript 脚本
   npm run db:init
   
   # 或者直接运行
   npx tsx scripts/init-supabase.ts
   ```

## 🔧 环境变量配置

### 必需的环境变量
```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 数据库直连（可选）
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# 应用配置
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.com
```

### 获取 Supabase 配置
1. 登录 Supabase 控制台
2. 选择项目
3. 进入 `Settings` > `API`
4. 复制 `Project URL` 和 `API Keys`

## 📊 迁移后验证

### 1. 检查表结构
```sql
-- 查看所有表
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 查看表详情
\d+ users
\d+ content
\d+ themes
```

### 2. 检查索引
```sql
-- 查看所有索引
SELECT indexname, tablename, indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;
```

### 3. 检查 RLS 策略
```sql
-- 查看 RLS 策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

### 4. 检查初始数据
```sql
-- 验证基础数据
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'tags', COUNT(*) FROM tags
UNION ALL
SELECT 'settings', COUNT(*) FROM settings
UNION ALL
SELECT 'themes', COUNT(*) FROM themes;
```

### 5. 测试应用连接
```bash
# 启动应用测试
npm run build
npm start

# 或者运行测试
npm test
```

## 🔄 数据迁移（从现有系统）

如果你需要从现有系统迁移数据，请按以下步骤：

### 1. 导出现有数据
```bash
# 导出为 SQL
pg_dump --data-only --inserts old_database > data_export.sql

# 或导出为 CSV
psql -d old_database -c "\copy users TO 'users.csv' CSV HEADER"
psql -d old_database -c "\copy content TO 'content.csv' CSV HEADER"
```

### 2. 清理和转换数据
```sql
-- 示例：转换用户数据
INSERT INTO users (id, email, name, role, created_at)
SELECT 
    gen_random_uuid(),
    email,
    name,
    CASE 
        WHEN role = 'admin' THEN 'ADMIN'
        WHEN role = 'editor' THEN 'EDITOR'
        ELSE 'USER'
    END,
    created_at
FROM imported_users;
```

### 3. 导入数据
```bash
# 使用 psql 导入
psql "$DATABASE_URL" < data_export.sql

# 或使用 COPY 命令
psql "$DATABASE_URL" -c "\copy users FROM 'users.csv' CSV HEADER"
```

## 🛠️ 故障排除

### 常见问题

1. **权限错误**
   ```
   ERROR: permission denied for schema public
   ```
   **解决**: 确保使用 `service_role` 密钥，而不是 `anon` 密钥

2. **表已存在错误**
   ```
   ERROR: relation "users" already exists
   ```
   **解决**: 脚本使用 `IF NOT EXISTS`，如需重建请先删除表

3. **RLS 策略冲突**
   ```
   ERROR: policy "policy_name" for table "table_name" already exists
   ```
   **解决**: 脚本使用 `DROP POLICY IF EXISTS`，手动删除冲突策略

4. **连接超时**
   ```
   ERROR: connection timeout
   ```
   **解决**: 检查网络连接和数据库 URL 配置

### 调试命令

```sql
-- 查看当前用户权限
SELECT current_user, session_user, current_database();

-- 查看表权限
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'users';

-- 查看 RLS 状态
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

## 📝 备份和恢复

### 创建备份
```bash
# 完整备份
pg_dump "$DATABASE_URL" > backup_$(date +%Y%m%d_%H%M%S).sql

# 仅数据备份
pg_dump --data-only "$DATABASE_URL" > data_backup_$(date +%Y%m%d_%H%M%S).sql

# 仅结构备份
pg_dump --schema-only "$DATABASE_URL" > schema_backup_$(date +%Y%m%d_%H%M%S).sql
```

### 恢复备份
```bash
# 恢复完整备份
psql "$DATABASE_URL" < backup_20240101_120000.sql

# 恢复数据
psql "$DATABASE_URL" < data_backup_20240101_120000.sql
```

## 🔐 安全注意事项

1. **密钥管理**
   - 永远不要在代码中硬编码密钥
   - 使用环境变量或密钥管理服务
   - 定期轮换 API 密钥

2. **数据库访问**
   - 限制 `service_role` 密钥的使用
   - 在生产环境中禁用不必要的扩展
   - 定期审查 RLS 策略

3. **网络安全**
   - 使用 SSL/TLS 连接
   - 配置防火墙规则
   - 启用 IP 白名单（如果需要）

## 📞 支持

如果在迁移过程中遇到问题：

1. 检查 [Supabase 文档](https://supabase.com/docs)
2. 查看项目的 GitHub Issues
3. 联系开发团队

---

**最后更新**: 2024年
**版本**: 1.0.0
**维护者**: SiteFrame Team