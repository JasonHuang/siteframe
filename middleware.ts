import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 创建 Supabase 客户端用于中间件
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function middleware(request: NextRequest) {
  // 移除 /setup 页面的中间件保护，让页面组件自己处理管理员存在的逻辑
  return NextResponse.next()
}

export const config = {
  matcher: ['/setup']
}