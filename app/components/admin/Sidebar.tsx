'use client';

import React from 'react';
import { PermissionButton } from '../auth/PermissionGuard';
import type { Permission } from '../../../lib/types/database';

type ViewMode = 'list' | 'editor' | 'new' | 'profile' | 'users';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onNewArticle: () => void;
  user: any;
  onSignOut: () => void;
  isLoggingOut: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  onNewArticle,
  user,
  onSignOut,
  isLoggingOut,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const menuItems = [
    {
      id: 'list',
      label: '文章列表',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      onClick: () => onViewChange('list')
    },
    {
      id: 'new',
      label: '新建文章',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      onClick: onNewArticle,
      permission: 'content:write' as Permission
    },
    {
      id: 'profile',
      label: '用户资料',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      onClick: () => onViewChange('profile')
    },
    {
      id: 'users',
      label: '用户管理',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      onClick: () => onViewChange('users'),
      permission: 'users:read' as Permission
    }
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg h-screen flex flex-col transition-all duration-300 relative`}>
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-gray-900">
            内容管理系统
          </h1>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            title={isCollapsed ? '展开菜单' : '收起菜单'}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const baseClasses = "w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 group";
          const activeClasses = isActive
            ? "bg-blue-50 text-blue-700 border border-blue-200"
            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900";

          if (item.permission) {
            return (
              <PermissionButton
                key={item.id}
                permission={item.permission}
                onClick={item.onClick}
                className={`${baseClasses} ${activeClasses}`}
              >
                <span className={`${isCollapsed ? 'mx-auto' : 'mr-3'} ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  {item.icon}
                </span>
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </PermissionButton>
            );
          }

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`${baseClasses} ${activeClasses}`}
            >
              <span className={`${isCollapsed ? 'mx-auto' : 'mr-3'} ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {item.icon}
              </span>
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.user_metadata?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.user_metadata?.name || user?.email || '管理员'}
              </p>
              <p className="text-xs text-gray-500">管理员</p>
            </div>
          </div>
        )}
        
        {isCollapsed && (
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.user_metadata?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
          </div>
        )}
        
        <button
          onClick={onSignOut}
          disabled={isLoggingOut}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-center'} px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 hover:border-red-200`}
          title={isCollapsed ? (isLoggingOut ? '退出中...' : '退出登录') : undefined}
        >
          {isLoggingOut ? (
            <div className={`w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin ${!isCollapsed ? 'mr-2' : ''}`} />
          ) : (
            <svg className={`w-4 h-4 ${!isCollapsed ? 'mr-2' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          )}
          {!isCollapsed && (isLoggingOut ? '退出中...' : '退出登录')}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;