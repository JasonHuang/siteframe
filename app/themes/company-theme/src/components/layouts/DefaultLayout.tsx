'use client'
import React from 'react';
import Header from '../blocks/Header';
import Footer from '../blocks/Footer';

interface DefaultLayoutProps {
  children: React.ReactNode;
  config?: any;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children, config }) => {
  return (
    <div className="default-layout">
      <Header config={config} />
      <main className="layout-container">
        {children}
      </main>
      <Footer config={config} />
    </div>
  );
};

export default DefaultLayout;