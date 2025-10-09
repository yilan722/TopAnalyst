const fs = require('fs');
const path = require('path');

// PDF文件的实际创建日期映射
const pdfDates = {
  "Advanced Micro Devices, Inc. (AMD) - In-Depth Company Profile.pdf": "2025-10-07",
  "Bakkt Holdings, Inc. (BKKT) - In-Depth Company Profile.pdf": "2025-10-02",
  "Circle Internet Group (CRCL) - In-Depth Company Profile.pdf": "2025-09-27",
  "Coinbase Global, Inc. (COIN) - In-Depth Company Profile.pdf": "2025-10-04",
  "CoreWeave, Inc. (CRWV) - In-Depth Company Profile.pdf": "2025-09-10",
  "IREN Limited (IREN) - In-Depth Company Profile.pdf": "2025-09-26",
  "Pfizer Inc. (PFE) - In-Depth Company Profile.pdf": "2025-10-02",
  "Tesla, Inc. (TSLA) - In-Depth Company Profile.pdf": "2025-09-15",
  "优必选 (09880.HK) (09880) - In-Depth Company Profile.pdf": "2025-09-17"
};

function updateAllReportDates() {
  try {
    // 读取历史报告
    const historicalReportsPath = '/Users/yilanliu/Superanalyst0926/TopAnalyst/data/historical-reports.json';
    const historicalData = JSON.parse(fs.readFileSync(historicalReportsPath, 'utf8'));
    
    // 更新每个报告的日期
    const updatedHistorical = historicalData.map(report => {
      const pdfFileName = report.pdfPath;
      const actualDate = pdfDates[pdfFileName];
      
      if (actualDate) {
        const oldId = report.id;
        const newId = oldId.replace(/\d{4}-\d{2}-\d{2}/, actualDate);
        
        console.log(`更新 ${report.company} (${report.symbol}): ${report.date} -> ${actualDate}`);
        
        return {
          ...report,
          date: actualDate,
          id: newId
        };
      }
      
      return report;
    });
    
    // 保存更新后的历史报告
    fs.writeFileSync(historicalReportsPath, JSON.stringify(updatedHistorical, null, 2));
    console.log('\n✅ 所有历史报告日期已更新');
    
    // 如果今日报告是AMD，也更新它
    const todaysReportPath = '/Users/yilanliu/Superanalyst0926/TopAnalyst/data/todays-report.json';
    if (fs.existsSync(todaysReportPath)) {
      const todaysData = JSON.parse(fs.readFileSync(todaysReportPath, 'utf8'));
      
      if (todaysData.pdfPath && pdfDates[todaysData.pdfPath]) {
        const actualDate = pdfDates[todaysData.pdfPath];
        const oldId = todaysData.id;
        const newId = oldId.replace(/\d{4}-\d{2}-\d{2}/, actualDate);
        
        const updatedTodays = {
          ...todaysData,
          date: actualDate,
          id: newId
        };
        
        fs.writeFileSync(todaysReportPath, JSON.stringify(updatedTodays, null, 2));
        console.log(`✅ 今日报告日期已更新: ${actualDate}`);
      }
    }
    
    console.log('\n🎉 所有报告日期已修复为PDF实际创建日期');
    
  } catch (error) {
    console.error('❌ 更新日期时出错:', error);
  }
}

updateAllReportDates();
