'use client'

import React, { useState } from 'react'
import { Share2, Linkedin, Twitter, Facebook, Copy, Check, MessageCircle, Smartphone, Mail, X, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

interface ReportShareButtonsProps {
  report: {
    id: string
    title: string
    company: string
    symbol: string
    summary: string
  }
  locale: 'en' | 'zh'
  onClose?: () => void
}

export default function ReportShareButtons({ report, locale, onClose }: ReportShareButtonsProps) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [activeTab, setActiveTab] = useState<'linkedin' | 'reddit' | 'twitter' | 'facebook' | 'email' | 'whatsapp' | 'telegram' | 'discord'>('linkedin')

  // 生成SEO优化的URL
  const generateReportUrl = (reportId: string) => {
    // 使用公开的URL而不是localhost
    const baseUrl = window.location.hostname === 'localhost' 
      ? 'https://superanalyst.pro' 
      : window.location.origin
    return `${baseUrl}/en/reports/${reportId}`
  }

  // 生成分享URL
  const reportUrl = generateReportUrl(report.id)

  // 分享模板
  const shareTemplates = {
    linkedin: {
      en: `🚀 Exciting market insights! Just discovered this comprehensive analysis of ${report.company} (${report.symbol}) on SuperAnalyst Pro.

The report covers everything from fundamental analysis to growth catalysts and valuation insights. What caught my attention is how the AI-powered platform provides institutional-grade research that's typically only available to professional investors.

Key highlights:
✅ Real-time market data integration
✅ AI-driven fundamental analysis  
✅ Professional valuation modeling (DCF, comparable analysis)
✅ Risk assessment and mitigation strategies
✅ Complete financial metrics and ratios
✅ Growth catalyst identification

Perfect for investors looking for data-driven insights! 📊

${reportUrl}`,
      zh: `🚀 激动人心的市场洞察！刚刚在SuperAnalyst Pro上发现了这份关于${report.company} (${report.symbol})的综合分析报告。

这份报告涵盖了从基本面分析到增长催化剂和估值洞察的所有内容。让我印象深刻的是这个AI驱动的平台如何提供机构级的研究，这些研究通常只对专业投资者开放。

关键亮点：
✅ 实时市场数据集成
✅ AI驱动的基本面分析
✅ 专业估值建模（DCF、可比分析）
✅ 风险评估和缓解策略
✅ 完整的财务指标和比率
✅ 增长催化剂识别

非常适合寻求数据驱动洞察的投资者！📊

${reportUrl}`
    },
    twitter: {
      en: `📈 Just found this comprehensive analysis of ${report.company} (${report.symbol}) on @SuperAnalystPro! 

The AI-powered platform provides institutional-grade research with real-time data integration and professional valuation modeling. Perfect for data-driven investors! 

${reportUrl}`,
      zh: `📈 刚刚在@SuperAnalystPro上发现了这份关于${report.company} (${report.symbol})的综合分析！

这个AI驱动的平台提供机构级研究，具有实时数据集成和专业估值建模。非常适合数据驱动的投资者！

${reportUrl}`
    },
    facebook: {
      en: `Check out this comprehensive analysis of ${report.company} (${report.symbol}) on SuperAnalyst Pro! The AI-powered platform provides institutional-grade research that's typically only available to professional investors. Perfect for anyone looking for data-driven investment insights! ${reportUrl}`,
      zh: `查看SuperAnalyst Pro上这份关于${report.company} (${report.symbol})的综合分析！这个AI驱动的平台提供机构级研究，通常只对专业投资者开放。非常适合寻求数据驱动投资洞察的任何人！${reportUrl}`
    },
    reddit: {
      en: `**${report.company} (${report.symbol}) - Comprehensive Analysis Report**

I came across this detailed analysis on SuperAnalyst Pro and thought the r/investing community might find it interesting.

**What's included:**
- Fundamental analysis with real-time data
- Growth catalyst identification
- Professional valuation modeling (DCF, comparable analysis)
- Risk assessment and mitigation strategies
- Complete financial metrics and ratios

The platform uses AI to provide institutional-grade research that's typically only available to professional investors. Worth checking out for anyone interested in data-driven investment analysis.

${reportUrl}`,
      zh: `**${report.company} (${report.symbol}) - 综合分析报告**

我在SuperAnalyst Pro上发现了这份详细分析，认为r/investing社区可能会感兴趣。

**包含内容：**
- 实时数据的基本面分析
- 增长催化剂识别
- 专业估值建模（DCF、可比分析）
- 风险评估和缓解策略
- 完整的财务指标和比率

该平台使用AI提供机构级研究，通常只对专业投资者开放。对于任何对数据驱动投资分析感兴趣的人来说都值得一看。

${reportUrl}`
    },
    email: {
      en: `Subject: Comprehensive Analysis Report - ${report.company} (${report.symbol})

Hi,

I wanted to share this comprehensive analysis of ${report.company} (${report.symbol}) that I found on SuperAnalyst Pro. The report provides institutional-grade research with:

- Real-time market data integration
- AI-driven fundamental analysis
- Professional valuation modeling (DCF, comparable analysis)
- Risk assessment and mitigation strategies
- Complete financial metrics and ratios
- Growth catalyst identification

This AI-powered platform offers insights that are typically only available to professional investors. I thought you might find it valuable for your investment research.

You can view the full report here: ${reportUrl}

Best regards`,
      zh: `主题：综合分析报告 - ${report.company} (${report.symbol})

您好，

我想分享我在SuperAnalyst Pro上发现的这份关于${report.company} (${report.symbol})的综合分析。该报告提供机构级研究，包括：

- 实时市场数据集成
- AI驱动的基本面分析
- 专业估值建模（DCF、可比分析）
- 风险评估和缓解策略
- 完整的财务指标和比率
- 增长催化剂识别

这个AI驱动的平台提供通常只对专业投资者开放的洞察。我认为您可能会发现它对您的投资研究很有价值。

您可以在此处查看完整报告：${reportUrl}

此致敬礼`
    },
    whatsapp: {
      en: `📊 *${report.company} (${report.symbol}) Analysis Report*

Just found this comprehensive analysis on SuperAnalyst Pro! The AI-powered platform provides institutional-grade research with real-time data integration and professional valuation modeling.

Perfect for data-driven investors! Check it out: ${reportUrl}`,
      zh: `📊 *${report.company} (${report.symbol}) 分析报告*

刚刚在SuperAnalyst Pro上发现了这份综合分析！这个AI驱动的平台提供机构级研究，具有实时数据集成和专业估值建模。

非常适合数据驱动的投资者！查看：${reportUrl}`
    },
    telegram: {
      en: `📈 *${report.company} (${report.symbol}) - Comprehensive Analysis*

Found this detailed analysis on SuperAnalyst Pro! The AI-powered platform provides institutional-grade research that's typically only available to professional investors.

Key features:
• Real-time market data integration
• AI-driven fundamental analysis
• Professional valuation modeling
• Risk assessment strategies

Perfect for investors looking for data-driven insights! 

${reportUrl}`,
      zh: `📈 *${report.company} (${report.symbol}) - 综合分析*

在SuperAnalyst Pro上发现了这份详细分析！这个AI驱动的平台提供机构级研究，通常只对专业投资者开放。

主要功能：
• 实时市场数据集成
• AI驱动的基本面分析
• 专业估值建模
• 风险评估策略

非常适合寻求数据驱动洞察的投资者！

${reportUrl}`
    },
    discord: {
      en: `**${report.company} (${report.symbol}) Analysis Report** 📊

Just discovered this comprehensive analysis on SuperAnalyst Pro! The AI-powered platform provides institutional-grade research with real-time data integration and professional valuation modeling.

Perfect for investors looking for data-driven insights! 

${reportUrl}`,
      zh: `**${report.company} (${report.symbol}) 分析报告** 📊

刚刚在SuperAnalyst Pro上发现了这份综合分析！这个AI驱动的平台提供机构级研究，具有实时数据集成和专业估值建模。

非常适合寻求数据驱动洞察的投资者！

${reportUrl}`
    }
  }

  // 获取分享URL
  const getShareUrl = () => {
    const template = shareTemplates[activeTab][locale];
    
    switch (activeTab) {
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(reportUrl)}&summary=${encodeURIComponent(template)}`
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(template)}`
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(reportUrl)}&quote=${encodeURIComponent(template)}`
      case 'reddit':
        return `https://reddit.com/submit?url=${encodeURIComponent(reportUrl)}&title=${encodeURIComponent(template.split('\n')[0])}`
      case 'email':
        return `mailto:?subject=${encodeURIComponent(template.split('\n')[0])}&body=${encodeURIComponent(template)}`
      case 'whatsapp':
        return `https://wa.me/?text=${encodeURIComponent(template)}`
      case 'telegram':
        return `https://t.me/share/url?url=${encodeURIComponent(reportUrl)}&text=${encodeURIComponent(template)}`
      case 'discord':
        return `https://discord.com/channels/@me`
      default:
        return reportUrl
    }
  }

  const handleShare = () => {
    const url = getShareUrl()
    if (activeTab === 'email') {
      window.location.href = url
    } else if (activeTab === 'discord') {
      // Discord没有直接分享URL，复制到剪贴板
      const template = shareTemplates[activeTab][locale]
      navigator.clipboard.writeText(template)
      toast.success(locale === 'zh' ? '内容已复制到剪贴板' : 'Content copied to clipboard')
    } else {
      window.open(url, '_blank', 'width=600,height=400')
    }
  }

  const template = shareTemplates[activeTab][locale]

  // 如果onClose存在，说明是模态框模式
  if (onClose) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div 
          className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {locale === 'zh' ? '分享报告' : 'Share Report'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {locale === 'zh' ? '选择平台分享这份分析报告' : 'Choose a platform to share this analysis'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {showPreview ? (locale === 'zh' ? '隐藏预览' : 'Hide Preview') : (locale === 'zh' ? '预览' : 'Preview')}
                </span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Platform Tabs */}
          <div className="flex space-x-1 mb-6 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            {[
              { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
              { key: 'reddit', icon: MessageCircle, label: 'Reddit' },
              { key: 'twitter', icon: Twitter, label: 'Twitter' },
              { key: 'facebook', icon: Facebook, label: 'Facebook' },
              { key: 'whatsapp', icon: Smartphone, label: 'WhatsApp' },
              { key: 'telegram', icon: MessageCircle, label: 'Telegram' },
              { key: 'discord', icon: MessageCircle, label: 'Discord' },
              { key: 'email', icon: Mail, label: 'Email' }
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === key
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Content Preview */}
          {showPreview && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {locale === 'zh' ? '内容预览' : 'Content Preview'}
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">
                  {activeTab}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans">
                  {template}
                </pre>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(template)
                  setCopied(true)
                  toast.success(locale === 'zh' ? '文本已复制' : 'Text copied')
                  setTimeout(() => setCopied(false), 2000)
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm font-medium">
                  {locale === 'zh' ? '复制文本' : 'Copy Text'}
                </span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(reportUrl)
                  toast.success(locale === 'zh' ? '链接已复制' : 'Link copied')
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {locale === 'zh' ? '复制链接' : 'Copy Link'}
                </span>
              </button>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="font-medium">
                {locale === 'zh' ? '分享到' : 'Share to'} {activeTab === 'email' ? (locale === 'zh' ? '邮件' : 'Email') : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 原来的下拉菜单模式（保持向后兼容）
  return (
    <div className="relative">
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-medium">
          {locale === 'zh' ? '分享' : 'Share'}
        </span>
      </button>

      {showShareMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10">
          <div className="p-2">
            <button
              onClick={() => {
                const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(reportUrl)}&title=${encodeURIComponent(report.title)}&summary=${encodeURIComponent(shareTemplates.linkedin[locale])}`
                window.open(linkedinUrl, '_blank', 'width=600,height=400')
                setShowShareMenu(false)
              }}
              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </button>
            <button
              onClick={() => {
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTemplates.twitter[locale])}`
                window.open(twitterUrl, '_blank', 'width=600,height=400')
                setShowShareMenu(false)
              }}
              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
            >
              <Twitter className="w-4 h-4" />
              <span>Twitter</span>
            </button>
            <button
              onClick={() => {
                const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(reportUrl)}&quote=${encodeURIComponent(shareTemplates.facebook[locale])}`
                window.open(facebookUrl, '_blank', 'width=600,height=400')
                setShowShareMenu(false)
              }}
              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
            >
              <Facebook className="w-4 h-4" />
              <span>Facebook</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(reportUrl)
                toast.success(locale === 'zh' ? '链接已复制' : 'Link copied')
                setShowShareMenu(false)
              }}
              className="flex items-center space-x-2 w-full px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
            >
              <Copy className="w-4 h-4" />
              <span>{locale === 'zh' ? '复制链接' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}