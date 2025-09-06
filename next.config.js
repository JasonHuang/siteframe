/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 13.4+ 默认启用 app directory，无需配置
  images: {
    domains: ['localhost'],
  },
  // 暂时禁用严格模式进行调试
  reactStrictMode: false,
  // 启用SWC压缩
  swcMinify: true,
  // 环境变量会自动从 .env 文件加载
  // 重定向配置
  async redirects() {
    return [
      // 示例重定向
      // {
      //   source: '/old-page',
      //   destination: '/new-page',
      //   permanent: true,
      // },
    ]
  },
  // 重写配置
  async rewrites() {
    return [
      // 示例重写
      // {
      //   source: '/api/external/:path*',
      //   destination: 'https://external-api.com/:path*',
      // },
    ]
  },
  // 头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  // Webpack配置优化
  webpack: (config, { dev, isServer }) => {
    // 抑制Node.js弃用警告
    const originalEmit = process.emit;
    process.emit = function (name, data, ...args) {
      if (name === 'warning' && typeof data === 'object' && data.name === 'DeprecationWarning' && data.message.includes('punycode')) {
        return false;
      }
      return originalEmit.apply(process, arguments);
    };

    // 优化缓存配置以解决大字符串序列化警告
    if (config.cache && config.cache.type === 'filesystem') {
      config.cache.compression = 'gzip';
      config.cache.maxMemoryGenerations = 1;
      // 设置缓存大小限制
      config.cache.maxAge = 1000 * 60 * 60 * 24 * 7; // 7天
      config.cache.buildDependencies = {
        config: [__filename],
      };
    }

    // 优化模块解析
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    // 优化构建性能
    if (dev) {
      // 开发环境优化
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    } else {
      // 生产环境优化
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              maxSize: 244000, // 限制chunk大小为244KB
            },
          },
        },
      };
    }
    
    return config;
  },
}

module.exports = nextConfig