const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

async function extractPDFDate(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    
    console.log('PDF Info:');
    console.log('Title:', data.info?.Title || 'N/A');
    console.log('Author:', data.info?.Author || 'N/A');
    console.log('Subject:', data.info?.Subject || 'N/A');
    console.log('Creator:', data.info?.Creator || 'N/A');
    console.log('Producer:', data.info?.Producer || 'N/A');
    console.log('Creation Date:', data.info?.CreationDate || 'N/A');
    console.log('Mod Date:', data.info?.ModDate || 'N/A');
    console.log('Pages:', data.numpages);
    
    // 尝试从内容中提取日期
    const content = data.text;
    const datePatterns = [
      /(\d{1,2}\/\d{1,2}\/\d{4})/g,
      /(\d{4}-\d{2}-\d{2})/g,
      /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/gi,
      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}/gi
    ];
    
    console.log('\nFound dates in content:');
    datePatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        console.log(`Pattern ${index + 1}:`, matches.slice(0, 5)); // 只显示前5个匹配
      }
    });
    
    // 查找报告生成日期
    const reportDatePatterns = [
      /report\s+date[:\s]+(\d{1,2}\/\d{1,2}\/\d{4})/gi,
      /analysis\s+date[:\s]+(\d{1,2}\/\d{1,2}\/\d{4})/gi,
      /as\s+of[:\s]+(\d{1,2}\/\d{1,2}\/\d{4})/gi,
      /dated[:\s]+(\d{1,2}\/\d{1,2}\/\d{4})/gi
    ];
    
    console.log('\nReport-specific dates:');
    reportDatePatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        console.log(`Report pattern ${index + 1}:`, matches.slice(0, 3));
      }
    });
    
  } catch (error) {
    console.error('Error reading PDF:', error);
  }
}

// 使用当前日期作为默认值
const pdfPath = process.argv[2] || '/Users/yilanliu/Desktop/superanalyst/Posted report/Advanced Micro Devices, Inc. (AMD) - In-Depth Company Profile.pdf';
extractPDFDate(pdfPath);
