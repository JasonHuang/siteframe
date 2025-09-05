# 代码风格规范

本文档定义了项目的代码风格和编程规范，旨在提高代码质量、可读性和团队协作效率。

## 目录

- [通用规范](#通用规范)
- [命名规范](#命名规范)
- [文件组织](#文件组织)
- [注释规范](#注释规范)
- [JavaScript/TypeScript 规范](#javascripttypescript-规范)
- [React 组件规范](#react-组件规范)
- [CSS/样式规范](#css样式规范)
- [导入导出规范](#导入导出规范)

## 通用规范

### 基本原则

1. **一致性优于个人偏好** - 团队统一的风格比个人喜好更重要
2. **可读性第一** - 代码应该易于理解和维护
3. **简洁明了** - 避免不必要的复杂性
4. **自文档化** - 代码本身应该能够说明其用途

### 格式化

- 使用 Prettier 进行自动格式化
- 缩进：2个空格
- 行尾：LF (Unix风格)
- 文件末尾：保留一个空行
- 行宽：80字符

## 命名规范

### 变量和函数

```javascript
// ✅ 好的命名
const userName = 'john';
const isLoggedIn = true;
const userAccountBalance = 1000;

function getUserProfile() {}
function calculateTotalPrice() {}
function handleButtonClick() {}

// ❌ 避免的命名
const u = 'john';
const flag = true;
const data = {};

function doStuff() {}
function process() {}
```

### 常量

```javascript
// ✅ 全局常量使用 SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT = 5000;

// ✅ 局部常量使用 camelCase
const defaultOptions = {
  timeout: 5000,
  retries: 3
};
```

### 类和组件

```javascript
// ✅ 使用 PascalCase
class UserManager {}
class ApiService {}

// React 组件
function UserProfile() {}
function NavigationBar() {}
const ProductCard = () => {};
```

### 文件命名

```
// ✅ 组件文件
UserProfile.tsx
NavigationBar.tsx
ProductCard.tsx

// ✅ 工具函数文件
utils.ts
api.ts
validation.ts

// ✅ 页面文件
home.tsx
about.tsx
contact.tsx

// ✅ 样式文件
UserProfile.module.css
global.css
variables.css
```

## 文件组织

### 目录结构

```
src/
├── components/          # 可复用组件
│   ├── ui/             # 基础UI组件
│   ├── forms/          # 表单组件
│   └── layout/         # 布局组件
├── pages/              # 页面组件
├── hooks/              # 自定义Hooks
├── utils/              # 工具函数
├── services/           # API服务
├── types/              # TypeScript类型定义
├── constants/          # 常量定义
├── styles/             # 全局样式
└── assets/             # 静态资源
```

### 文件内容组织

```javascript
// ✅ 推荐的文件结构

// 1. 导入 - 按类型分组
import React from 'react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui';
import { UserService } from '@/services';
import { User } from '@/types';

import styles from './UserProfile.module.css';

// 2. 类型定义
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

// 3. 常量
const DEFAULT_AVATAR = '/images/default-avatar.png';

// 4. 主要组件/函数
export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // Hook调用
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 副作用
  useEffect(() => {
    loadUser();
  }, [userId]);

  // 事件处理函数
  const handleUpdate = async (userData: Partial<User>) => {
    // 实现逻辑
  };

  // 辅助函数
  const loadUser = async () => {
    // 实现逻辑
  };

  // 渲染
  return (
    <div className={styles.container}>
      {/* JSX内容 */}
    </div>
  );
}

// 5. 默认导出
export default UserProfile;
```

## 注释规范

### JSDoc 注释

```javascript
/**
 * 计算用户的总积分
 * @param {User} user - 用户对象
 * @param {number} multiplier - 积分倍数
 * @returns {number} 计算后的总积分
 * @example
 * const points = calculateUserPoints(user, 1.5);
 */
function calculateUserPoints(user, multiplier = 1) {
  return user.basePoints * multiplier;
}

/**
 * 用户资料组件
 * @component
 * @param {Object} props - 组件属性
 * @param {string} props.userId - 用户ID
 * @param {Function} props.onUpdate - 更新回调函数
 */
export function UserProfile({ userId, onUpdate }) {
  // 组件实现
}
```

### 行内注释

```javascript
// ✅ 解释复杂逻辑
const discountRate = user.isPremium 
  ? 0.2  // 高级用户20%折扣
  : 0.1; // 普通用户10%折扣

// ✅ 解释业务规则
if (order.total > 1000) {
  // 订单金额超过1000元免运费
  order.shippingCost = 0;
}

// ❌ 避免显而易见的注释
const count = 0; // 设置count为0
user.name = 'John'; // 设置用户名为John
```

### TODO 注释

```javascript
// TODO: 添加错误处理
// FIXME: 修复内存泄漏问题
// HACK: 临时解决方案，需要重构
// NOTE: 这里的逻辑比较复杂，需要仔细理解
```

## JavaScript/TypeScript 规范

### 变量声明

```javascript
// ✅ 优先使用 const，需要重新赋值时使用 let
const users = [];
let currentUser = null;

// ❌ 避免使用 var
var data = {}; // 不推荐
```

### 函数定义

```javascript
// ✅ 优先使用函数声明（可提升）
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ 箭头函数用于简短的回调
const numbers = [1, 2, 3].map(n => n * 2);

// ✅ 异步函数
async function fetchUserData(userId) {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}
```

### 对象和数组

```javascript
// ✅ 使用对象字面量
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com'
};

// ✅ 使用解构赋值
const { name, email } = user;
const [first, second] = items;

// ✅ 使用扩展运算符
const newUser = { ...user, age: 31 };
const newItems = [...items, newItem];
```

### TypeScript 特定规范

```typescript
// ✅ 接口定义
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ✅ 类型别名
type Status = 'pending' | 'approved' | 'rejected';
type UserWithStatus = User & { status: Status };

// ✅ 泛型
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// ✅ 函数类型注解
function processUser(user: User): Promise<UserWithStatus> {
  // 实现
}
```

## React 组件规范

### 组件结构

```tsx
// ✅ 函数组件（推荐）
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({ 
  children, 
  variant = 'primary', 
  disabled = false, 
  onClick 
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Hooks 使用

```tsx
// ✅ 自定义Hook
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const userData = await UserService.getById(userId);
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  return { user, loading, error };
}
```

### 条件渲染

```tsx
// ✅ 简单条件
{isLoggedIn && <UserMenu />}

// ✅ 三元运算符
{loading ? <Spinner /> : <Content />}

// ✅ 复杂条件提取为函数
function renderUserStatus(user: User) {
  if (!user) return <div>用户不存在</div>;
  if (user.status === 'banned') return <div>用户已被禁用</div>;
  if (user.status === 'pending') return <div>等待审核</div>;
  return <div>正常用户</div>;
}
```

## CSS/样式规范

### CSS Modules

```css
/* UserProfile.module.css */
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.avatar {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  object-fit: cover;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .header {
    flex-direction: column;
    gap: 1rem;
  }
}
```

### Tailwind CSS

```tsx
// ✅ 使用语义化的类名组合
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {children}
    </div>
  );
}

// ✅ 复杂样式提取为变量
const buttonStyles = {
  base: 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2',
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500'
};
```

## 导入导出规范

### 导入顺序

```javascript
// 1. Node modules
import React from 'react';
import { NextPage } from 'next';
import axios from 'axios';

// 2. 内部模块（按路径层级）
import { Button } from '@/components/ui';
import { UserService } from '@/services';
import { formatDate } from '@/utils';

// 3. 相对导入
import { Header } from './Header';
import { Footer } from './Footer';

// 4. 样式文件
import styles from './HomePage.module.css';
```

### 导出规范

```javascript
// ✅ 命名导出（推荐用于工具函数）
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY'
  }).format(amount);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN');
}

// ✅ 默认导出（推荐用于组件）
function UserProfile() {
  // 组件实现
}

export default UserProfile;

// ✅ 重新导出
export { Button } from './Button';
export { Input } from './Input';
export type { User } from './types';
```

## 错误处理

```javascript
// ✅ 异步函数错误处理
async function saveUser(userData: User) {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    // 记录错误
    console.error('Failed to save user:', error);
    
    // 抛出更友好的错误信息
    if (error.response?.status === 400) {
      throw new Error('用户数据格式不正确');
    }
    
    throw new Error('保存用户失败，请稍后重试');
  }
}

// ✅ React 错误边界
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>出现了错误，请刷新页面重试</div>;
    }

    return this.props.children;
  }
}
```

## 性能优化

```tsx
// ✅ 使用 React.memo 优化组件
const UserCard = React.memo(function UserCard({ user }: { user: User }) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});

