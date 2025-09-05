import Script from 'next/script'

interface StructuredDataProps {
  type: 'website' | 'organization' | 'service' | 'breadcrumb'
  data?: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseUrl = 'https://siteframe.example.com'
    
    switch (type) {
      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'SiteFrame',
          description: '基于 Next.js 和 Supabase 的现代化内容管理系统',
          url: baseUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${baseUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        }
      
      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'SiteFrame',
          description: '现代化内容管理系统开发团队',
          url: baseUrl,
          logo: `${baseUrl}/logo.png`,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+86-400-123-4567',
            contactType: 'customer service',
            availableLanguage: ['Chinese', 'English']
          },
          sameAs: [
            'https://github.com/siteframe',
            'https://twitter.com/siteframe'
          ]
        }
      
      case 'service':
        return {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: data?.name || 'SiteFrame 服务',
          description: data?.description || '专业的网站建设和内容管理解决方案',
          provider: {
            '@type': 'Organization',
            name: 'SiteFrame'
          },
          serviceType: 'Web Development',
          areaServed: 'CN'
        }
      
      case 'breadcrumb':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data?.items?.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${baseUrl}${item.url}`
          })) || []
        }
      
      default:
        return null
    }
  }

  const structuredData = getStructuredData()

  if (!structuredData) return null

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}