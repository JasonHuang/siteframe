import React from 'react';

interface PostCardProps {
  title?: string;
  excerpt?: string;
  author?: string;
  date?: string;
  tags?: string[];
  showAuthor?: boolean;
  showDate?: boolean;
  showTags?: boolean;
  showExcerpt?: boolean;
  variant?: 'default' | 'featured';
  config?: any;
}

const PostCard: React.FC<PostCardProps> = ({ 
  title = "Sample Post Title",
  excerpt = "This is a sample post excerpt that gives readers a preview of the content.",
  author = "John Doe",
  date = "2024-01-15",
  tags = ["React", "TypeScript", "Web Development"],
  showAuthor = true,
  showDate = true,
  showTags = true,
  showExcerpt = true,
  variant = 'default'
}) => {
  const cardClass = `post-card ${variant === 'featured' ? 'post-card--featured' : ''}`;
  
  return (
    <article className={cardClass}>
      <div className="card">
        <header className="post-header">
          <h2 className="post-title">{title}</h2>
          
          <div className="post-meta">
            {showAuthor && <span className="post-author">By {author}</span>}
            {showDate && <time className="post-date">{date}</time>}
          </div>
        </header>
        
        {showExcerpt && (
          <div className="post-content">
            <p>{excerpt}</p>
          </div>
        )}
        
        {showTags && tags.length > 0 && (
          <footer className="post-footer">
            <div className="post-tags">
              {tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </footer>
        )}
      </div>
    </article>
  );
};

export default PostCard;