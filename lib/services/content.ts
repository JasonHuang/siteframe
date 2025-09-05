import { supabase, supabaseAdmin } from '../supabase';
import type { 
  Content, 
  CreateContentData, 
  UpdateContentData, 
  ContentFilters, 
  PaginationParams,
  PaginatedResponse,
  ApiResponse 
} from '../types/database';

// 生成唯一的 slug
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
};

// 检查 slug 是否唯一
export const isSlugUnique = async (slug: string, excludeId?: string): Promise<boolean> => {
  let query = supabase
    .from('content')
    .select('id')
    .eq('slug', slug);
    
  if (excludeId) {
    query = query.neq('id', excludeId);
  }
  
  const { data, error } = await query.single();
  
  if (error && error.code === 'PGRST116') {
    // 没有找到记录，slug 是唯一的
    return true;
  }
  
  return !data;
};

// 生成唯一的 slug
export const generateUniqueSlug = async (title: string, excludeId?: string): Promise<string> => {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;
  
  while (!(await isSlugUnique(slug, excludeId))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

// 获取内容列表（带分页和过滤）
export const getContentList = async (
  filters: ContentFilters = {},
  pagination: PaginationParams = {}
): Promise<PaginatedResponse<Content>> => {
  const {
    status,
    type,
    category_id,
    tag_ids,
    author_id,
    search,
    date_from,
    date_to
  } = filters;
  
  const {
    page = 1,
    limit = 10,
    sort_by = 'created_at',
    sort_order = 'desc'
  } = pagination;
  
  let query = supabase
    .from('content')
    .select(`
      *,
      author:users!author_id(id, name, email, avatar),
      category:categories(id, name, slug),
      content_tags(tag:tags(id, name, slug))
    `, { count: 'exact' });
  
  // 应用过滤条件
  if (status) {
    query = query.eq('status', status);
  }
  
  if (type) {
    query = query.eq('type', type);
  }
  
  if (category_id) {
    query = query.eq('category_id', category_id);
  }
  
  if (author_id) {
    query = query.eq('author_id', author_id);
  }
  
  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }
  
  if (date_from) {
    query = query.gte('created_at', date_from);
  }
  
  if (date_to) {
    query = query.lte('created_at', date_to);
  }
  
  // 应用排序和分页
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  query = query
    .order(sort_by, { ascending: sort_order === 'asc' })
    .range(from, to);
  
  const { data, error, count } = await query;
  
  if (error) {
    throw new Error(`获取内容列表失败: ${error.message}`);
  }
  
  // 处理标签数据
  const processedData = data?.map(item => ({
    ...item,
    tags: item.content_tags?.map((ct: any) => ct.tag).filter(Boolean) || []
  })) || [];
  
  return {
    data: processedData,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    }
  };
};

