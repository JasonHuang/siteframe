/**
 * PostCard Widget - 文章卡片小部件
 * 用于展示文章摘要信息的卡片组件
 */

import React from 'react';

interface PostCardProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime?: string;
  imageUrl?: string;
  tags?: string[];
  href: string;
  className?: string;
  variant?: 'default' | 'featured' | 'compact';
}

const PostCard: React.FC<PostCardProps> = ({
  title,
  excerpt,
  author,
  date,
  readTime,
  imageUrl,
  tags = [],
  href,
  className = '',
  variant = 'default'
}) => {
  const cardClasses = {
    default: 'bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow',
    featured: 'bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-shadow ring-2 ring-primary/20',
    compact: 'bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow'
  };

  const imageClasses = {
    default: 'h-48',
    featured: 'h-64',
    compact: 'h-32'
  };

  return (
    <article className={`${cardClasses[variant]} ${className}`}>
      {/* 文章图片 */}
      {imageUrl && (
        <div className={`${imageClasses[variant]} overflow-hidden`}>
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      {/* 文章内容 */}
      <div className={`p-6 ${variant === 'compact' ? 'p-4' : ''}`}>
        {/* 标签 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* 文章标题 */}
        <h3 className={`font-bold text-foreground mb-3 hover:text-primary transition-colors ${
          variant === 'featured' ? 'text-2xl' : variant === 'compact' ? 'text-lg' : 'text-xl'
        }`}>
          <a href={href} className="block">
            {title}
          </a>
        </h3>
        
        {/* 文章摘要 */}
        <p className={`text-muted-foreground mb-4 line-clamp-3 ${
          variant === 'compact' ? 'text-sm line-clamp-2' : ''
        }`}>
          {excerpt}
        </p>
        
        {/* 文章元信息 */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{author}</span>
            </span>
            
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{date}</span>
            </span>
          </div>
          
          {readTime && (
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{readTime}</span>
            </span>
          )}
        </div>
        
        {/* 阅读更多按钮 */}
        {variant !== 'compact' && (
          <div className="mt-4">
            <a
              href={href}
              className="inline-flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <span>阅读更多</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;