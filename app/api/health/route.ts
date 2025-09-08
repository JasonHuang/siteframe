import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

// 健康检查端点
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    const checks: Record<string, any> = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      checks: {}
    };

    // 数据库连接检查
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('count')
        .limit(1)
        .single();
      
      checks.checks.database = {
        status: error ? 'unhealthy' : 'healthy',
        responseTime: Date.now() - startTime,
        error: error?.message || null
      };
    } catch (dbError) {
      checks.checks.database = {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: dbError instanceof Error ? dbError.message : 'Unknown database error'
      };
    }

    // Redis 连接检查（如果配置了 Redis）
    if (process.env.REDIS_URL) {
      try {
        // 这里可以添加 Redis 连接检查
        // const redis = new Redis(process.env.REDIS_URL);
        // await redis.ping();
        checks.checks.redis = {
          status: 'healthy',
          responseTime: Date.now() - startTime
        };
      } catch (redisError) {
        checks.checks.redis = {
          status: 'unhealthy',
          responseTime: Date.now() - startTime,
          error: redisError instanceof Error ? redisError.message : 'Unknown Redis error'
        };
      }
    }

    // 文件系统检查
    try {
      const fs = require('fs');
      const path = require('path');
      const testFile = path.join(process.cwd(), 'public', '.health-check');
      
      fs.writeFileSync(testFile, Date.now().toString());
      fs.unlinkSync(testFile);
      
      checks.checks.filesystem = {
        status: 'healthy',
        responseTime: Date.now() - startTime
      };
    } catch (fsError) {
      checks.checks.filesystem = {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: fsError instanceof Error ? fsError.message : 'Unknown filesystem error'
      };
    }

    // 计算总体健康状态
    const hasUnhealthyChecks = Object.values(checks.checks).some(
      (check: any) => check.status === 'unhealthy'
    );
    
    if (hasUnhealthyChecks) {
      checks.status = 'unhealthy';
    }

    checks.responseTime = Date.now() - startTime;

    // 根据健康状态返回相应的 HTTP 状态码
    const statusCode = checks.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(checks, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      },
      { 
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  }
}

// 简单的健康检查端点（只返回 200 状态）
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 });
}