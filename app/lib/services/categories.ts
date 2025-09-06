import { supabase } from '../supabase';
import type { Category, CreateCategoryData, ApiResponse } from '../types/database';

// 生成唯一的 slug
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
};

// 检查 slug 是否唯一
const isSlugUnique = async (slug: string, excludeId?: string): Promise<boolean> => {
  let query = supabase
    .from('categories')
    .select('id')
    .eq('slug', slug);
    
  if (excludeId) {
    query = query.neq('id', excludeId);
  }
  
  const { data, error } = await query.single();
  
  if (error && error.code === 'PGRST116') {
    return true;
  }
  
  return !data;
};

// 生成唯一的 slug
const generateUniqueSlug = async (name: string, excludeId?: string): Promise<string> => {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;
  
  while (!(await isSlugUnique(slug, excludeId))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

// 获取所有分类
export const getAllCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) {
    throw new Error(`获取分类列表失败: ${error.message}`);
  }
  
  return data || [];
};

// 根据 ID 获取分类
export const getCategoryById = async (id: string): Promise<Category | null> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`获取分类详情失败: ${error.message}`);
  }
  
  return data;
};

// 根据 slug 获取分类
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`获取分类详情失败: ${error.message}`);
  }
  
  return data;
};

// 创建分类
export const createCategory = async (categoryData: CreateCategoryData): Promise<Category> => {
  // 生成唯一的 slug
  if (!categoryData.slug) {
    categoryData.slug = await generateUniqueSlug(categoryData.name);
  } else {
    if (!(await isSlugUnique(categoryData.slug))) {
      categoryData.slug = await generateUniqueSlug(categoryData.name);
    }
  }
  
  const { data, error } = await supabase
    .from('categories')
    .insert(categoryData)
    .select('*')
    .single();
  
  if (error) {
    throw new Error(`创建分类失败: ${error.message}`);
  }
  
  return data;
};

// 更新分类
export const updateCategory = async (
  id: string, 
  updateData: Partial<CreateCategoryData>
): Promise<Category> => {
  // 如果更新了名称但没有提供新的 slug，则生成新的 slug
  if (updateData.name && !updateData.slug) {
    updateData.slug = await generateUniqueSlug(updateData.name, id);
  } else if (updateData.slug) {
    if (!(await isSlugUnique(updateData.slug, id))) {
      updateData.slug = await generateUniqueSlug(updateData.name || '', id);
    }
  }
  
  const { data, error } = await supabase
    .from('categories')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) {
    throw new Error(`更新分类失败: ${error.message}`);
  }
  
  return data;
};

// 删除分类
export const deleteCategory = async (id: string): Promise<void> => {
  // 检查是否有内容使用此分类
  const { data: contentCount } = await supabase
    .from('content')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id);
  
  if (contentCount && contentCount.length > 0) {
    throw new Error('无法删除分类：仍有内容使用此分类');
  }
  
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(`删除分类失败: ${error.message}`);
  }
};

// 获取分类统计信息
export const getCategoryStats = async (): Promise<Array<Category & { content_count: number }>> => {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      content(count)
    `);
  
  if (error) {
    throw new Error(`获取分类统计失败: ${error.message}`);
  }
  
  return data?.map(category => ({
    ...category,
    content_count: category.content?.[0]?.count || 0
  })) || [];
};