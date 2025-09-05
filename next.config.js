/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 13.4+ 默认启用 app directory，无需配置
  images: {
    domains: ['localhost'],
  },
  // 启用严格模式
  reactStrictMode: true,
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
    // 优化缓存配置以解决大字符串序列化警告
    if (config.cache && config.cache.type === 'filesystem') {
      config.cache.compression = 'gzip';
      config.cache.maxMemoryGenerations = 1;
    }
    
    return config;
  },
}

module.exports = nextConfig