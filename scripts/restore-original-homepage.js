#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 恢复原始主页
const backupFile = path.join(__dirname, '../app/[locale]/page.tsx.backup');
const currentFile = path.join(__dirname, '../app/[locale]/page.tsx');

if (fs.existsSync(backupFile)) {
  fs.copyFileSync(backupFile, currentFile);
  console.log('✅ 原始主页已恢复');
  console.log('📁 备份文件位置:', backupFile);
} else {
  console.log('❌ 未找到备份文件:', backupFile);
  console.log('请确保备份文件存在');
}

console.log('\n🔄 要切换回注册页面，请运行:');
console.log('node scripts/switch-to-signup.js');
