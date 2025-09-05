'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getContentList, 
  deleteContent, 
  deleteMultipleContent,
  publishContent,
  unpublishContent,
  archiveContent
} from '../../../lib/services/content';
import { getAllCategories } from '../../../lib/services/categories';
import { PermissionButton, PermissionArea } from '../auth/PermissionGuard';
import type { 
  Content, 
  Category, 
  ContentFilters, 
  PaginationParams 
} from '../../../lib/types/database';

interface ArticleListProps {
  onEdit?: (contentId: string) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({ onEdit }) => {
  const [articles, setArticles] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [filters, setFilters] = useState<ContentFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const currentFilters: ContentFilters = {
        ...filters,
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter && { status: statusFilter as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' }),
        ...(categoryFilter && { category_id: categoryFilter }),
        ...(typeFilter && { type: typeFilter as 'POST' | 'PAGE' })
      };
      
      const paginationParams: PaginationParams = {
        page: pagination.page,
        limit: pagination.limit,
        sort_by: 'created_at',
        sort_order: 'desc'
      };
      
      const [articlesData, categoriesData] = await Promise.all([
        getContentList(currentFilters, paginationParams),
        getAllCategories()
      ]);
      
      setArticles(articlesData.data);
      setPagination(articlesData.pagination);
      setCategories(categoriesData);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pagination.page, searchQuery, statusFilter, categoryFilter, typeFilter]);

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // 处理过滤
  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'status':
        setStatusFilter(value);
        break;
      case 'category':
        setCategoryFilter(value);
        break;
      case 'type':
        setTypeFilter(value);
        break;
    }
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // 处理选择
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedArticles(articles.map(article => article.id));
    } else {
      setSelectedArticles([]);
    }
  };

  const handleSelectArticle = (articleId: string, checked: boolean) => {
    if (checked) {
      setSelectedArticles(prev => [...prev, articleId]);
    } else {
      setSelectedArticles(prev => prev.filter(id => id !== articleId));
    }
  };

  // 处理单个文章操作
  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
      return;
    }
    
    try {
      await deleteContent(articleId);
      await loadData();
      setSelectedArticles(prev => prev.filter(id => id !== articleId));
    } catch (error) {
      console.error('删除文章失败:', error);
      alert('删除文章失败，请重试');
    }
  };

  const handlePublishArticle = async (articleId: string) => {
    try {
      await publishContent(articleId);
      await loadData();
    } catch (error) {
      console.error('发布文章失败:', error);
      alert('发布文章失败，请重试');
    }
  };

  const handleUnpublishArticle = async (articleId: string) => {
    try {
      await unpublishContent(articleId);
      await loadData();
    } catch (error) {
      console.error('取消发布失败:', error);
      alert('取消发布失败，请重试');
    }
  };

  const handleArchiveArticle = async (articleId: string) => {
    try {
      await archiveContent(articleId);
      await loadData();
    } catch (error) {
      console.error('归档文章失败:', error);
      alert('归档文章失败，请重试');
    }
  };

  // 处理批量操作
  const handleBatchDelete = async () => {
    if (selectedArticles.length === 0) {
      alert('请选择要删除的文章');
      return;
    }
    
    if (!confirm(`确定要删除选中的 ${selectedArticles.length} 篇文章吗？此操作不可恢复。`)) {
      return;
    }
    
    try {
      await deleteMultipleContent(selectedArticles);
      await loadData();
      setSelectedArticles([]);
    } catch (error) {
      console.error('批量删除失败:', error);
      alert('批量删除失败，请重试');
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 获取状态标签样式
  const getStatusBadge = (status: string) => {
    const styles = {
      DRAFT: 'bg-gray-100 text-gray-800',
      PUBLISHED: 'bg-green-100 text-green-800',
      ARCHIVED: 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      DRAFT: '草稿',
      PUBLISHED: '已发布',
      ARCHIVED: '已归档'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 页面标题和操作 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">文章管理</h1>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          新建文章
        </Link>
      </div>

      {/* 搜索和过滤 */}
      <PermissionArea permission="content:read">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 搜索 */}
          <div>
            <input
              type="text"
              placeholder="搜索文章..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* 状态过滤 */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有状态</option>
              <option value="DRAFT">草稿</option>
              <option value="PUBLISHED">已发布</option>
              <option value="ARCHIVED">已归档</option>
            </select>
          </div>
          
          {/* 分类过滤 */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有分类</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* 类型过滤 */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有类型</option>
              <option value="POST">文章</option>
              <option value="PAGE">页面</option>
            </select>
          </div>
          </div>
        </div>

        {/* 批量操作 */}
        {selectedArticles.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-blue-800">
                已选择 {selectedArticles.length} 篇文章
              </span>
              <div className="space-x-2">
                <PermissionButton
                  permission="content:delete"
                  onClick={handleBatchDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  批量删除
                </PermissionButton>
                <button
                  onClick={() => setSelectedArticles([])}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  取消选择
                </button>
              </div>
            </div>
          </div>
        )}

      {/* 文章列表 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedArticles.length === articles.length && articles.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  标题
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  分类
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  作者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedArticles.includes(article.id)}
                      onChange={(e) => handleSelectArticle(article.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {article.title}
                      </div>
                      {article.excerpt && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {article.excerpt}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {article.tags?.map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(article.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {article.category?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {article.author?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(article.created_at)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <PermissionButton
                        permission="content:write"
                        onClick={() => onEdit ? onEdit(article.id) : window.location.href = `/admin/articles/${article.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        编辑
                      </PermissionButton>
                      
                      {article.status === 'DRAFT' && (
                        <PermissionButton
                          permission="content:publish"
                          onClick={() => handlePublishArticle(article.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          发布
                        </PermissionButton>
                      )}
                      
                      {article.status === 'PUBLISHED' && (
                        <>
                          <PermissionButton
                            permission="content:publish"
                            onClick={() => handleUnpublishArticle(article.id)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            取消发布
                          </PermissionButton>
                          <PermissionButton
                            permission="content:write"
                            onClick={() => handleArchiveArticle(article.id)}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            归档
                          </PermissionButton>
                        </>
                      )}
                      
                      <PermissionButton
                        permission="content:delete"
                        onClick={() => handleDeleteArticle(article.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
                      </PermissionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {articles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">暂无文章</div>
            <Link
              href="/admin/articles/new"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              创建第一篇文章
            </Link>
          </div>
        )}
      </div>
      </PermissionArea>

      {/* 分页 */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            显示第 {(pagination.page - 1) * pagination.limit + 1} 到{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} 条，
            共 {pagination.total} 条记录
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(page => {
                const current = pagination.page;
                return page === 1 || page === pagination.totalPages || (page >= current - 2 && page <= current + 2);
              })
              .map((page, index, array) => {
                const showEllipsis = index > 0 && array[index - 1] !== page - 1;
                return (
                  <React.Fragment key={page}>
                    {showEllipsis && (
                      <span className="px-3 py-2 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 border rounded-md text-sm font-medium ${
                        page === pagination.page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleList;