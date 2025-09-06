'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import type { Media } from '../../lib/types/database';

interface MediaManagerProps {
  onSelect?: (media: Media) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // MB
}

const MediaManager: React.FC<MediaManagerProps> = ({
  onSelect,
  multiple = false,
  accept = 'image/*,video/*,audio/*,.pdf,.doc,.docx',
  maxSize = 10
}) => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const itemsPerPage = 20;

  // 加载媒体文件
  const loadMedia = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
      
      // 搜索过滤
      if (searchQuery) {
        query = query.or(`filename.ilike.%${searchQuery}%,alt_text.ilike.%${searchQuery}%`);
      }
      
      // 类型过滤
      if (typeFilter) {
        query = query.eq('type', typeFilter);
      }
      
      // 分页
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      setMedia(data || []);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('加载媒体文件失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [searchQuery, typeFilter, currentPage]);

  // 处理文件上传
  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;
    
    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        // 检查文件大小
        if (file.size > maxSize * 1024 * 1024) {
          throw new Error(`文件 ${file.name} 超过 ${maxSize}MB 限制`);
        }
        
        // 生成唯一文件名
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;
        
        // 上传到 Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        // 获取公共URL
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);
        
        // 确定文件类型
        let mediaType = 'OTHER';
        if (file.type.startsWith('image/')) mediaType = 'IMAGE';
        else if (file.type.startsWith('video/')) mediaType = 'VIDEO';
        else if (file.type.startsWith('audio/')) mediaType = 'AUDIO';
        else if (file.type === 'application/pdf') mediaType = 'DOCUMENT';
        else if (file.type.includes('document') || file.type.includes('text')) mediaType = 'DOCUMENT';
        
        // 保存到数据库
        const { data: mediaData, error: dbError } = await supabase
          .from('media')
          .insert({
            filename: file.name,
            original_name: file.name,
            url: publicUrl,
            size: file.size,
            mime_type: file.type,
            alt_text: '',
            caption: '',
            uploader_id: 'system' // TODO: 获取当前用户ID
          })
          .select()
          .single();
        
        if (dbError) throw dbError;
        
        return mediaData;
      } catch (error) {
        console.error(`上传文件 ${file.name} 失败:`, error);
        alert(`上传文件 ${file.name} 失败: ${error instanceof Error ? error.message : '未知错误'}`);
        return null;
      }
    });
    
    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean);
      
      if (successfulUploads.length > 0) {
        await loadMedia(); // 重新加载媒体列表
        alert(`成功上传 ${successfulUploads.length} 个文件`);
      }
    } catch (error) {
      console.error('批量上传失败:', error);
    } finally {
      setUploading(false);
    }
  };

  // 处理文件选择
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  // 处理媒体选择
  const handleMediaSelect = (mediaItem: Media) => {
    if (multiple) {
      const isSelected = selectedMedia.find(m => m.id === mediaItem.id);
      if (isSelected) {
        setSelectedMedia(prev => prev.filter(m => m.id !== mediaItem.id));
      } else {
        setSelectedMedia(prev => [...prev, mediaItem]);
      }
    } else {
      setSelectedMedia([mediaItem]);
      if (onSelect) {
        onSelect(mediaItem);
      }
    }
  };

  // 处理删除媒体
  const handleDeleteMedia = async (mediaItem: Media) => {
    if (!confirm(`确定要删除文件 "${mediaItem.filename}" 吗？此操作不可恢复。`)) {
      return;
    }
    
    try {
      // 从存储中删除文件
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([mediaItem.url]);
      
      if (storageError) {
        console.warn('删除存储文件失败:', storageError);
      }
      
      // 从数据库中删除记录
      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('id', mediaItem.id);
      
      if (dbError) throw dbError;
      
      // 重新加载媒体列表
      await loadMedia();
      
      // 从选中列表中移除
      setSelectedMedia(prev => prev.filter(m => m.id !== mediaItem.id));
      
    } catch (error) {
      console.error('删除媒体文件失败:', error);
      alert('删除文件失败，请重试');
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 根据MIME类型确定媒体类型
  const getMediaType = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'IMAGE';
    if (mimeType.startsWith('video/')) return 'VIDEO';
    if (mimeType.startsWith('audio/')) return 'AUDIO';
    if (mimeType === 'application/pdf' || mimeType.includes('document') || mimeType.includes('text')) return 'DOCUMENT';
    return 'OTHER';
  };

  // 获取文件图标
  const getFileIcon = (mediaItem: Media) => {
    const mediaType = getMediaType(mediaItem.mime_type);
    switch (mediaType) {
      case 'IMAGE':
        return (
          <img
            src={mediaItem.url}
            alt={mediaItem.alt_text || mediaItem.filename}
            className="w-full h-32 object-cover"
            loading="lazy"
          />
        );
      case 'VIDEO':
        return (
          <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </div>
        );
      case 'AUDIO':
        return (
          <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.594-.471-3.078-1.343-4.243a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.983 5.983 0 01-.757 2.829 1 1 0 11-1.415-1.414A3.987 3.987 0 0013 12a3.987 3.987 0 00-.172-1.415 1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'DOCUMENT':
        return (
          <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 页面标题和上传按钮 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">媒体管理</h1>
        <div className="flex space-x-4">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {uploading ? '上传中...' : '上传文件'}
          </button>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 搜索 */}
          <div>
            <input
              type="text"
              placeholder="搜索文件名或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* 类型过滤 */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有类型</option>
              <option value="IMAGE">图片</option>
              <option value="VIDEO">视频</option>
              <option value="AUDIO">音频</option>
              <option value="DOCUMENT">文档</option>
              <option value="OTHER">其他</option>
            </select>
          </div>
          
          {/* 选中文件信息 */}
          <div className="flex items-center text-sm text-gray-600">
            {selectedMedia.length > 0 && (
              <span>已选择 {selectedMedia.length} 个文件</span>
            )}
          </div>
        </div>
      </div>

      {/* 媒体网格 */}
      {loading ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
            {media.map((mediaItem) => {
              const isSelected = selectedMedia.find(m => m.id === mediaItem.id);
              return (
                <div
                  key={mediaItem.id}
                  className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleMediaSelect(mediaItem)}
                >
                  {/* 文件预览 */}
                  <div className="aspect-square">
                    {getFileIcon(mediaItem)}
                  </div>
                  
                  {/* 文件信息 */}
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-900 truncate" title={mediaItem.filename}>
                      {mediaItem.filename}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(mediaItem.size)}
                    </div>
                  </div>
                  
                  {/* 选中标识 */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  {/* 删除按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMedia(mediaItem);
                    }}
                    className="absolute top-2 left-2 w-6 h-6 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
          
          {media.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">暂无媒体文件</div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                上传第一个文件
              </button>
            </div>
          )}
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage <= 1}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          
          <span className="px-3 py-2 text-sm text-gray-700">
            第 {currentPage} 页，共 {totalPages} 页
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      )}

      {/* 选择确认按钮（多选模式） */}
      {multiple && selectedMedia.length > 0 && onSelect && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => {
              selectedMedia.forEach(media => onSelect(media));
              setSelectedMedia([]);
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors"
          >
            确认选择 ({selectedMedia.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaManager;