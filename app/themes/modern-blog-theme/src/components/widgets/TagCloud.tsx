/**
 * TagCloud Widget - 标签云小部件
 * 展示标签集合的组件
 */

import React from 'react';

interface Tag {
  name: string;
  count: number;
  href: string;
}

interface TagCloudProps {
  tags: Tag[];
  className?: string;
  maxTags?: number;
  variant?: 'default' | 'weighted' | 'minimal';
  showCount?: boolean;
}

const TagCloud: React.FC<TagCloudProps> = ({
  tags,
  className = '',
  maxTags = 20,
  variant = 'default',
  showCount = true
}) => {
  // 按文章数量排序并限制数量
  const sortedTags = tags
    .sort((a, b) => b.count - a.count)
    .slice(0, maxTags);

  // 计算标签权重（用于调整大小）
  const maxCount = Math.max(...sortedTags.map(tag => tag.count));
  const minCount = Math.min(...sortedTags.map(tag => tag.count));
  
  const getTagSize = (count: number) => {
    if (variant !== 'weighted') return '';
    
    const ratio = (count - minCount) / (maxCount - minCount) || 0;
    if (ratio > 0.8) return 'text-lg';
    if (ratio > 0.6) return 'text-base';
    if (ratio > 0.4) return 'text-sm';
    return 'text-xs';
  };

  const getTagClasses = (tag: Tag) => {
    const baseClasses = 'inline-flex items-center space-x-1 transition-colors';
    
    switch (variant) {
      case 'weighted':
        return `${baseClasses} px-3 py-1 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full ${getTagSize(tag.count)}`;
      case 'minimal':
        return `${baseClasses} text-muted-foreground hover:text-primary underline-offset-4 hover:underline`;
      default:
        return `${baseClasses} px-3 py-1 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg text-sm`;
    }
  };

  if (sortedTags.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-muted-foreground">暂无标签</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">标签云</h3>
        <span className="text-sm text-muted-foreground">
          {sortedTags.length} 个标签
        </span>
      </div>
      
      {/* 标签列表 */}
      <div className={`flex flex-wrap gap-2 ${
        variant === 'minimal' ? 'gap-4' : ''
      }`}>
        {sortedTags.map((tag, index) => (
          <a
            key={index}
            href={tag.href}
            className={getTagClasses(tag)}
            title={`${tag.name} (${tag.count} 篇文章)`}
          >
            <span>{tag.name}</span>
            {showCount && variant !== 'minimal' && (
              <span className={`
                ${variant === 'weighted' ? 'text-xs opacity-75' : 'text-xs'}
                bg-background/20 px-1.5 py-0.5 rounded-full min-w-[1.5rem] text-center
              `}>
                {tag.count}
              </span>
            )}
          </a>
        ))}
      </div>
      
      {/* 查看更多链接 */}
      {tags.length > maxTags && (
        <div className="text-center pt-2">
          <a
            href="/tags"
            className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
          >
            查看所有标签 ({tags.length})
          </a>
        </div>
      )}
    </div>
  );
};

export default TagCloud;