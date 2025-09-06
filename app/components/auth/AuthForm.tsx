'use client';

import React, { useState } from 'react';
import { signIn, signUp, signInWithProvider } from '../../lib/services/auth';
import type { SignInData, SignUpData } from '../../lib/services/auth';

interface AuthFormProps {
  mode?: 'signin' | 'signup';
  onSuccess?: () => void;
  onModeChange?: (mode: 'signin' | 'signup') => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ 
  mode = 'signin', 
  onSuccess,
  onModeChange 
}) => {
  const [currentMode, setCurrentMode] = useState(mode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const handleModeChange = (newMode: 'signin' | 'signup') => {
    setCurrentMode(newMode);
    setError('');
    setSuccess('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除错误信息
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError('请填写所有必填字段');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('请输入有效的邮箱地址');
      return false;
    }

    if (formData.password.length < 6) {
      setError('密码至少需要6个字符');
      return false;
    }

    if (currentMode === 'signup') {
      if (!formData.name) {
        setError('请输入姓名');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('两次输入的密码不一致');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (currentMode === 'signin') {
        const signInData: SignInData = {
          email: formData.email,
          password: formData.password
        };
        
        const result = await signIn(signInData);
        
        if (result.error) {
          setError(result.error);
        } else {
          setSuccess('登录成功！');
          if (onSuccess) {
            onSuccess();
          }
        }
      } else {
        const signUpData: SignUpData = {
          email: formData.email,
          password: formData.password,
          name: formData.name
        };
        
        const result = await signUp(signUpData);
        
        if (result.error) {
          setError(result.error);
        } else {
          setSuccess('注册成功！请检查您的邮箱以验证账户。');
          // 注册成功后可以选择自动切换到登录模式
          setTimeout(() => {
            handleModeChange('signin');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('认证错误:', error);
      setError('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'facebook') => {
    setLoading(true);
    setError('');
    
    try {
      const result = await signInWithProvider(provider);
      
      if (result.error) {
        setError(result.error);
      }
      // 社交登录会重定向，所以这里不需要处理成功情况
    } catch (error) {
      console.error('社交登录错误:', error);
      setError('社交登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      {/* 标题 */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {currentMode === 'signin' ? '登录' : '注册'}
        </h2>
        <p className="text-gray-600 mt-2">
          {currentMode === 'signin' 
            ? '欢迎回来！请登录您的账户' 
            : '创建新账户开始使用'
          }
        </p>
      </div>

      {/* 错误和成功消息 */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 姓名字段（仅注册时显示） */}
        {currentMode === 'signup' && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              姓名 *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入您的姓名"
              required
            />
          </div>
        )}

        {/* 邮箱字段 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            邮箱地址 *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入邮箱地址"
            required
          />
        </div>

        {/* 密码字段 */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            密码 *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入密码（至少6个字符）"
            required
            minLength={6}
          />
        </div>

        {/* 确认密码字段（仅注册时显示） */}
        {currentMode === 'signup' && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              确认密码 *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请再次输入密码"
              required
            />
          </div>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading 
            ? (currentMode === 'signin' ? '登录中...' : '注册中...') 
            : (currentMode === 'signin' ? '登录' : '注册')
          }
        </button>
      </form>

      {/* 分隔线 */}
      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">或</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* 社交登录按钮 */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => handleSocialLogin('google')}
          disabled={loading}
          className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          使用 Google 登录
        </button>

        <button
          type="button"
          onClick={() => handleSocialLogin('github')}
          disabled={loading}
          className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          使用 GitHub 登录
        </button>
      </div>

      {/* 模式切换 */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {currentMode === 'signin' ? '还没有账户？' : '已有账户？'}
          <button
            type="button"
            onClick={() => handleModeChange(currentMode === 'signin' ? 'signup' : 'signin')}
            className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
          >
            {currentMode === 'signin' ? '立即注册' : '立即登录'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;