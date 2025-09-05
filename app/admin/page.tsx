'use client';

import React, { useState } from 'react';
import { withAuth, useAuth } from '../contexts/AuthContext';
import { PermissionArea } from '../components/auth/PermissionGuard';
import ArticleList from '../components/admin/ArticleList';
import ArticleEditor from '../components/admin/ArticleEditor';
import UserProfile from '../components/auth/UserProfile';
import UserManagement from '../components/admin/UserManagement';
import Sidebar from '../components/admin/Sidebar';

type ViewMode = 'list' | 'editor' | 'new' | 'profile' | 'users';

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);


  const handleEditArticle = (articleId: string) => {
    setEditingArticleId(articleId);
    setCurrentView('editor');
  };

  const handleNewArticle = () => {
    setEditingArticleId(null);
    setCurrentView('new');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setEditingArticleId(null);
  };

  const handleSave = () => {
    // 保存成功后返回列表
    handleBackToList();
  };

  const handleSignOut = async () => {
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      await signOut();
      // 退出登录后会自动重定向到登录页面
    } catch (error) {
      // 退出登录失败
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          onNewArticle={handleNewArticle}
          user={user}
          onSignOut={handleSignOut}
          isLoggingOut={isLoggingOut}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative">
            <Sidebar
              currentView={currentView}
              onViewChange={(view) => {
                setCurrentView(view);
                setMobileMenuOpen(false);
              }}
              onNewArticle={() => {
                handleNewArticle();
                setMobileMenuOpen(false);
              }}
              user={user}
              onSignOut={handleSignOut}
              isLoggingOut={isLoggingOut}
            />
          </div>
        </div>
      )}

      {/* 右侧主要内容区域 */}
      <main className="flex-1 overflow-auto bg-gray-50 transition-all duration-300">
        {/* Mobile Header */}
        <div className="md:hidden bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">内容管理系统</h1>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="h-full">
          {currentView === 'list' && (
            <div className="p-6">
              <ArticleList onEdit={handleEditArticle} />
            </div>
          )}
          
          {(currentView === 'editor' || currentView === 'new') && (
            <div className="p-6">
              {/* 返回按钮 */}
              <div className="mb-6">
                <button
                  onClick={handleBackToList}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  返回文章列表
                </button>
              </div>
              
              <ArticleEditor
                contentId={editingArticleId || undefined}
                onSave={handleSave}
                onCancel={handleBackToList}
              />
            </div>
          )}
          
          {currentView === 'profile' && (
            <div className="p-6">
              <UserProfile
                onClose={() => setCurrentView('list')}
              />
            </div>
          )}
          
          {currentView === 'users' && (
            <div className="p-6">
              <PermissionArea permission="users:read">
                <UserManagement
                  onClose={() => setCurrentView('list')}
                />
              </PermissionArea>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default withAuth(AdminDashboard);