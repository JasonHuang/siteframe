import React from 'react';

interface DefaultLayoutProps {
  children: React.ReactNode;
  config?: any;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <div className="default-layout">
      <div className="layout-container">
        {children}
      </div>
    </div>
  );
};

export default DefaultLayout;