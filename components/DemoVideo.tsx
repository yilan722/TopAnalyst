'use client'

import React from 'react'

interface DemoVideoProps {
  locale: 'en' | 'zh'
}

export default function DemoVideo({ locale }: DemoVideoProps) {

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
          {locale === 'zh' 
            ? '观看SuperAnalyst如何加速您的研究流程' 
            : 'Discover How SuperAnalyst Accelerates Your Research Processes'
          }
        </p>
      </div>

      {/* Video Container */}
      <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
        <video
          className="w-full h-auto"
          controls
          preload="auto"
        >
          <source src={`/${locale}/demo-video.mp4`} type="video/mp4" />
          {locale === 'zh' ? '您的浏览器不支持视频播放' : 'Your browser does not support video playback'}
        </video>
      </div>

    </div>
  )
}
