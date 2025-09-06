'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser, onAuthStateChange } from '../lib/services/auth';
import type { AuthUser } from '../lib/types/database';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 刷新用户信息
  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // 刷新用户信息失败
      setUser(null);
    }
  };

  // 登出
  const handleSignOut = async () => {
    try {
      const { signOut } = await import('../lib/services/auth');
      await signOut();
      setUser(null);
    } catch (error) {
      // 登出失败
    }
  };

  useEffect(() => {
    // 初始化时获取当前用户
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        // 初始化认证失败
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 监听认证状态变化
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signOut: handleSignOut,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义 Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 高阶组件：需要认证的页面
export const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">需要登录</h2>
            <p className="text-gray-600 mb-6">请先登录以访问此页面</p>
            <a
              href="/auth/signin"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              前往登录
            </a>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  return AuthenticatedComponent;
};

// 高阶组件：需要特定角色的页面
export const withRole = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: string[]
) => {
  const RoleProtectedComponent: React.FC<P> = (props) => {
    const { user, loading } = useAuth();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [roleLoading, setRoleLoading] = useState(true);

    useEffect(() => {
      const fetchUserRole = async () => {
        if (user) {
          try {
            const { getUserProfile } = await import('../lib/services/auth');
            const { data: userProfile } = await getUserProfile(user.id);
            setUserRole(userProfile?.role || null);
          } catch (error) {
            // 获取用户角色失败
            setUserRole(null);
          }
        }
        setRoleLoading(false);
      };

      fetchUserRole();
    }, [user]);

    if (loading || roleLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">需要登录</h2>
            <p className="text-gray-600 mb-6">请先登录以访问此页面</p>
            <a
              href="/auth/signin"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              前往登录
            </a>
          </div>
        </div>
      );
    }

    if (!userRole || !allowedRoles.includes(userRole)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">权限不足</h2>
            <p className="text-gray-600 mb-6">您没有权限访问此页面</p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              返回首页
            </a>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };

  RoleProtectedComponent.displayName = `withRole(${Component.displayName || Component.name})`;
  return RoleProtectedComponent;
};

// 权限检查 Hook
export const usePermission = (permission: string) => {
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserPermission = async () => {
      if (user) {
        try {
          const { checkPermission } = await import('../lib/services/auth');
          const result = await checkPermission(permission);
          setHasPermission(result);
        } catch (error) {
          // 检查权限失败
          setHasPermission(false);
        }
      } else {
        setHasPermission(false);
      }
      setLoading(false);
    };

    checkUserPermission();
  }, [user, permission]);

  return { hasPermission, loading };
};