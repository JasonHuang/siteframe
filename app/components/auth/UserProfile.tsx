'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile, updatePassword, getUserProfile } from '../../lib/services/auth';
import type { User } from '../../lib/types/database';

interface UserProfileProps {
  onClose?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  
  // 用户资料表单
  const [profileData, setProfileData] = useState({
    display_name: '',
    bio: '',
    avatar: '',
    website: '',
    location: ''
  });
  
  // 密码表单
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 加载用户资料
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data: profile } = await getUserProfile(user.id);
        if (profile) {
          setProfileData({
            display_name: profile.display_name || '',
            bio: profile.bio || '',
            avatar: profile.avatar || '',
            website: profile.website || '',
            location: profile.location || ''
          });
        }
      } catch (error) {
        console.error('加载用户资料失败:', error);
        setMessage({ type: 'error', text: '加载用户资料失败' });
      } finally {
        setProfileLoading(false);
      }
    };

    loadUserProfile();
  }, [user]);

  // 更新用户资料
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      await updateProfile(profileData);
      await refreshUser();
      setMessage({ type: 'success', text: '用户资料更新成功' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || '更新用户资料失败' });
    } finally {
      setLoading(false);
    }
  };

  // 更新密码
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: '新密码和确认密码不匹配' });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: '新密码长度至少为6位' });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      await updatePassword(passwordData.newPassword);
      setMessage({ type: 'success', text: '密码更新成功' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || '更新密码失败' });
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* 头部 */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">用户资料</h2>
              <p className="text-sm text-gray-600 mt-1">管理您的个人信息和账户设置</p>
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

        {/* 标签页 */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              个人信息
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'password'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              密码设置
            </button>
          </nav>
        </div>

        {/* 消息提示 */}
        {message && (
          <div className={`mx-6 mt-4 p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* 内容区域 */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱地址
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">邮箱地址无法修改</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    显示名称
                  </label>
                  <input
                    type="text"
                    value={profileData.display_name}
                    onChange={(e) => setProfileData({ ...profileData, display_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="输入您的显示名称"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    头像URL
                  </label>
                  <input
                    type="url"
                    value={profileData.avatar}
          onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    网站
                  </label>
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    位置
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="您的位置"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  个人简介
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="介绍一下您自己..."
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? '保存中...' : '保存更改'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  当前密码
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="输入当前密码"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  新密码
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="输入新密码（至少6位）"
                  minLength={6}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  确认新密码
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="再次输入新密码"
                  minLength={6}
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? '更新中...' : '更新密码'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;