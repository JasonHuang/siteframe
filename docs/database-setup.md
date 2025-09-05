# 数据库设置指南

本项目使用 Supabase 作为后端数据库服务。以下是完整的设置步骤。

## 1. Supabase 项目设置

### 1.1 创建 Supabase 项目
1. 访问 [Supabase](https://supabase.com)
2. 创建新项目或使用现有项目
3. 记录项目的 URL 和 API 密钥

### 1.2 环境变量配置
确保 `.env` 文件包含以下配置：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 注意：DATABASE_URL 已被注释，我们使用 Supabase 客户端
# DATABASE_URL="postgresql://postgres:password@db.project.supabase.co:5432/postgres"
```

## 2. 数据库表结构创建

### 方法一：使用 SQL 编辑器（推荐）
1. 在 Supabase 控制台中，进入 "SQL Editor"
2. 复制 `database/schema.sql` 文件的内容
3. 粘贴到 SQL 编辑器中并执行
4. 这将创建所有必要的表、索引、触发器和 RLS 策略

### 方法二：使用迁移文件
如果你熟悉 Supabase CLI，可以创建迁移文件：

```bash
# 安装 Supabase CLI
npm install -g supabase

# 初始化项目
supabase init

# 创建迁移
supabase migration new initial_schema

# 将 schema.sql 内容复制到迁移文件中
# 然后推送到远程
supabase db push
```

## 3. 数据初始化

### 3.1 运行初始化脚本
创建表结构后，运行以下命令初始化示例数据：

```bash
# 使用 .env.local 环境变量运行初始化
DOTENV_CONFIG_PATH=.env.local npm run db:init
```

这将创建：
- **超级管理员账号**（邮箱：admin@example.com）
- 默认分类（技术、生活、随笔）
- 默认标签（JavaScript、React、Next.js 等）
- 系统设置
- 示例内容（如果需要）

### 3.2 管理员账号详情

初始化脚本会自动创建一个超级管理员账号：

| 属性 | 值 |
|------|----|
| 邮箱 | admin@example.com |
| 用户名 | Administrator |
| 角色 | ADMIN（超级管理员）|
| 权限 | 完整的系统管理权限 |

**使用步骤**：
1. 运行数据库初始化脚本（如上所示）
2. 访问应用的注册页面：`/auth/signup`
3. 使用邮箱 `admin@example.com` 进行注册
4. 设置密码完成账号激活
5. 系统会自动关联到已存在的管理员记录

**管理员权限包括**：
- 管理所有用户和权限
- 创建、编辑、删除所有内容
- 管理分类和标签
- 访问系统设置
- 管理媒体文件
- 查看系统统计信息

> ⚠️ **重要安全提醒**：
> - 首次登录后请立即修改管理员邮箱为您的真实邮箱
> - 设置强密码并定期更换
> - 根据需要创建其他管理员账号
> - 定期检查用户权限设置
> - 不要在生产环境中使用默认的 admin@example.com 邮箱

### 3.3 手动数据初始化
你也可以在 Supabase 控制台的 "Table Editor" 中手动添加数据。

## 4. 数据库表结构说明

### 4.1 核心表

- **users**: 用户信息表
- **categories**: 内容分类表
- **tags**: 标签表
- **content**: 内容表（文章和页面）
- **media**: 媒体文件表
- **settings**: 系统设置表
- **content_tags**: 内容和标签的关联表

### 4.2 权限和安全

项目启用了行级安全策略（RLS），确保：
- 用户只能访问自己的数据
- 已发布的内容对所有人可见
- 管理员拥有完整权限
- 编辑者可以管理内容和标签

## 5. 类型生成

### 5.1 生成 TypeScript 类型
为了获得更好的类型安全，可以从 Supabase 生成 TypeScript 类型：

```bash
# 需要先安装 Supabase CLI
npm run supabase:types
```

这将生成 `lib/supabase-types.ts` 文件，包含所有数据库表的类型定义。

### 5.2 使用生成的类型

```typescript
import { Database } from '@/lib/supabase-types'

type Tables = Database['public']['Tables']
type User = Tables['users']['Row']
type Content = Tables['content']['Row']
```

## 6. 开发工作流

### 6.1 本地开发
1. 确保 Supabase 项目正常运行
2. 环境变量配置正确
3. 运行开发服务器：`npm run dev`

### 6.2 数据库操作

```typescript
// 使用 Supabase 客户端进行数据库操作
import { supabase } from '@/lib/supabase'

// 查询数据
const { data, error } = await supabase
  .from('content')
  .select('*')
  .eq('status', 'PUBLISHED')

// 插入数据
const { data, error } = await supabase
  .from('content')
  .insert({
    title: '新文章',
    slug: 'new-post',
    content: '文章内容...',
    status: 'DRAFT'
  })
```

## 7. 常见问题

### 7.1 连接问题
- 确保 Supabase 项目状态为绿色（活跃）
- 检查环境变量是否正确配置
- 验证 API 密钥是否有效

### 7.2 权限问题
- 检查 RLS 策略是否正确设置
- 确保用户已正确认证
- 验证用户角色和权限

### 7.3 类型错误
- 重新生成 TypeScript 类型
- 检查数据库表结构是否与代码一致

## 8. 生产环境部署

### 8.1 环境变量
确保在生产环境中设置正确的环境变量：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
```

### 8.2 安全考虑
- 定期轮换 API 密钥
- 审查 RLS 策略
- 监控数据库使用情况
- 设置适当的备份策略

## 9. 备份和恢复

Supabase 提供自动备份功能，但建议：
- 定期导出重要数据
- 测试恢复流程
- 保持数据库结构的版本控制

## 10. 监控和维护

- 使用 Supabase 控制台监控数据库性能
- 定期检查日志和错误
- 优化查询性能
- 清理不必要的数据

---

如有任何问题，请参考 [Supabase 官方文档](https://supabase.com/docs) 或联系开发团队。