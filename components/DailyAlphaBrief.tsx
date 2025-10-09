'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, ExternalLink, FileText, Lock, Eye, Share2 } from 'lucide-react'
import { type Locale } from '../app/services/i18n'
import { getTranslation } from '../app/services/translations'
import toast from 'react-hot-toast'
import LinkedInShareTool from './LinkedInShareTool'
import PaginatedHistoricalReports from './PaginatedHistoricalReports'
import ReportDetailModal from './ReportDetailModal'
import ShareTool from './ShareTool'

// 翻译函数
const translateContent = async (text: string, targetLang: string): Promise<string> => {
  if (targetLang === 'zh') return text // 如果是中文，直接返回
  
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        targetLang: targetLang
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.translatedText || text
    }
  } catch (error) {
    console.error('Translation error:', error)
  }
  
  return text // 如果翻译失败，返回原文
}

interface HotStock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  peRatio: number
  sector: string
  reason: string
  confidence: 'high' | 'medium' | 'low'
  rank?: number
  high52Week?: number
  low52Week?: number
  isIndex?: boolean
}

interface TodaysReport {
  id: string
  title: string
  company: string
  symbol: string
  date: string
  summary: string
  pdfPath: string
  isPublic: boolean
  isPublicVersion?: boolean
  message?: string
  translations?: {
    en?: {
      title: string
      company: string
      summary: string
    }
  }
  fullContent?: {
    parsedContent?: {
      sections?: any
      charts?: any
      tables?: any
    }
  }
}

interface HistoricalReport {
  id: string
  title: string
  company: string
  symbol: string
  date: string
  summary: string
  pdfPath: string
  isPublic: boolean
  isPublicVersion?: boolean
  message?: string
  translations?: {
    en?: {
      title: string
      company: string
      summary: string
    }
  }
}

interface DailyAlphaBriefProps {
  locale: Locale
  user: any
}

