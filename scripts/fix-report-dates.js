const fs = require('fs');
const path = require('path');

// 读取历史报告数据
const historicalReportsPath = '/Users/yilanliu/Superanalyst0926/TopAnalyst/data/historical-reports.json';
const todaysReportPath = '/Users/yilanliu/Superanalyst0926/TopAnalyst/data/todays-report.json';

function fixReportDates() {
  try {
    // 读取历史报告
    const historicalData = JSON.parse(fs.readFileSync(historicalReportsPath, 'utf8'));
    
    // 更新AMD报告的日期为实际PDF创建日期
    const updatedHistorical = historicalData.map(report => {
      if (report.symbol === 'AMD' && report.company === 'Advanced Micro Devices, Inc.') {
        return {
          ...report,
          date: '2025-10-07', // 使用PDF的实际创建日期
          id: 'advanced-micro-devices--inc--2025-10-07' // 更新ID以匹配新日期
        };
      }
      return report;
    });
    
    // 保存更新后的历史报告
    fs.writeFileSync(historicalReportsPath, JSON.stringify(updatedHistorical, null, 2));
    console.log('✅ 历史报告日期已更新');
    
    // 读取今日报告
    if (fs.existsSync(todaysReportPath)) {
      const todaysData = JSON.parse(fs.readFileSync(todaysReportPath, 'utf8'));
      
      // 更新今日报告的日期
      const updatedTodays = {
        ...todaysData,
        date: '2025-10-07',
        id: 'advanced-micro-devices--inc--2025-10-07'
      };
      
      // 保存更新后的今日报告
      fs.writeFileSync(todaysReportPath, JSON.stringify(updatedTodays, null, 2));
      console.log('✅ 今日报告日期已更新');
    }
    
    console.log('🎉 所有报告日期已修复为实际PDF创建日期: 2025-10-07');
    
  } catch (error) {
    console.error('❌ 修复日期时出错:', error);
  }
}

fixReportDates();
