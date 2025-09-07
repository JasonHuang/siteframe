'use client';

const Services = () => {
  const services = [
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: '网站开发',
      description: '从企业官网到复杂的Web应用，我们提供全栈开发服务',
      features: ['响应式设计', 'SEO优化', '高性能架构', '安全防护'],
      price: '¥8,000起',
      popular: false
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: '移动应用开发',
      description: '原生和跨平台移动应用开发，覆盖iOS和Android平台',
      features: ['原生性能', '跨平台兼容', '用户体验优化', '应用商店上架'],
      price: '¥15,000起',
      popular: true
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      title: '系统集成',
      description: '企业级系统集成和API开发，连接您的业务生态',
      features: ['API设计', '数据同步', '第三方集成', '微服务架构'],
      price: '¥20,000起',
      popular: false
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: '数据分析',
      description: '商业智能和数据可视化解决方案，让数据驱动决策',
      features: ['数据可视化', '实时监控', '报表生成', '预测分析'],
      price: '¥12,000起',
      popular: false
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      title: '云服务部署',
      description: '云基础设施搭建和DevOps自动化部署服务',
      features: ['云架构设计', '自动化部署', '监控告警', '弹性扩容'],
      price: '¥6,000起',
      popular: false
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: '技术咨询',
      description: '技术架构咨询和代码审查，为您的项目保驾护航',
      features: ['架构设计', '代码审查', '性能优化', '技术培训'],
      price: '¥1,500/小时',
      popular: false
    }
  ];

  const process = [
    {
      step: '01',
      title: '需求分析',
      description: '深入了解您的业务需求和技术要求，制定详细的项目方案'
    },
    {
      step: '02',
      title: '方案设计',
      description: '基于需求分析，设计最适合的技术架构和实现方案'
    },
    {
      step: '03',
      title: '开发实施',
      description: '按照敏捷开发流程，分阶段实施项目，确保质量和进度'
    },
    {
      step: '04',
      title: '测试部署',
      description: '全面测试验证，安全部署上线，确保系统稳定运行'
    },
    {
      step: '05',
      title: '维护支持',
      description: '提供持续的技术支持和维护服务，保障系统长期稳定'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            我们的服务
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            从概念到实现，从开发到部署，我们提供全方位的技术服务，
            帮助您的业务在数字化时代获得竞争优势。
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-xl border-2 p-6 hover:shadow-lg transition-all duration-300 ${
                service.popular
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    热门推荐
                  </span>
                </div>
              )}
              
              <div className="flex items-center mb-4">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                  service.popular ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'
                }`}>
                  {service.icon}
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-900">
                  {service.title}
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                {service.description}
              </p>
              
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${
                  service.popular ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {service.price}
                </span>
                <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  service.popular
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}>
                  了解详情
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="bg-gray-50 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              我们的工作流程
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              标准化的项目流程，确保每个环节都精益求精，为您提供最优质的服务体验
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-300 transform translate-x-4"></div>
                )}
                <div className="relative z-10">
                  <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                    {step.step}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              准备开始您的项目了吗？
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              无论您需要什么样的技术解决方案，我们都能为您提供专业的服务。
              立即联系我们，获取免费的项目咨询和报价。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                免费咨询
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="/portfolio"
                className="inline-flex items-center border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
              >
                查看案例
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;