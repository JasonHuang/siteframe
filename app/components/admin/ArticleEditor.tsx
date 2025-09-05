'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  createContent, 
  updateContent, 
  getContentById 
} from '../../../lib/services/content';
import { getAllCategories } from '../../../lib/services/categories';
import { getAllTags, createTag } from '../../../lib/services/tags';
import type { 
  Content, 
  Category, 
  Tag, 
  CreateContentData, 
  UpdateContentData 
} from '../../../lib/types/database';

interface ArticleEditorProps {
  contentId?: string | undefined;
  onSave?: (content: Content) => void;
  onCancel?: () => void;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({ 
  contentId, 
  onSave, 
  onCancel 
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  
  const [formData, setFormData] = useState<CreateContentData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    status: 'DRAFT',
    type: 'POST',
    category_id: '',
    tag_ids: [],
    meta_title: '',
    meta_description: '',
    published_at: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 加载分类和标签
        const [categoriesData, tagsData] = await Promise.all([
          getAllCategories(),
          getAllTags()
        ]);
        
        setCategories(categoriesData);
        setTags(tagsData);
        
        // 如果是编辑模式，加载内容数据
        if (contentId) {
          const content = await getContentById(contentId);
          if (content) {
            setFormData({
              title: content.title,
              slug: content.slug,
              content: content.content || '',
              excerpt: content.excerpt || '',
              featured_image: content.featured_image || '',
              status: content.status,
              type: content.type,
              category_id: content.category_id || '',
              tag_ids: content.tags?.map(tag => tag.id) || [],
              meta_title: content.meta_title || '',
              meta_description: content.meta_description || '',
              published_at: content.published_at || ''
            });
            setSelectedTags(content.tags?.map((tag: Tag) => tag.id) || []);
          }
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [contentId]);

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '标题不能为空';
    }
    
    if (!formData.content?.trim()) {
      newErrors.content = '内容不能为空';
    }
    
    if (formData.status === 'PUBLISHED' && !formData.excerpt?.trim()) {
      newErrors.excerpt = '发布文章需要摘要';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    try {
      const submitData = {
        ...formData,
        tag_ids: selectedTags
      };
      
      let result: Content;
      
      if (contentId) {
        // 更新内容
        result = await updateContent({ id: contentId, ...submitData });
      } else {
        // 创建新内容
        // 这里需要获取当前用户ID，暂时使用占位符
        const userId = 'current-user-id'; // TODO: 从认证系统获取
        result = await createContent(submitData, userId);
      }
      
      if (onSave) {
        onSave(result);
      } else {
        router.push('/admin/articles');
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  // 处理标签选择
  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev: string[]) => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // 创建新标签
  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      const newTag = await createTag({ name: newTagName.trim() });
      setTags((prev: Tag[]) => [...prev, newTag]);
      setSelectedTags((prev: string[]) => [...prev, newTag.id]);
      setNewTagName('');
      setShowTagInput(false);
    } catch (error) {
      console.error('创建标签失败:', error);
      alert('创建标签失败，请重试');
    }
  };

  // 生成 slug
  const generateSlug = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
    setFormData((prev: CreateContentData) => ({ ...prev, slug }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            {contentId ? '编辑文章' : '创建文章'}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标题 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData((prev: CreateContentData) => ({ ...prev, title: e.target.value }));
                if (!contentId && !formData.slug) {
                  generateSlug(e.target.value);
                }
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="输入文章标题"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData((prev: CreateContentData) => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="url-slug"
            />
            <p className="mt-1 text-sm text-gray-500">
              留空将自动根据标题生成
            </p>
          </div>

          {/* 内容 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              内容 *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData((prev: CreateContentData) => ({ ...prev, content: e.target.value }))}
              rows={15}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="输入文章内容（支持 Markdown）"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
          </div>

          {/* 摘要 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              摘要
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData((prev: CreateContentData) => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.excerpt ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="输入文章摘要"
            />
            {errors.excerpt && (
              <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 分类 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData((prev: CreateContentData) => ({ ...prev, category_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">选择分类</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                类型
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData((prev: CreateContentData) => ({ ...prev, type: e.target.value as 'POST' | 'PAGE' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="POST">文章</option>
                <option value="PAGE">页面</option>
              </select>
            </div>
          </div>

          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签
            </label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTags.includes(tag.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowTagInput(true)}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                >
                  + 新建标签
                </button>
              </div>
              
              {showTagInput && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="输入标签名称"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateTag();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleCreateTag}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    创建
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTagInput(false);
                      setNewTagName('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 特色图片 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              特色图片 URL
            </label>
            <input
              type="url"
              value={formData.featured_image}
              onChange={(e) => setFormData((prev: CreateContentData) => ({ ...prev, featured_image: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* SEO 设置 */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO 设置</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO 标题
                </label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData((prev: CreateContentData) => ({ ...prev, meta_title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="留空将使用文章标题"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO 描述
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData((prev: CreateContentData) => ({ ...prev, meta_description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="留空将使用文章摘要"
                />
              </div>
            </div>
          </div>

          {/* 发布设置 */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">发布设置</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  状态
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((prev: CreateContentData) => ({ ...prev, status: e.target.value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DRAFT">草稿</option>
                  <option value="PUBLISHED">已发布</option>
                  <option value="ARCHIVED">已归档</option>
                </select>
              </div>
              
              {formData.status === 'PUBLISHED' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    发布时间
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setFormData((prev: CreateContentData) => ({ 
                      ...prev, 
                      published_at: e.target.value ? new Date(e.target.value).toISOString() : '' 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    留空将使用当前时间
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel || (() => router.back())}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '保存中...' : (contentId ? '更新' : '创建')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleEditor;