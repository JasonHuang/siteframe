'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useThemeComponent } from './lib/components/theme-provider'
import PerformanceMonitor, { PerformanceOptimizationTips } from './components/PerformanceMonitor';
import { checkAdminExists } from './lib/services/auth'

export default function Home() {
  const router = useRouter()
  
  // 获取主题组件
  const Header = useThemeComponent('block', 'Header')
  const HeroSection = useThemeComponent('block', 'HeroSection')
  const Features = useThemeComponent('block', 'Features')
  const About = useThemeComponent('block', 'About')
  const Services = useThemeComponent('block', 'Services')
  const Testimonials = useThemeComponent('block', 'Testimonials')
  const Contact = useThemeComponent('block', 'Contact')
  const Footer = useThemeComponent('block', 'Footer')

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const adminExists = await checkAdminExists()
        if (!adminExists) {
          router.push('/setup')
        }
      } catch (error) {
        // 检查管理员状态失败
        // 如果检查失败，也跳转到setup页面
        router.push('/setup')
      }
    }

    checkAdmin()
  }, [router])
  return (
    <div className="min-h-screen">
      {/* Performance Monitoring */}
      <PerformanceMonitor />
      <PerformanceOptimizationTips />
      
      {/* Header Section */}
      {Header && <Header />}
      
      {/* Hero Section */}
      {HeroSection && <HeroSection />}
      
      {/* Features Section */}
      {Features && <Features />}
      
      {/* About Section */}
      {About && <About />}
      
      {/* Services Section */}
      {Services && <Services />}
      
      {/* Testimonials Section */}
      {Testimonials && <Testimonials />}
      
      {/* Contact Section */}
      {Contact && <Contact />}
      
      {/* Footer Section */}
      {Footer && <Footer />}
    </div>
  );
}