export default function DailyAlphaBrief({ locale, user }: DailyAlphaBriefProps) {
  const [hotStocks, setHotStocks] = useState<HotStock[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStock, setSelectedStock] = useState<HotStock | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [todaysReport, setTodaysReport] = useState<TodaysReport | null>(null)
  const [historicalReports, setHistoricalReports] = useState<HistoricalReport[]>([])
  const [isLoadingReport, setIsLoadingReport] = useState(false)
  const [isLoadingHistorical, setIsLoadingHistorical] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showShareTool, setShowShareTool] = useState(false)
  const [showHistoricalReports, setShowHistoricalReports] = useState(true) // 默认展开
  const [selectedHistoricalReport, setSelectedHistoricalReport] = useState<HistoricalReport | null>(null)
  const [showHistoricalReportModal, setShowHistoricalReportModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<HistoricalReport | null>(null)
  const [showReportDetail, setShowReportDetail] = useState(false)
  const [translatedTodaysReport, setTranslatedTodaysReport] = useState<TodaysReport | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)

  // 模拟热门股票数据
  const mockHotStocks: HotStock[] = [
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      price: 875.28,
      change: 45.32,
      changePercent: 5.47,
      volume: 125000000,
      marketCap: 2150000000000,
      peRatio: 65.4,
      sector: 'Technology',
      reason: 'Strong Q4 earnings beat with AI chip demand surge',
      confidence: 'high'
    },
    {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      price: 248.50,
      change: -12.30,
      changePercent: -4.72,
      volume: 89000000,
      marketCap: 790000000000,
      peRatio: 45.2,
      sector: 'Automotive',
      reason: 'Production concerns and delivery miss expectations',
      confidence: 'medium'
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 192.53,
      change: 3.25,
      changePercent: 1.72,
      volume: 45000000,
      marketCap: 3000000000000,
      peRatio: 28.9,
      sector: 'Technology',
      reason: 'iPhone 15 Pro sales exceed expectations in China',
      confidence: 'high'
    },
    {
      symbol: 'AMD',
      name: 'Advanced Micro Devices',
      price: 142.67,
      change: 8.45,
      changePercent: 6.30,
      volume: 67000000,
      marketCap: 230000000000,
      peRatio: 38.5,
      sector: 'Technology',
      reason: 'Data center revenue growth and AI processor demand',
      confidence: 'high'
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 415.26,
      change: 12.84,
      changePercent: 3.19,
      volume: 32000000,
      marketCap: 3100000000000,
      peRatio: 32.1,
      sector: 'Technology',
      reason: 'Azure cloud growth and AI integration progress',
      confidence: 'medium'
    }
  ]

  // 获取真实股票数据
  const fetchHotStocks = async () => {
    setIsLoading(true)
    try {
      console.log('🚀 开始获取热门股票数据...')
      
      const response = await fetch(`/api/hot-stocks?useStockTwits=true&t=${Date.now()}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📊 Hot stocks API 响应:', data)
      
      if (data.success && data.data && data.data.length > 0) {
        setHotStocks(data.data)
        console.log(`✅ 成功获取 ${data.data.length} 只热门股票数据，数据源: ${data.source}`)
        console.log('股票符号:', data.data.map((s: HotStock) => s.symbol))
      } else {
        // 如果API失败，使用模拟数据
        console.log('❌ API 调用失败，使用模拟数据')
        setHotStocks(mockHotStocks)
        toast.error(locale === 'zh' ? '无法获取实时数据，显示模拟数据' : 'Unable to fetch real-time data, showing mock data')
      }
    } catch (error) {
      console.error('Error fetching hot stocks:', error)
      setHotStocks(mockHotStocks)
      toast.error(locale === 'zh' ? '数据获取失败，显示模拟数据' : 'Failed to fetch data, showing mock data')
    } finally {
      setIsLoading(false)
    }
  }

  // 获取今日报告
  const fetchTodaysReport = async () => {
    setIsLoadingReport(true)
    // 清除翻译状态，强制使用最新数据
    setTranslatedTodaysReport(null)
    try {
      const response = await fetch('/api/todays-report')
      const data = await response.json()
      
      if (data.success) {
        setTodaysReport(data.data)
        // 如果是英文版本，使用英文翻译
        if (locale === 'en' && data.data.translations?.en) {
          setTranslatedTodaysReport({
            ...data.data,
            ...data.data.translations.en
          })
        } else {
          setTranslatedTodaysReport(data.data)
        }
        console.log('✅ 成功获取今日报告:', data.data.title)
        console.log('📊 报告公司:', data.data.company, '符号:', data.data.symbol)
      }
    } catch (error) {
      console.error('Error fetching today\'s report:', error)
    } finally {
      setIsLoadingReport(false)
    }
  }

  // 翻译今日报告
  const translateTodaysReport = async (report: TodaysReport) => {
    setIsTranslating(true)
    try {
      const translatedTitle = await translateContent(report.title, 'en')
      const translatedCompany = await translateContent(report.company, 'en')
      const translatedSummary = await translateContent(report.summary, 'en')
      
      setTranslatedTodaysReport({
        ...report,
        title: translatedTitle,
        company: translatedCompany,
        summary: translatedSummary
      })
    } catch (error) {
      console.error('Translation error:', error)
      setTranslatedTodaysReport(report) // 如果翻译失败，使用原文
    } finally {
      setIsTranslating(false)
    }
  }

  // 获取历史报告
  const fetchHistoricalReports = async () => {
    setIsLoadingHistorical(true)
    try {
      console.log('🔍 开始获取历史报告...')
      const response = await fetch('/api/historical-reports')
      const data = await response.json()
      
      console.log('📊 历史报告API响应:', data)
      
      if (data.success) {
        setHistoricalReports(data.data)
        console.log('✅ 历史报告设置成功:', data.data)
      } else {
        console.error('❌ 获取历史报告失败:', data.error)
      }
    } catch (error) {
      console.error('❌ 获取历史报告错误:', error)
    } finally {
      setIsLoadingHistorical(false)
    }
  }

  useEffect(() => {
    fetchHotStocks()
    fetchTodaysReport()
    fetchHistoricalReports()
  }, [])

  // 备用初始化机制 - 如果5秒后还在加载，强制显示内容
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (isLoading && hotStocks.length === 0) {
        console.log('⚠️ 备用机制触发：强制显示模拟数据')
        setHotStocks(mockHotStocks)
        setIsLoading(false)
      }
    }, 5000)

    return () => clearTimeout(fallbackTimer)
  }, [isLoading, hotStocks.length])

  // 调试历史报告状态
  useEffect(() => {
    console.log('Historical reports updated:', historicalReports, 'Length:', historicalReports.length)
    console.log('Historical reports IDs:', historicalReports.map(r => r.id))
  }, [historicalReports])

  const handleStockClick = (stock: HotStock) => {
    // 直接跳转到报告生成页面
    window.location.href = `/?symbol=${stock.symbol}`
  }

  const handleTodaysReportClick = () => {
    if (todaysReport) {
      setShowReportModal(true)
    }
  }

  const handleHistoricalReportClick = (report: HistoricalReport) => {
    setSelectedHistoricalReport(report)
    setShowHistoricalReportModal(true)
  }

  const handleReportClick = (report: HistoricalReport) => {
    setSelectedReport(report)
    setShowReportDetail(true)
  }



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {getTranslation(locale, 'dailyAlphaBrief')}
            </h1>
            <p className="text-slate-300">
              {getTranslation(locale, 'dailyAlphaSubtitle')}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>{hotStocks.length} {getTranslation(locale, 'hotStocks')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500">
                {locale === 'zh' ? '实时数据' : 'Real-time Data'}
              </span>
            </div>
          </div>
          <button
            onClick={fetchHotStocks}
            disabled={isLoading}
            className="flex items-center space-x-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrendingUp className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? (locale === 'zh' ? '刷新中...' : 'Refreshing...') : (locale === 'zh' ? '刷新' : 'Refresh')}</span>
          </button>
        </div>
      </div>

      {/* Hot Stocks Table - StockTwits Style */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Last Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  %Change
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Volume
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  52-wk High
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  52-wk Low
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Market Cap
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {hotStocks.map((stock) => (
                <tr
                  key={stock.symbol}
                  className="hover:bg-slate-750 transition-colors duration-200"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                    {stock.rank || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {stock.symbol}
                      </div>
                      <div className="text-xs text-slate-400">
                        {stock.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                    ${stock.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center justify-end">
                      {stock.changePercent >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                      )}
                      <span className={stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                    {stock.volume > 1000000 
                      ? `${(stock.volume / 1000000).toFixed(1)}M`
                      : stock.volume > 1000 
                        ? `${(stock.volume / 1000).toFixed(1)}K`
                        : stock.volume.toLocaleString()
                    }
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                    {stock.high52Week ? `$${stock.high52Week.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                    {stock.low52Week ? `$${stock.low52Week.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                    {stock.marketCap > 1000000000 
                      ? `$${(stock.marketCap / 1000000000).toFixed(1)}B`
                      : stock.marketCap > 1000000 
                        ? `$${(stock.marketCap / 1000000).toFixed(1)}M`
                        : stock.marketCap > 0 
                          ? `$${stock.marketCap.toLocaleString()}`
                          : '-'
                    }
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleStockClick(stock)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                    >
                      {locale === 'zh' ? '分析' : 'Analyze'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Today's Must-Read Report */}
      {(translatedTodaysReport || todaysReport) && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {locale === 'zh' ? '今日必读报告' : 'Today\'s Must-Read'}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {locale === 'zh' ? '每日一篇，解锁市场' : 'One report. Every day. Unlock the market'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowShareTool(!showShareTool)}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {locale === 'zh' ? '分享' : 'Share'}
                </span>
              </button>
              {!user && (
                <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {locale === 'zh' ? '注册查看完整版' : 'Register for full access'}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <a 
            href={`/en/reports/${(translatedTodaysReport || todaysReport)?.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {(translatedTodaysReport || todaysReport)?.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {(translatedTodaysReport || todaysReport)?.company} ({(translatedTodaysReport || todaysReport)?.symbol})
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
              </div>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {(translatedTodaysReport || todaysReport)?.summary}
              {isTranslating && (
                <span className="text-xs text-amber-600 ml-2">
                  {locale === 'zh' ? '翻译中...' : 'Translating...'}
                </span>
              )}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date((translatedTodaysReport || todaysReport)?.date || '').toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText className="w-3 h-3" />
                  <span>PDF Report</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!user && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // 这里可以添加注册/登录逻辑
                      toast.success(locale === 'zh' ? '请注册以查看完整报告' : 'Please register to view full report')
                    }}
                    className="px-3 py-1 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors text-sm font-medium"
                  >
                    {locale === 'zh' ? '注册查看' : 'Register'}
                  </button>
                )}
              </div>
            </div>
          </a>
        </div>
      )}

      {/* Historical Reports */}
      
      {historicalReports.length > 0 && (
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-gray-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {locale === 'zh' ? '历史研究报告' : 'Historical Research Reports'}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {locale === 'zh' ? '按时间顺序排列的过往报告' : 'Past reports in chronological order'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowHistoricalReports(!showHistoricalReports)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
            >
              {showHistoricalReports 
                ? (locale === 'zh' ? '收起' : 'Collapse') 
                : (locale === 'zh' ? '展开' : 'Expand')
              }
            </button>
          </div>
          
          {showHistoricalReports && (
            <PaginatedHistoricalReports
              reports={historicalReports}
              locale={locale}
              onReportClick={handleReportClick}
            />
          )}
        </div>
      )}

      {/* Share Tool Modal */}
      {showShareTool && (translatedTodaysReport || todaysReport) && (
        <ShareTool
          reportId={(translatedTodaysReport || todaysReport)?.id || ''}
          reportTitle={(translatedTodaysReport || todaysReport)?.title || ''}
          company={(translatedTodaysReport || todaysReport)?.company || ''}
          symbol={(translatedTodaysReport || todaysReport)?.symbol || ''}
          locale={locale}
          onClose={() => setShowShareTool(false)}
        />
      )}

      {/* Analysis Modal */}
      {showAnalysis && selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedStock.symbol} - {selectedStock.name}
                  </h2>
                  <p className="text-slate-400">{selectedStock.sector}</p>
                </div>
                <button
                  onClick={() => setShowAnalysis(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-400">Price</p>
                  <p className="text-2xl font-bold text-white">${selectedStock.price}</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-400">Change</p>
                  <p className={`text-2xl font-bold ${
                    selectedStock.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
                  </p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-400">Market Cap</p>
                  <p className="text-2xl font-bold text-white">${(selectedStock.marketCap / 1e9).toFixed(1)}B</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-400">P/E Ratio</p>
                  <p className="text-2xl font-bold text-white">{Number(selectedStock.peRatio).toFixed(2)}</p>
                </div>
              </div>

              {/* Analysis */}
              <div className="bg-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  {getTranslation(locale, 'analysis')}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {selectedStock.reason}
                </p>
                <div className="mt-4 flex items-center justify-end">
                  <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>{getTranslation(locale, 'generateFullReport')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Report Modal */}
      {showReportModal && (translatedTodaysReport || todaysReport) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {(translatedTodaysReport || todaysReport)?.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {(translatedTodaysReport || todaysReport)?.company} ({(translatedTodaysReport || todaysReport)?.symbol}) • {new Date((translatedTodaysReport || todaysReport)?.date || '').toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}
                  </p>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Report Summary */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  {locale === 'zh' ? '报告摘要' : 'Report Summary'}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {locale === 'zh' 
                    ? (translatedTodaysReport || todaysReport)?.summary || ''
                    : (translatedTodaysReport || todaysReport)?.translations?.en?.summary || (translatedTodaysReport || todaysReport)?.summary || ''
                  }
                </p>
              </div>

              {/* Full Report Content */}
              {(translatedTodaysReport || todaysReport)?.fullContent?.parsedContent?.sections && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {locale === 'zh' ? '完整报告内容' : 'Full Report Content'}
                  </h3>
                  
                  {/* Report Sections - 根据语言显示内容 */}
                  {Object.entries((translatedTodaysReport || todaysReport)?.fullContent?.parsedContent?.sections || {}).map(([sectionTitle, sectionContent]) => (
                    <div key={sectionTitle} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        {sectionTitle}
                      </h4>
                      <div className="prose prose-slate dark:prose-invert max-w-none">
                        <div className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
                          {String(sectionContent || '')}
                        </div>
                      </div>
                    </div>
                  ))}


                  {/* Tables Section */}
                  {(translatedTodaysReport || todaysReport)?.fullContent?.parsedContent?.tables && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {locale === 'zh' ? '数据表格' : 'Data Tables'}
                      </h3>
                      {(translatedTodaysReport || todaysReport)?.fullContent?.parsedContent?.tables.map((table: any, index: number) => (
                        <div key={index} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            {table.title}
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-slate-50 dark:bg-slate-700">
                                  {table.data[0].map((header: string, headerIndex: number) => (
                                    <th key={headerIndex} className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-left text-sm font-medium text-slate-900 dark:text-white">
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {table.data.slice(1).map((row: string[], rowIndex: number) => (
                                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-700'}>
                                    {row.map((cell: string, cellIndex: number) => (
                                      <td key={cellIndex} className="border border-slate-200 dark:border-slate-600 px-4 py-2 text-sm text-slate-700 dark:text-slate-300">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Access Control */}
              {!user && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                        {locale === 'zh' ? '注册查看完整报告' : 'Register to View Full Report'}
                      </h4>
                      <p className="text-amber-700 dark:text-amber-300 mb-4">
                        {locale === 'zh' 
                          ? '完整报告包含详细的估值分析、投资建议和风险提示。注册后即可查看完整内容。'
                          : 'Full report includes detailed valuation analysis, investment recommendations, and risk assessments. Register to access complete content.'
                        }
                      </p>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => {
                            // 这里可以添加注册逻辑
                            toast.success(locale === 'zh' ? '请注册以查看完整报告' : 'Please register to view full report')
                          }}
                          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                        >
                          {locale === 'zh' ? '立即注册' : 'Register Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Access for Registered Users */}
              {user && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {locale === 'zh' ? '完整报告' : 'Full Report'}
                    </h3>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">
                        {locale === 'zh' ? '您已注册，可以查看完整报告内容' : 'You are registered and can view the full report content'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Historical Report Modal - 使用ReportDetailModal组件 */}
      <ReportDetailModal
        report={selectedHistoricalReport}
        isOpen={showHistoricalReportModal}
        onClose={() => setShowHistoricalReportModal(false)}
        locale={locale}
      />

      {/* Report Detail Modal */}
      <ReportDetailModal
        report={selectedReport}
        isOpen={showReportDetail}
        onClose={() => setShowReportDetail(false)}
        locale={locale}
      />
    </div>
  )
}