// ✅ 使用 useMemo 优化计算
function UserList({ users, searchTerm }: UserListProps) {
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div>
      {filteredUsers.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// ✅ 使用 useCallback 优化函数
function UserForm({ onSubmit }: UserFormProps) {
  const handleSubmit = useCallback((data: User) => {
    onSubmit(data);
  }, [onSubmit]);

  return (
    <form onSubmit={handleSubmit}>
      {/* 表单内容 */}
    </form>
  );
}
```

## 测试规范

```javascript
// ✅ 测试文件命名
// UserProfile.test.tsx
// utils.test.ts
// api.test.ts

// ✅ 测试结构
describe('UserProfile', () => {
  beforeEach(() => {
    // 测试前置条件
  });

  it('should render user name correctly', () => {
    // 测试实现
  });

  it('should handle loading state', () => {
    // 测试实现
  });

  describe('when user is not found', () => {
    it('should show error message', () => {
      // 测试实现
    });
  });
});
```

---

## 工具配置

确保在项目中配置以下工具来自动执行这些规范：

- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **TypeScript** - 类型检查
- **Husky** - Git hooks
- **lint-staged** - 提交前检查

## 总结

遵循这些规范可以：

1. 提高代码质量和可维护性
2. 减少团队协作中的摩擦
3. 降低新成员的学习成本
4. 减少代码审查中的争议
5. 提升开发效率

记住：**一致性比完美更重要**。团队应该共同遵守这些规范，并在实践中不断完善。