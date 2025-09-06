import { NextRequest, NextResponse } from 'next/server';
import { themeService } from '../../../lib/services/themes';
import { checkApiPermission } from '../../../lib/services/auth';

/**
 * GET /api/admin/themes
 * 获取主题列表
 */
export async function GET(request: NextRequest) {
  try {
    // 检查管理员权限
    const hasAdmin = await checkApiPermission(request, 'themes:read');
    if (!hasAdmin) {
      return NextResponse.json(
        { error: '需要管理员权限' },
        { status: 403 }
      );
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    // 获取主题列表
    const result = await themeService.getThemes({
      page,
      limit,
      sort_by: sortBy,
      sort_order: sortOrder as 'asc' | 'desc'
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('获取主题列表失败:', error);
    return NextResponse.json(
      { 
        error: '获取主题列表失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}