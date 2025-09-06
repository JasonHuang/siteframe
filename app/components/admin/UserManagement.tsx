'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { User, Permission } from '../../lib/types/database';

interface UserManagementProps {
  onClose?: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onClose }) => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // 角色选项
  const roleOptions = [
    { value: 'ADMIN', label: '管理员', color: 'bg-red-100 text-red-800' },
    { value: 'EDITOR', label: '编辑', color: 'bg-blue-100 text-blue-800' },
    { value: 'AUTHOR', label: '作者', color: 'bg-green-100 text-green-800' },
    { value: 'USER', label: '用户', color: 'bg-gray-100 text-gray-800' }
  ];

  // 权限描述
  const permissionDescriptions: Record<Permission, string> = {
    'content:read': '查看内容',
    'content:write': '编辑内容',
    'content:delete': '删除内容',
    'content:publish': '发布内容',
    'media:read': '查看媒体',
    'media:write': '上传媒体',
    'media:delete': '删除媒体',
    'users:read': '查看用户',
    'users:write': '编辑用户',
    'users:delete': '删除用户',
    'settings:read': '查看设置',
    'settings:write': '修改设置',
    'themes:read': '查看主题',
    'themes:write': '编辑主题',
    'themes:delete': '删除主题',
    'themes:activate': '激活主题'
  };

  // 角色权限映射
  const rolePermissions: Record<User['role'], Permission[]> = {
    ADMIN: [
      'content:read', 'content:write', 'content:delete', 'content:publish',
      'media:read', 'media:write', 'media:delete',
      'users:read', 'users:write', 'users:delete',
      'settings:read', 'settings:write'
    ],
    EDITOR: [
      'content:read', 'content:write', 'content:delete', 'content:publish',
      'media:read', 'media:write', 'media:delete'
    ],
    AUTHOR: [
      'content:read', 'content:write',
      'media:read', 'media:write'
    ],
    USER: [
      'content:read',
      'media:read'
    ]
  };

  // 加载用户列表
  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('加载用户列表失败:', error);
      setMessage({ type: 'error', text: '加载用户列表失败' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 过滤用户
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // 更新用户角色
  const updateUserRole = async (userId: string, newRole: User['role']) => {
    if (userId === currentUser?.id) {
      setMessage({ type: 'error', text: '不能修改自己的角色' });
      return;
    }

    setActionLoading(userId);
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      setMessage({ type: 'success', text: '用户角色更新成功' });
    } catch (error: any) {
      console.error('更新用户角色失败:', error);
      setMessage({ type: 'error', text: '更新用户角色失败' });
    } finally {
      setActionLoading(null);
    }
  };

  // 删除用户
  const deleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
      setMessage({ type: 'error', text: '不能删除自己的账户' });
      return;
    }

    if (!confirm('确定要删除这个用户吗？此操作不可撤销。')) {
      return;
    }

    setActionLoading(userId);
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.filter(user => user.id !== userId));
      setMessage({ type: 'success', text: '用户删除成功' });
    } catch (error: any) {
      console.error('删除用户失败:', error);
      setMessage({ type: 'error', text: '删除用户失败' });
    } finally {
      setActionLoading(null);
    }
  };

  // 获取角色样式
  const getRoleStyle = (role: User['role']) => {
    const option = roleOptions.find(opt => opt.value === role);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  // 获取角色标签
  const getRoleLabel = (role: User['role']) => {
    const option = roleOptions.find(opt => opt.value === role);
    return option?.label || role;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* 头部 */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">用户管理</h2>
              <p className="text-sm text-gray-600 mt-1">管理系统用户和权限</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 消息提示 */}
        {message && (
          <div className={`mx-6 mt-4 p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* 搜索和过滤 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索用户名或邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">所有角色</option>
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 用户列表 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用户
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  角色
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  权限
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  注册时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.avatar}
                            alt={user.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                          {user.id === currentUser?.id && (
                            <span className="ml-2 text-xs text-blue-600">(您)</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value as User['role'])}
                      disabled={user.id === currentUser?.id || actionLoading === user.id}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${
                        user.id === currentUser?.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      } ${getRoleStyle(user.role)}`}
                    >
                      {roleOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {rolePermissions[user.role].slice(0, 3).map(permission => (
                        <span
                          key={permission}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          title={permissionDescriptions[permission]}
                        >
                          {permissionDescriptions[permission]}
                        </span>
                      ))}
                      {rolePermissions[user.role].length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{rolePermissions[user.role].length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        编辑
                      </button>
                      {user.id !== currentUser?.id && (
                        <button
                          onClick={() => deleteUser(user.id)}
                          disabled={actionLoading === user.id}
                          className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                        >
                          {actionLoading === user.id ? '删除中...' : '删除'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">没有找到匹配的用户</p>
          </div>
        )}
      </div>

      {/* 权限说明 */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">角色权限说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roleOptions.map(role => (
            <div key={role.value} className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${role.color}`}>
                  {role.label}
                </span>
              </div>
              <div className="space-y-1">
                {rolePermissions[role.value as User['role']].map(permission => (
                  <div key={permission} className="text-sm text-gray-600">
                    • {permissionDescriptions[permission]}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;