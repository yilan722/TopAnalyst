'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import SuperAnalystLogo from './SuperAnalystLogo'

interface SignupPageProps {
  locale: 'en' | 'zh'
}

export default function SignupPage({ locale }: SignupPageProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    agreeTerms: false
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = locale === 'zh' ? '请输入名字' : 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = locale === 'zh' ? '请输入姓氏' : 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = locale === 'zh' ? '请输入邮箱地址' : 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = locale === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email'
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = locale === 'zh' ? '请同意条款和条件' : 'Please agree to terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      // 发送欢迎邮件
      const response = await fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          locale: locale
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // 成功发送邮件
        const isDevMode = result.messageId && result.messageId.startsWith('dev-mode-')
        if (isDevMode) {
          alert(locale === 'zh' 
            ? `开发模式：欢迎邮件已模拟发送到 ${formData.email}！\n\n要启用真实邮件发送，请配置邮件服务环境变量。` 
            : `Development mode: Welcome email simulated for ${formData.email}!\n\nTo enable real email sending, please configure email service environment variables.`)
        } else {
          alert(locale === 'zh' 
            ? `欢迎邮件已发送到 ${formData.email}！请检查您的邮箱。` 
            : `Welcome email sent to ${formData.email}! Please check your inbox.`)
        }
        
        // 重置表单
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          agreeTerms: false
        })
        setErrors({})
      } else {
        // 发送邮件失败
        console.error('Email sending failed:', result)
        alert(locale === 'zh' 
          ? '邮件发送失败，请稍后重试或联系客服。' 
          : 'Failed to send email. Please try again later or contact support.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(locale === 'zh' 
        ? '提交失败，请检查网络连接后重试。' 
        : 'Submission failed. Please check your connection and try again.')
    }
  }

  const handleLogin = () => {
    router.push(`/${locale}`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Left Section - Promotional */}
        <div className="hidden lg:flex lg:w-1/3 bg-gradient-to-br from-purple-600 to-purple-800 text-white p-12 flex-col justify-center">
          <div className="max-w-md">
            {/* Logo - Larger size */}
            <div className="mb-12">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <svg 
                    width="64" 
                    height="64" 
                    viewBox="0 0 32 32" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <rect x="6" y="16" width="2" height="4" fill="currentColor" />
                    <rect x="9" y="14" width="2" height="6" fill="currentColor" />
                    <rect x="12" y="12" width="2" height="8" fill="currentColor" />
                    <path d="M6 18 L9 15 L12 10 L15 7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13 5 L15 7 L13 9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 20 L26 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="flex-shrink-0">
                  <div className="font-bold text-white text-5xl leading-tight">
                    SuperAnalyst
                  </div>
                  <div className="text-lg text-purple-200 leading-tight">
                    Pro Equity Research
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="text-6xl font-bold mb-4">
              {locale === 'zh' ? '注册' : 'Sign up'}
            </h1>
            <h2 className="text-5xl font-bold mb-6">
              {locale === 'zh' ? '获取免费试用' : 'Get free trial'}
            </h2>
            <div className="w-16 h-1 bg-red-400 mb-8"></div>
            <p className="text-xl text-purple-100 leading-relaxed">
              {locale === 'zh' 
                ? '加入SuperAnalyst，体验AI驱动的专业股票研究。获取深度分析报告，做出明智的投资决策。'
                : 'Join SuperAnalyst and experience AI-powered professional equity research. Get in-depth analysis reports and make informed investment decisions.'
              }
            </p>
          </div>
        </div>

        {/* Right Section - Signup Form */}
        <div className="w-full lg:w-2/3 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <SuperAnalystLogo size="lg" showSubtitle={true} className="justify-center" />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'zh' ? '名字' : 'First Name'}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border-b-2 border-gray-300 focus:border-purple-500 focus:outline-none transition-colors ${
                    errors.firstName ? 'border-red-500' : ''
                  }`}
                  placeholder={locale === 'zh' ? '请输入名字' : 'Enter your first name'}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'zh' ? '姓氏' : 'Last Name'}
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border-b-2 border-gray-300 focus:border-purple-500 focus:outline-none transition-colors ${
                    errors.lastName ? 'border-red-500' : ''
                  }`}
                  placeholder={locale === 'zh' ? '请输入姓氏' : 'Enter your last name'}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'zh' ? '邮箱地址' : 'E-mail Address'}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border-b-2 border-gray-300 focus:border-purple-500 focus:outline-none transition-colors ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  placeholder={locale === 'zh' ? '请输入邮箱地址' : 'Enter your email address'}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-600">
                  {locale === 'zh' 
                    ? '我同意条款和条件' 
                    : 'I agree with the terms and conditions'
                  }
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="text-red-500 text-sm">{errors.agreeTerms}</p>
              )}

              {/* Sign Up Button */}
              <button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors"
              >
                {locale === 'zh' ? '免费获取报告' : 'Sign up for free report'}
              </button>

              {/* Alternative Contact */}
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  {locale === 'zh' ? '或致电我们' : 'or call us'}
                </p>
                <a href="tel:+11123456890" className="text-green-600 hover:text-green-700 font-semibold">
                  +11 123 456 890
                </a>
              </div>

              {/* Social Media Links */}
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  {locale === 'zh' ? '关注我们' : 'Follow us'}
                </p>
                <div className="flex justify-center space-x-6">
                  <a 
                    href="https://www.linkedin.com/company/superanalystpro/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                    title="LinkedIn"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://x.com/superanalyst" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                    title="X (Twitter)"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://discord.gg/mdnT7VWr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 transition-colors"
                    title="Discord"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  {locale === 'zh' ? '已有账户？' : 'I already have an account?'}
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="text-green-600 hover:text-green-700 font-semibold ml-1"
                  >
                    {locale === 'zh' ? '登录' : 'Log in'}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
