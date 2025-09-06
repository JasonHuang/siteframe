'use client';

import React from 'react';
import { usePermission } from '../../contexts/AuthContext';
import type { Permission } from '../../lib/types/database';

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean; // 当传入多个权限时，是否需要全部满足
}

interface MultiplePermissionGuardProps {
  permissions: Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

// 单个权限检查组件
const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  children,
  fallback = null
}) => {
  const { hasPermission, loading } = usePermission(permission);

  if (loading) {
    return (
      <div className="inline-block">
        <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
      </div>
    );
  }

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

// 多个权限检查组件
export const MultiplePermissionGuard: React.FC<MultiplePermissionGuardProps> = ({
  permissions,
  children,
  fallback = null,
  requireAll = true
}) => {
  const permissionResults = permissions.map(permission => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return usePermission(permission);
  });

  const loading = permissionResults.some(result => result.loading);
  const hasPermissions = requireAll
    ? permissionResults.every(result => result.hasPermission)
    : permissionResults.some(result => result.hasPermission);

  if (loading) {
    return (
      <div className="inline-block">
        <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
      </div>
    );
  }

  return hasPermissions ? <>{children}</> : <>{fallback}</>;
};

// 权限检查 Hook（用于条件渲染）
export const usePermissionCheck = (permission: Permission) => {
  const { hasPermission, loading } = usePermission(permission);
  return { hasPermission, loading };
};

// 多个权限检查 Hook
export const useMultiplePermissionCheck = (
  permissions: Permission[],
  requireAll: boolean = true
) => {
  const permissionResults = permissions.map(permission => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return usePermission(permission);
  });

  const loading = permissionResults.some(result => result.loading);
  const hasPermissions = requireAll
    ? permissionResults.every(result => result.hasPermission)
    : permissionResults.some(result => result.hasPermission);

  return { hasPermissions, loading };
};

// 权限按钮组件
interface PermissionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  permission: Permission;
  children: React.ReactNode;
  fallbackText?: string;
  showFallback?: boolean;
}

export const PermissionButton: React.FC<PermissionButtonProps> = ({
  permission,
  children,
  fallbackText = '权限不足',
  showFallback = false,
  className = '',
  ...props
}) => {
  const { hasPermission, loading } = usePermission(permission);

  if (loading) {
    return (
      <button
        {...props}
        disabled
        className={`${className} opacity-50 cursor-not-allowed`}
      >
        <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
      </button>
    );
  }

  if (!hasPermission) {
    if (showFallback) {
      return (
        <button
          {...props}
          disabled
          className={`${className} opacity-50 cursor-not-allowed`}
          title={fallbackText}
        >
          {children}
        </button>
      );
    }
    return null;
  }

  return (
    <button {...props} className={className}>
      {children}
    </button>
  );
};

// 权限链接组件
interface PermissionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  permission: Permission;
  children: React.ReactNode;
  fallbackText?: string;
  showFallback?: boolean;
}

export const PermissionLink: React.FC<PermissionLinkProps> = ({
  permission,
  children,
  fallbackText = '权限不足',
  showFallback = false,
  className = '',
  ...props
}) => {
  const { hasPermission, loading } = usePermission(permission);

  if (loading) {
    return (
      <span className={`${className} opacity-50`}>
        <div className="animate-pulse bg-gray-200 h-4 w-16 rounded inline-block"></div>
      </span>
    );
  }

  if (!hasPermission) {
    if (showFallback) {
      return (
        <span
          className={`${className} opacity-50 cursor-not-allowed`}
          title={fallbackText}
        >
          {children}
        </span>
      );
    }
    return null;
  }

  return (
    <a {...props} className={className}>
      {children}
    </a>
  );
};

// 权限区域组件（带边框和提示）
interface PermissionAreaProps {
  permission: Permission;
  children: React.ReactNode;
  title?: string;
  description?: string;
  showBorder?: boolean;
}

export const PermissionArea: React.FC<PermissionAreaProps> = ({
  permission,
  children,
  title = '权限受限区域',
  description = '您没有权限访问此功能',
  showBorder = true
}) => {
  const { hasPermission, loading } = usePermission(permission);

  if (loading) {
    return (
      <div className={`${showBorder ? 'border border-gray-200 rounded-lg p-4' : ''}`}>
        <div className="animate-pulse space-y-2">
          <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
          <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className={`${showBorder ? 'border border-gray-200 rounded-lg p-6' : 'p-6'} text-center`}>
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9-7a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;