'use client'

import { useThemeComponent } from './lib/components/theme-provider'
import PerformanceMonitor, { PerformanceOptimizationTips } from './components/PerformanceMonitor';

export default function Home() {
  // 获取主题组件
  const Header = useThemeComponent('block', 'Header')
  const HeroSection = useThemeComponent('block', 'HeroSection')
  const Features = useThemeComponent('block', 'Features')
  const About = useThemeComponent('block', 'About')
  const Services = useThemeComponent('block', 'Services')
  const Testimonials = useThemeComponent('block', 'Testimonials')
  const Contact = useThemeComponent('block', 'Contact')
  const Footer = useThemeComponent('block', 'Footer')
  
  
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