import React from 'react';

interface PostLayoutProps {
  children: React.ReactNode;
  config?: any;
}

const PostLayout: React.FC<PostLayoutProps> = ({ children }) => {
  return (
    <div className="post-layout">
      <article className="post-container">
        {children}
      </article>
    </div>
  );
};

export default PostLayout;