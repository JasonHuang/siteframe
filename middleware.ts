import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 创建 Supabase 客户端用于中间件
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function middleware(request: NextRequest) {
  // 检查是否访问设置页面
  if (request.nextUrl.pathname === '/setup') {
    try {
      // 检查是否已存在管理员
      const { data: adminExists } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'ADMIN')
        .limit(1)
        .single()
      
      // 如果已存在管理员，重定向到登录页面
      if (adminExists) {
        return NextResponse.redirect(new URL('/auth/signin', request.url))
      }
    } catch (error) {
      // 如果查询出错（比如没有找到管理员），允许访问设置页面
      // No admin found, allowing access to setup page
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/setup']
}