// 根据 ID 获取内容详情
export const getContentById = async (id: string): Promise<Content | null> => {
  const { data, error } = await supabase
    .from('content')
    .select(`
      *,
      author:users!author_id(id, name, email, avatar),
      category:categories(id, name, slug),
      content_tags(tag:tags(id, name, slug))
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`获取内容详情失败: ${error.message}`);
  }
  
  // 处理标签数据
  return {
    ...data,
    tags: data.content_tags?.map((ct: any) => ct.tag).filter(Boolean) || []
  };
};

// 根据 slug 获取内容详情
export const getContentBySlug = async (slug: string): Promise<Content | null> => {
  const { data, error } = await supabase
    .from('content')
    .select(`
      *,
      author:users!author_id(id, name, email, avatar),
      category:categories(id, name, slug),
      content_tags(tag:tags(id, name, slug))
    `)
    .eq('slug', slug)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`获取内容详情失败: ${error.message}`);
  }
  
  // 处理标签数据
  return {
    ...data,
    tags: data.content_tags?.map((ct: any) => ct.tag).filter(Boolean) || []
  };
};

// 创建内容
export const createContent = async (contentData: CreateContentData, userId: string): Promise<Content> => {
  const { tag_ids, ...contentFields } = contentData;
  
  // 生成唯一的 slug
  if (!contentFields.slug) {
    contentFields.slug = await generateUniqueSlug(contentFields.title);
  } else {
    // 检查提供的 slug 是否唯一
    if (!(await isSlugUnique(contentFields.slug))) {
      contentFields.slug = await generateUniqueSlug(contentFields.title);
    }
  }
  
  // 设置发布时间
  if (contentFields.status === 'PUBLISHED' && !contentFields.published_at) {
    contentFields.published_at = new Date().toISOString();
  }
  
  const { data, error } = await supabase
    .from('content')
    .insert({
      ...contentFields,
      author_id: userId
    })
    .select(`
      *,
      author:users!author_id(id, name, email, avatar),
      category:categories(id, name, slug)
    `)
    .single();
  
  if (error) {
    throw new Error(`创建内容失败: ${error.message}`);
  }
  
  // 处理标签关联
  if (tag_ids && tag_ids.length > 0) {
    const tagInserts = tag_ids.map(tagId => ({
      content_id: data.id,
      tag_id: tagId
    }));
    
    const { error: tagError } = await supabase
      .from('content_tags')
      .insert(tagInserts);
    
    if (tagError) {
      console.error('添加标签关联失败:', tagError);
    }
  }
  
  // 重新获取完整数据（包含标签）
  const fullContent = await getContentById(data.id);
  return fullContent!;
};

// 更新内容
export const updateContent = async (updateData: UpdateContentData): Promise<Content> => {
  const { id, tag_ids, ...contentFields } = updateData;
  
  // 如果更新了标题但没有提供新的 slug，则生成新的 slug
  if (contentFields.title && !contentFields.slug) {
    contentFields.slug = await generateUniqueSlug(contentFields.title, id);
  } else if (contentFields.slug) {
    // 检查提供的 slug 是否唯一
    if (!(await isSlugUnique(contentFields.slug, id))) {
      contentFields.slug = await generateUniqueSlug(contentFields.title || '', id);
    }
  }
  
  // 如果状态改为已发布且没有发布时间，则设置发布时间
  if (contentFields.status === 'PUBLISHED') {
    const currentContent = await getContentById(id);
    if (currentContent && !currentContent.published_at) {
      contentFields.published_at = new Date().toISOString();
    }
  }
  
  const { data, error } = await supabase
    .from('content')
    .update(contentFields)
    .eq('id', id)
    .select(`
      *,
      author:users!author_id(id, name, email, avatar),
      category:categories(id, name, slug)
    `)
    .single();
  
  if (error) {
    throw new Error(`更新内容失败: ${error.message}`);
  }
  
  // 处理标签关联更新
  if (tag_ids !== undefined) {
    // 删除现有标签关联
    await supabase
      .from('content_tags')
      .delete()
      .eq('content_id', id);
    
    // 添加新的标签关联
    if (tag_ids.length > 0) {
      const tagInserts = tag_ids.map(tagId => ({
        content_id: id,
        tag_id: tagId
      }));
      
      const { error: tagError } = await supabase
        .from('content_tags')
        .insert(tagInserts);
      
      if (tagError) {
        console.error('更新标签关联失败:', tagError);
      }
    }
  }
  
  // 重新获取完整数据（包含标签）
  const fullContent = await getContentById(id);
  return fullContent!;
};

// 删除内容
export const deleteContent = async (id: string): Promise<void> => {
  // 先删除标签关联
  await supabase
    .from('content_tags')
    .delete()
    .eq('content_id', id);
  
  // 删除内容
  const { error } = await supabase
    .from('content')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(`删除内容失败: ${error.message}`);
  }
};

// 批量删除内容
export const deleteMultipleContent = async (ids: string[]): Promise<void> => {
  // 先删除标签关联
  await supabase
    .from('content_tags')
    .delete()
    .in('content_id', ids);
  
  // 删除内容
  const { error } = await supabase
    .from('content')
    .delete()
    .in('id', ids);
  
  if (error) {
    throw new Error(`批量删除内容失败: ${error.message}`);
  }
};

// 发布内容
export const publishContent = async (id: string): Promise<Content> => {
  return updateContent({
    id,
    status: 'PUBLISHED',
    published_at: new Date().toISOString()
  });
};

// 取消发布内容
export const unpublishContent = async (id: string): Promise<Content> => {
  return updateContent({
    id,
    status: 'DRAFT'
  });
};

// 归档内容
export const archiveContent = async (id: string): Promise<Content> => {
  return updateContent({
    id,
    status: 'ARCHIVED'
  });
};

// 搜索内容
export const searchContent = async (
  query: string,
  filters: Omit<ContentFilters, 'search'> = {},
  pagination: PaginationParams = {}
): Promise<PaginatedResponse<Content>> => {
  return getContentList(
    { ...filters, search: query },
    pagination
  );
};

// 获取相关内容
export const getRelatedContent = async (
  contentId: string,
  limit: number = 5
): Promise<Content[]> => {
  // 获取当前内容的分类和标签
  const currentContent = await getContentById(contentId);
  if (!currentContent) {
    return [];
  }
  
  let query = supabase
    .from('content')
    .select(`
      *,
      author:users!author_id(id, name, email, avatar),
      category:categories(id, name, slug),
      content_tags(tag:tags(id, name, slug))
    `)
    .eq('status', 'PUBLISHED')
    .neq('id', contentId)
    .limit(limit);
  
  // 优先显示同分类的内容
  if (currentContent.category_id) {
    query = query.eq('category_id', currentContent.category_id);
  }
  
  const { data, error } = await query.order('published_at', { ascending: false });
  
  if (error) {
    console.error('获取相关内容失败:', error);
    return [];
  }
  
  // 处理标签数据
  return data?.map(item => ({
    ...item,
    tags: item.content_tags?.map((ct: any) => ct.tag).filter(Boolean) || []
  })) || [];
};