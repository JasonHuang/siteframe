'use client'

import { useThemeComponent } from './lib/components/theme-provider'
import PerformanceMonitor, { PerformanceOptimizationTips } from './components/PerformanceMonitor';

export default function Home() {
  // 获取主题组件
  const Header = useThemeComponent('block', 'Header')
  const Hero = useThemeComponent('block', 'Hero')
  const Services = useThemeComponent('block', 'Services')
  const About = useThemeComponent('block', 'About')
  const Contact = useThemeComponent('block', 'Contact')
  const Footer = useThemeComponent('block', 'Footer')
  
  // 或者使用企业首页模板
  const CompanyHomepage = useThemeComponent('block', 'CompanyHomepage')
  
  
  // 如果有完整的企业首页模板，直接使用
  if (CompanyHomepage) {
    return (
      <div className="min-h-screen">
        {/* Performance Monitoring */}
        <PerformanceMonitor />
        <PerformanceOptimizationTips />
        
        <CompanyHomepage />
      </div>
    );
  }
  
  // 否则使用单独的组件组合
  return (
    <div className="min-h-screen">
      {/* Performance Monitoring */}
      <PerformanceMonitor />
      <PerformanceOptimizationTips />
      
      {/* Header Section */}
      {Header && <Header />}
      
      {/* Hero Section */}
      {Hero && <Hero />}
      
      {/* Services Section */}
      {Services && <Services />}
      
      {/* About Section */}
      {About && <About />}
      
      {/* Contact Section */}
      {Contact && <Contact />}
      
      {/* Footer Section */}
      {Footer && <Footer />}
    </div>
  );
}