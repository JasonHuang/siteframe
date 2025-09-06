'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 数字 */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            404
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* 错误信息 */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            页面未找到
          </h2>
          <p className="text-gray-600 leading-relaxed">
            抱歉，您访问的页面不存在或已被移动。
            <br />
            请检查网址是否正确，或返回首页继续浏览。
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span className="mr-2">🏠</span>
            返回首页
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <span className="mr-2">←</span>
            返回上一页
          </button>
        </div>

        {/* 搜索建议 */}
        <div className="mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20">
          <div className="flex items-center justify-center text-gray-600 mb-2">
            <span className="mr-2">🔍</span>
            <span className="text-sm font-medium">建议</span>
          </div>
          <p className="text-sm text-gray-500">
            您可以尝试搜索相关内容，或查看我们的主要功能页面。
          </p>
        </div>

        {/* 装饰性元素 */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>
    </div>
  );
}

// 设置页面元数据
export const metadata = {
  title: '页面未找到 - 404',
  description: '抱歉，您访问的页面不存在。',
};