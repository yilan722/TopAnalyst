const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

async function getPDFCreationDate(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    
    // 从PDF元数据获取创建日期
    const creationDate = data.info?.CreationDate;
    if (creationDate) {
      // 解析PDF日期格式 D:20251007032035+00'00'
      const match = creationDate.match(/D:(\d{4})(\d{2})(\d{2})/);
      if (match) {
        const year = match[1];
        const month = match[2];
        const day = match[3];
        return `${year}-${month}-${day}`;
      }
    }
    
    // 如果无法从元数据获取，使用文件修改时间
    const stats = fs.statSync(pdfPath);
    const date = new Date(stats.mtime);
    return date.toISOString().split('T')[0];
    
  } catch (error) {
    console.error(`Error reading ${pdfPath}:`, error.message);
    return null;
  }
}

async function getAllPDFDates() {
  const referenceReportsDir = '/Users/yilanliu/Superanalyst0926/TopAnalyst/reference-reports';
  const files = fs.readdirSync(referenceReportsDir);
  const pdfFiles = files.filter(file => file.endsWith('.pdf'));
  
  const pdfDates = {};
  
  for (const pdfFile of pdfFiles) {
    const pdfPath = path.join(referenceReportsDir, pdfFile);
    const date = await getPDFCreationDate(pdfPath);
    if (date) {
      pdfDates[pdfFile] = date;
      console.log(`${pdfFile}: ${date}`);
    }
  }
  
  return pdfDates;
}

getAllPDFDates().then(dates => {
  console.log('\n所有PDF文件日期:');
  console.log(JSON.stringify(dates, null, 2));
});
