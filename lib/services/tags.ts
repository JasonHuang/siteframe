import { supabase } from '../supabase';
import type { Tag, CreateTagData, ApiResponse } from '../types/database';

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
    .from('tags')
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

// 获取所有标签
export const getAllTags = async (): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');
  
  if (error) {
    throw new Error(`获取标签列表失败: ${error.message}`);
  }
  
  return data || [];
};

// 根据 ID 获取标签
export const getTagById = async (id: string): Promise<Tag | null> => {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`获取标签详情失败: ${error.message}`);
  }
  
  return data;
};

// 根据 slug 获取标签
export const getTagBySlug = async (slug: string): Promise<Tag | null> => {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`获取标签详情失败: ${error.message}`);
  }
  
  return data;
};

// 根据 ID 列表获取标签
export const getTagsByIds = async (ids: string[]): Promise<Tag[]> => {
  if (ids.length === 0) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .in('id', ids)
    .order('name');
  
  if (error) {
    throw new Error(`获取标签列表失败: ${error.message}`);
  }
  
  return data || [];
};

// 创建标签
export const createTag = async (tagData: CreateTagData): Promise<Tag> => {
  // 生成唯一的 slug
  if (!tagData.slug) {
    tagData.slug = await generateUniqueSlug(tagData.name);
  } else {
    if (!(await isSlugUnique(tagData.slug))) {
      tagData.slug = await generateUniqueSlug(tagData.name);
    }
  }
  
  const { data, error } = await supabase
    .from('tags')
    .insert(tagData)
    .select('*')
    .single();
  
  if (error) {
    throw new Error(`创建标签失败: ${error.message}`);
  }
  
  return data;
};

// 更新标签
export const updateTag = async (
  id: string, 
  updateData: Partial<CreateTagData>
): Promise<Tag> => {
  // 如果更新了名称但没有提供新的 slug，则生成新的 slug
  if (updateData.name && !updateData.slug) {
    updateData.slug = await generateUniqueSlug(updateData.name, id);
  } else if (updateData.slug) {
    if (!(await isSlugUnique(updateData.slug, id))) {
      updateData.slug = await generateUniqueSlug(updateData.name || '', id);
    }
  }
  
  const { data, error } = await supabase
    .from('tags')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) {
    throw new Error(`更新标签失败: ${error.message}`);
  }
  
  return data;
};

// 删除标签
export const deleteTag = async (id: string): Promise<void> => {
  // 先删除内容标签关联
  await supabase
    .from('content_tags')
    .delete()
    .eq('tag_id', id);
  
  // 删除标签
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(`删除标签失败: ${error.message}`);
  }
};

// 批量创建标签
export const createMultipleTags = async (tagNames: string[]): Promise<Tag[]> => {
  const tagsToCreate: CreateTagData[] = [];
  
  for (const name of tagNames) {
    const slug = await generateUniqueSlug(name);
    tagsToCreate.push({ name, slug });
  }
  
  const { data, error } = await supabase
    .from('tags')
    .insert(tagsToCreate)
    .select('*');
  
  if (error) {
    throw new Error(`批量创建标签失败: ${error.message}`);
  }
  
  return data || [];
};

// 搜索标签
export const searchTags = async (query: string, limit: number = 10): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('name')
    .limit(limit);
  
  if (error) {
    throw new Error(`搜索标签失败: ${error.message}`);
  }
  
  return data || [];
};

// 获取标签统计信息
export const getTagStats = async (): Promise<Array<Tag & { content_count: number }>> => {
  const { data, error } = await supabase
    .from('tags')
    .select(`
      *,
      content_tags(count)
    `);
  
  if (error) {
    throw new Error(`获取标签统计失败: ${error.message}`);
  }
  
  return data?.map(tag => ({
    ...tag,
    content_count: tag.content_tags?.[0]?.count || 0
  })) || [];
};

// 获取热门标签
export const getPopularTags = async (limit: number = 10): Promise<Array<Tag & { content_count: number }>> => {
  const stats = await getTagStats();
  return stats
    .filter(tag => tag.content_count > 0)
    .sort((a, b) => b.content_count - a.content_count)
    .slice(0, limit);
};

// 根据内容获取标签
export const getTagsByContentId = async (contentId: string): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from('content_tags')
    .select(`
      tag:tags(*)
    `)
    .eq('content_id', contentId);
  
  if (error) {
    throw new Error(`获取内容标签失败: ${error.message}`);
  }
  
  return data?.map((item: any) => item.tag).filter(Boolean) || [];
};