import { NextResponse } from 'next/server';
import { unifiedThemeService } from '../../../lib/services/unified-theme-service';

/**
 * GET /api/themes/active
 * 获取当前活跃主题（公共接口，无需认证）
 */
export async function GET() {
  try {
    // 获取活跃主题
    const activeTheme = await unifiedThemeService.getActiveTheme();
    
    if (!activeTheme) {
      return NextResponse.json({
        success: false,
        error: '未找到活跃主题'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: activeTheme
    });
  } catch (error) {
    console.error('获取活跃主题失败:', error);
    return NextResponse.json(
      { 
        error: '获取活跃主题失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}