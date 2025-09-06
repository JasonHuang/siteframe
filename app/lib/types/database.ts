// 数据库类型定义
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'USER';
  bio?: string;
  website?: string;
  social_links?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featured_image?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  type: 'POST' | 'PAGE';
  author_id: string;
  category_id?: string;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  // 关联数据
  author?: User;
  category?: Category;
  tags?: Tag[];
}

export interface Media {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  alt_text?: string;
  caption?: string;
  uploader_id: string;
  created_at: string;
  updated_at: string;
  // 关联数据
  uploader?: User;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Theme {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ThemeSetting {
  id: string;
  theme_id: string;
  setting_key: string;
  setting_value: any; // JSONB 类型
  setting_type: 'color' | 'font' | 'spacing' | 'layout' | 'custom';
  description?: string;
  created_at: string;
  updated_at: string;
}

// API 响应类型
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 表单数据类型
export interface CreateContentData {
  title: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featured_image?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  type: 'POST' | 'PAGE';
  category_id?: string;
  tag_ids?: string[];
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
}

export interface UpdateContentData extends Partial<CreateContentData> {
  id: string;
}

export interface CreateCategoryData {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
}

export interface CreateTagData {
  name: string;
  slug?: string;
  color?: string;
}

export interface CreateMediaData {
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  alt_text?: string;
  caption?: string;
}

// 搜索和过滤类型
export interface ContentFilters {
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  type?: 'POST' | 'PAGE';
  category_id?: string;
  tag_ids?: string[];
  author_id?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Supabase Auth 类型扩展
export interface AuthUser {
  id: string;
  email?: string | undefined;
  user_metadata?: {
    name?: string;
    avatar?: string;
  };
}

// 权限相关类型
export type Permission = 
  | 'content:read'
  | 'content:write'
  | 'content:delete'
  | 'content:publish'
  | 'media:read'
  | 'media:write'
  | 'media:delete'
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'settings:read'
  | 'settings:write'
  | 'themes:read'
  | 'themes:write'
  | 'themes:delete'
  | 'themes:activate';

export const ROLE_PERMISSIONS: Record<User['role'], Permission[]> = {
  ADMIN: [
    'content:read', 'content:write', 'content:delete', 'content:publish',
    'media:read', 'media:write', 'media:delete',
    'users:read', 'users:write', 'users:delete',
    'settings:read', 'settings:write',
    'themes:read', 'themes:write', 'themes:delete', 'themes:activate'
  ],
  EDITOR: [
    'content:read', 'content:write', 'content:delete', 'content:publish',
    'media:read', 'media:write', 'media:delete',
    'themes:read'
  ],
  AUTHOR: [
    'content:read', 'content:write',
    'media:read', 'media:write',
    'themes:read'
  ],
  USER: [
    'content:read',
    'media:read',
    'themes:read'
  ]
};