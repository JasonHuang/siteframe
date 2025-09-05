'use client';

import React, { useState } from 'react';
import { withAuth, useAuth } from '../contexts/AuthContext';
import { PermissionButton, PermissionArea } from '../components/auth/PermissionGuard';
import ArticleList from '../components/admin/ArticleList';
import ArticleEditor from '../components/admin/ArticleEditor';
import UserProfile from '../components/auth/UserProfile';
import UserManagement from '../components/admin/UserManagement';

type ViewMode = 'list' | 'editor' | 'new' | 'profile' | 'users';

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
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
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                内容管理系统
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'list'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                文章列表
              </button>
              <PermissionButton
                permission="content:write"
                onClick={handleNewArticle}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'new'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                新建文章
              </PermissionButton>
              <button
                onClick={() => setCurrentView('profile')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'profile'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                用户资料
              </button>
              <PermissionButton
                permission="users:read"
                onClick={() => setCurrentView('users')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'users'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                用户管理
              </PermissionButton>
              
              {/* 用户信息和退出登录 */}
              <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.user_metadata?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.name || user?.email || '管理员'}</p>
                      <p className="text-xs text-gray-500">管理员</p>
                    </div>
                  </div>
                <button
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="退出登录"
                >
                  {isLoggingOut ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2" />
                  ) : (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  )}
                  <span className="hidden sm:inline">{isLoggingOut ? '退出中...' : '退出登录'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>



      {/* 主要内容区域 */}
      <main className="py-6">
        {currentView === 'list' && (
          <ArticleList onEdit={handleEditArticle} />
        )}
        
        {(currentView === 'editor' || currentView === 'new') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <UserProfile
            onClose={() => setCurrentView('list')}
          />
        )}
        
        {currentView === 'users' && (
          <PermissionArea permission="users:read">
            <UserManagement
              onClose={() => setCurrentView('list')}
            />
          </PermissionArea>
        )}
      </main>
    </div>
  );
};

export default withAuth(AdminDashboard);