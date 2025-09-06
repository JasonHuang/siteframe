import { NextRequest, NextResponse } from 'next/server';
import { themeScannerService } from '../../../../lib/services/theme-scanner';
import { checkApiPermission } from '../../../../lib/services/auth';

/**
 * GET /api/admin/themes/detect
 * 轻量级主题检测 - 只检测新主题，不进行完整扫描
 */
export async function GET(request: NextRequest) {
  try {
    // 检查管理员权限
    const hasAdmin = await checkApiPermission(request, 'themes:write');
    if (!hasAdmin) {
      return NextResponse.json(
        { error: '需要管理员权限' },
        { status: 403 }
      );
    }

    // 执行轻量级主题检测
    const result = await themeScannerService.detectNewThemes();

    return NextResponse.json({
      success: true,
      data: result,
      message: result.newThemes.length > 0 
        ? `发现 ${result.newThemes.length} 个新主题` 
        : '没有发现新主题'
    });
  } catch (error) {
    console.error('主题检测失败:', error);
    return NextResponse.json(
      { 
        error: '主题检测失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/themes/detect
 * 检测并自动注册新主题
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 开始主题检测API调用');
    
    // 检查管理员权限
    console.log('🔐 检查管理员权限...');
    const hasAdmin = await checkApiPermission(request, 'themes:write');
    console.log('🔐 管理员权限检查结果:', hasAdmin);
    
    if (!hasAdmin) {
      console.log('❌ 权限不足，返回403');
      return NextResponse.json(
        { error: '需要管理员权限' },
        { status: 403 }
      );
    }

    // 检测并注册新主题
    console.log('🎨 开始检测并注册新主题...');
    const result = await themeScannerService.detectAndRegisterNewThemes();
    console.log('🎨 主题检测结果:', JSON.stringify(result, null, 2));

    const response = {
      success: true,
      data: result,
      message: result.registered > 0 
        ? `自动注册了 ${result.registered} 个新主题` 
        : '没有发现需要注册的新主题'
    };
    
    console.log('✅ API响应:', JSON.stringify(response, null, 2));
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ 主题自动注册失败:', error);
    console.error('❌ 错误堆栈:', error instanceof Error ? error.stack : '无堆栈信息');
    
    const errorResponse = { 
      error: '主题自动注册失败',
      details: error instanceof Error ? error.message : '未知错误',
      stack: error instanceof Error ? error.stack : undefined
    };
    
    console.log('❌ 错误响应:', JSON.stringify(errorResponse, null, 2));
    return NextResponse.json(errorResponse, { status: 500 });
  }
}