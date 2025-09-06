import { createClient } from '@supabase/supabase-js';

// 创建 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * 获取认证头信息
 * @returns Promise<HeadersInit | null> 包含 Authorization 头的对象，如果未认证则返回 null
 */
export async function getAuthHeaders(): Promise<HeadersInit | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session?.access_token) {
      console.warn('获取认证会话失败:', error?.message || '无有效会话');
      return null;
    }
    
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    };
  } catch (error) {
    console.error('获取认证头失败:', error);
    return null;
  }
}

/**
 * 发送认证 API 请求
 * @param url 请求 URL
 * @param options fetch 选项
 * @returns Promise<Response>
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const authHeaders = await getAuthHeaders();
  
  if (!authHeaders) {
    throw new Error('用户未认证，无法发送请求');
  }
  
  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers
    }
  };
  
  return fetch(url, mergedOptions);
}

/**
 * 发送认证 POST 请求
 * @param url 请求 URL
 * @param data 请求数据
 * @param options 额外的 fetch 选项
 * @returns Promise<Response>
 */
export async function authenticatedPost(url: string, data?: any, options: RequestInit = {}): Promise<Response> {
  const requestOptions: RequestInit = {
    method: 'POST',
    ...options
  };
  
  if (data) {
    requestOptions.body = JSON.stringify(data);
  }
  
  return authenticatedFetch(url, requestOptions);
}

/**
 * 发送认证 GET 请求
 * @param url 请求 URL
 * @param options 额外的 fetch 选项
 * @returns Promise<Response>
 */
export async function authenticatedGet(url: string, options: RequestInit = {}): Promise<Response> {
  return authenticatedFetch(url, {
    method: 'GET',
    ...options
  });
}

/**
 * 发送认证 PUT 请求
 * @param url 请求 URL
 * @param data 请求数据
 * @param options 额外的 fetch 选项
 * @returns Promise<Response>
 */
export async function authenticatedPut(url: string, data?: any, options: RequestInit = {}): Promise<Response> {
  const requestOptions: RequestInit = {
    method: 'PUT',
    ...options
  };
  
  if (data) {
    requestOptions.body = JSON.stringify(data);
  }
  
  return authenticatedFetch(url, requestOptions);
}

/**
 * 发送认证 DELETE 请求
 * @param url 请求 URL
 * @param options 额外的 fetch 选项
 * @returns Promise<Response>
 */
export async function authenticatedDelete(url: string, options: RequestInit = {}): Promise<Response> {
  return authenticatedFetch(url, {
    method: 'DELETE',
    ...options
  });
}