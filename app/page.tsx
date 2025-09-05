'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Features from './components/Features';
import About from './components/About';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import PerformanceMonitor, { PerformanceOptimizationTips } from './components/PerformanceMonitor';
import { checkAdminExists } from '../lib/services/auth'

export default function Home() {
  const router = useRouter()

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
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <Features />
      
      {/* About Section */}
      <About />
      
      {/* Services Section */}
      <Services />
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Contact Section */}
      <Contact />
      
      {/* Footer Section */}
      <Footer />
    </div>
  );
}