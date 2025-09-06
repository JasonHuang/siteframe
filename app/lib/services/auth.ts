import { supabase } from '../supabase';
import type { AuthUser } from '../types/database';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  social_links?: Record<string, string>;
}

export interface AuthResponse {
  user?: AuthUser;
  error?: string;
}

// 用户注册
export const signUp = async (data: SignUpData, isAdmin: boolean = false): Promise<AuthResponse> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name
        }
      }
    });

    if (authError) {
      return { error: authError.message };
    }

    if (authData.user) {
      // 检查是否是已存在的邮箱（Supabase特殊行为：identities为null或空数组表示邮箱已存在）
      if (!authData.user.identities || authData.user.identities.length === 0) {
        return { error: '该邮箱已被注册，请直接登录或使用其他邮箱' };
      }

      // 同步用户到 public.users 表
      await syncUserToPublicTable(authData.user, isAdmin);

      return {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          user_metadata: authData.user.user_metadata
        }
      };
    }

    return { error: '注册失败' };
  } catch (error) {
    console.error('注册错误:', error);
    return { error: '注册过程中发生错误' };
  }
};

// 用户登录
export const signIn = async (data: SignInData): Promise<AuthResponse> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    });

    if (authError) {
      return { error: authError.message };
    }

    if (authData.user) {
      // 自动同步用户到 public.users 表
      await syncUserToPublicTable(authData.user);
      
      return {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          user_metadata: authData.user.user_metadata
        }
      };
    }

    return { error: '登录失败' };
  } catch (error) {
    console.error('登录错误:', error);
    return { error: '登录过程中发生错误' };
  }
};

// 用户登出
export const signOut = async (): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: error.message };
    }
    return {};
  } catch (error) {
    console.error('登出错误:', error);
    return { error: '登出过程中发生错误' };
  }
};

// 获取当前用户
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata
    };
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return null;
  }
};

// 获取用户会话
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('获取会话错误:', error);
      return null;
    }

    return session;
  } catch (error) {
    console.error('获取会话错误:', error);
    return null;
  }
};

// 重置密码
export const resetPassword = async (email: string): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (error) {
    console.error('重置密码错误:', error);
    return { error: '重置密码过程中发生错误' };
  }
};

// 更新密码
export const updatePassword = async (newPassword: string): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (error) {
    console.error('更新密码错误:', error);
    return { error: '更新密码过程中发生错误' };
  }
};

// 更新用户资料
export const updateProfile = async (data: UpdateProfileData): Promise<{ error?: string }> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: '用户未登录' };
    }

    // 更新认证用户的元数据
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        name: data.name,
        avatar: data.avatar
      }
    });

    if (authError) {
      return { error: authError.message };
    }

    // 更新用户资料表
    const { error: profileError } = await supabase
      .from('users')
      .update({
        name: data.name,
        avatar: data.avatar,
        bio: data.bio,
        website: data.website,
        social_links: data.social_links
      })
      .eq('id', user.id);

    if (profileError) {
      return { error: profileError.message };
    }

    return {};
  } catch (error) {
    console.error('更新资料错误:', error);
    return { error: '更新资料过程中发生错误' };
  }
};

// 获取用户详细资料
export const getUserProfile = async (userId?: string) => {
  try {
    const targetUserId = userId || (await getCurrentUser())?.id;
    
    if (!targetUserId) {
      return { error: '用户ID无效' };
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', targetUserId)
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data };
  } catch (error) {
    console.error('获取用户资料错误:', error);
    return { error: '获取用户资料过程中发生错误' };
  }
};

// 检查是否已存在管理员
export const checkAdminExists = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'ADMIN')
      .limit(1);

    if (error) {
      console.error('检查管理员失败:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('检查管理员错误:', error);
    return false;
  }
};

// 验证邮箱
export const verifyEmail = async (token: string, type: string): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type as any
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (error) {
    console.error('验证邮箱错误:', error);
    return { error: '验证邮箱过程中发生错误' };
  }
};

// 社交登录
export const signInWithProvider = async (provider: 'google' | 'github' | 'facebook'): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (error) {
    console.error('社交登录错误:', error);
    return { error: '社交登录过程中发生错误' };
  }
};

// 监听认证状态变化
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email,
        user_metadata: session.user.user_metadata
      });
    } else {
      callback(null);
    }
  });
};

// 同步用户到 public.users 表
const syncUserToPublicTable = async (authUser: any, forceAdmin: boolean = false) => {
  
  try {
    // 检查用户是否已存在
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', authUser.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ 检查用户是否存在时出错:', checkError);
      return;
    }

    if (!existingUser) {
      
      // 检查是否是第一个用户（设为管理员）
      const { count, error: countError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('❌ 检查用户数量时出错:', countError);
        return;
      }

      const isFirstUser = count === 0;
      const role = forceAdmin || isFirstUser ? 'ADMIN' : 'USER';
      

      
      // 插入新用户
      const userData = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      

      
      const { error: insertError } = await supabase
        .from('users')
        .insert(userData);

      if (insertError) {
        console.error('❌ 同步用户到 public.users 失败:', insertError);
      }
    } else {
      // 用户已存在，跳过同步
    }
  } catch (error) {
    console.error('❌ 同步用户过程中发生错误:', error);
  }
};

// 检查用户权限
export const checkPermission = async (permission: string): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    const { data: userProfile } = await getUserProfile(user.id);
    if (!userProfile) return false;

    // 这里可以根据用户角色检查权限
    // 暂时简单实现
    const role = userProfile.role;
    
    switch (role) {
      case 'ADMIN':
        return true;
      case 'EDITOR':
        return !permission.includes('users:') && !permission.includes('settings:');
      case 'AUTHOR':
        return permission.includes('content:read') || permission.includes('content:write') || permission.includes('media:');
      case 'USER':
        return permission.includes('content:read') || permission.includes('media:read');
      default:
        return false;
    }
  } catch (error) {
    console.error('检查权限错误:', error);
    return false;
  }
};