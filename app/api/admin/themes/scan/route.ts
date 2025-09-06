import { NextRequest, NextResponse } from 'next/server';
import { themeScannerService } from '../../../../lib/services/theme-scanner';
import { checkApiPermission } from '../../../../lib/services/auth';

/**
 * POST /api/admin/themes/scan
 * 扫描并注册主题
 */
export async function POST(request: NextRequest) {
  try {
    // 检查管理员权限
    const hasAdmin = await checkApiPermission(request, 'themes:write');
    if (!hasAdmin) {
      return NextResponse.json(
        { error: '需要管理员权限' },
        { status: 403 }
      );
    }

    // 执行主题扫描
    const result = await themeScannerService.scanAndRegisterThemes();

    return NextResponse.json({
      success: true,
      data: result,
      message: `扫描完成：发现 ${result.discovered} 个主题，注册 ${result.registered} 个主题`
    });
  } catch (error) {
    console.error('主题扫描失败:', error);
    return NextResponse.json(
      { 
        error: '主题扫描失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/themes/scan
 * 获取已注册的主题列表
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

    const registeredThemes = themeScannerService.getRegisteredThemes();

    return NextResponse.json({
      success: true,
      data: registeredThemes
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