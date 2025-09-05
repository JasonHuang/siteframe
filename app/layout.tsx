import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import StructuredData from './components/StructuredData'
import { AuthProvider } from './contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'SiteFrame - 现代化内容管理系统',
    template: '%s | SiteFrame'
  },
  description: '基于 Next.js 和 Supabase 的现代化内容管理系统，提供高效的网站建设和内容管理解决方案',
  keywords: ['Next.js', 'Supabase', '内容管理系统', 'CMS', '网站建设', '现代化开发'],
  authors: [{ name: 'SiteFrame Team' }],
  creator: 'SiteFrame',
  publisher: 'SiteFrame',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://siteframe.example.com'),
  alternates: {
    canonical: '/',
    languages: {
      'zh-CN': '/zh-CN',
      'en-US': '/en-US',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://siteframe.example.com',
    title: 'SiteFrame - 现代化内容管理系统',
    description: '基于 Next.js 和 Supabase 的现代化内容管理系统，提供高效的网站建设和内容管理解决方案',
    siteName: 'SiteFrame',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SiteFrame - 现代化内容管理系统',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SiteFrame - 现代化内容管理系统',
    description: '基于 Next.js 和 Supabase 的现代化内容管理系统，提供高效的网站建设和内容管理解决方案',
    images: ['/og-image.jpg'],
    creator: '@siteframe',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <StructuredData type="website" />
        <StructuredData type="organization" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}