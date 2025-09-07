'use client';

import { useState, useEffect, useRef } from 'react';

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const testimonials = [
    {
      id: 1,
      name: '张总',
      company: '创新科技有限公司',
      role: 'CEO',
      avatar: '/api/placeholder/80/80',
      content: 'SiteFrame团队为我们开发的企业官网不仅设计精美，性能也非常出色。他们的专业水准和服务态度都让我们非常满意，强烈推荐！',
      rating: 5,
      project: '企业官网开发'
    },
    {
      id: 2,
      name: '李经理',
      company: '智慧教育集团',
      role: '技术总监',
      avatar: '/api/placeholder/80/80',
      content: '我们的在线教育平台在SiteFrame团队的帮助下成功上线，用户体验极佳，系统稳定性也很好。他们的技术实力确实很强。',
      rating: 5,
      project: '在线教育平台'
    },
    {
      id: 3,
      name: '王女士',
      company: '美食连锁品牌',
      role: '市场总监',
      avatar: '/api/placeholder/80/80',
      content: '移动端应用开发得非常棒，界面美观，功能完善。客户反馈都很好，订单量也有明显提升。感谢SiteFrame团队的努力！',
      rating: 5,
      project: '移动应用开发'
    },
    {
      id: 4,
      name: '陈先生',
      company: '金融服务公司',
      role: 'CTO',
      avatar: '/api/placeholder/80/80',
      content: '系统集成项目非常复杂，但SiteFrame团队处理得很专业，按时交付，质量也很高。后期的技术支持也很及时。',
      rating: 5,
      project: '系统集成'
    },
    {
      id: 5,
      name: '刘总',
      company: '电商平台',
      role: '创始人',
      avatar: '/api/placeholder/80/80',
      content: '从需求分析到最终上线，整个过程都很顺利。团队沟通效率高，技术方案也很合理。我们的电商平台现在运行得很稳定。',
      rating: 5,
      project: '电商平台开发'
    }
  ];

  const stats = [
    { number: '98%', label: '客户满意度' },
    { number: '100+', label: '成功案例' },
    { number: '50+', label: '合作伙伴' },
    { number: '24/7', label: '技术支持' }
  ];

  // 自动轮播逻辑
  useEffect(() => {
    if (isAutoPlaying && !isPaused) {
      intervalRef.current = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 4000); // 每4秒切换一次
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, isPaused, testimonials.length]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            客户评价
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            听听我们的客户怎么说，他们的成功就是我们最大的成就。
            每一个项目都是我们与客户共同努力的结果。
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Testimonial */}
        <div 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-12 mb-12 relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {testimonials[activeTestimonial] && renderStars(testimonials[activeTestimonial].rating)}
              </div>
              <blockquote className="text-xl sm:text-2xl text-gray-900 font-medium leading-relaxed mb-8">
                "{testimonials[activeTestimonial]?.content}"
              </blockquote>
              
              <div className="flex items-center justify-center">
                <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">
                    {testimonials[activeTestimonial]?.name}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[activeTestimonial]?.role}, {testimonials[activeTestimonial]?.company}
                  </div>
                  <div className="text-blue-600 text-sm font-medium">
                    项目：{testimonials[activeTestimonial]?.project}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={prevTestimonial}
                className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-md"
                aria-label="Previous testimonial"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-3 w-3 rounded-full transition-colors relative ${
                      index === activeTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  >
                    {/* 进度指示器 */}
                    {index === activeTestimonial && isAutoPlaying && !isPaused && (
                      <div className="absolute inset-0 rounded-full border-2 border-blue-600 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
              
              <button
                onClick={nextTestimonial}
                className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-md"
                aria-label="Next testimonial"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* 自动播放控制 */}
            <div className="flex items-center justify-center mt-4">
              <button
                onClick={toggleAutoPlay}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                aria-label={isAutoPlaying ? 'Pause autoplay' : 'Start autoplay'}
              >
                {isAutoPlaying ? (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>暂停自动播放</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-7a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>开始自动播放</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* All Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer ${
                index === activeTestimonial
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
              onClick={() => setActiveTestimonial(index)}
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {testimonial.company}
                  </div>
                </div>
              </div>
              
              <div className="flex mb-3">
                {renderStars(testimonial.rating)}
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">
                {testimonial.content}
              </p>
              
              <div className="text-blue-600 text-xs font-medium">
                {testimonial.project}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gray-900 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              成为我们的下一个成功案例
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              加入我们满意客户的行列，让我们帮助您实现数字化转型的目标。
              立即联系我们，开始您的成功之旅。
            </p>
            <a
              href="/contact"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              开始合作
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;