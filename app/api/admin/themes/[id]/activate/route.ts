import { NextRequest, NextResponse } from 'next/server';
import { unifiedThemeService } from '../../../../../lib/services/unified-theme-service';
import { checkApiPermission } from '../../../../../lib/services/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 检查管理员权限
    const hasAdmin = await checkApiPermission(request, 'themes:write');
    if (!hasAdmin) {
      return NextResponse.json(
        { error: '需要管理员权限' },
        { status: 403 }
      );
    }

    await unifiedThemeService.activateTheme(params.id);
    
    return NextResponse.json({ 
      success: true, 
      message: '主题激活成功' 
    });
  } catch (error) {
    console.error('Theme activation error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '激活主题失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}