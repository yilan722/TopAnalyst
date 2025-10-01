#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 切换到注册页面
const signupFile = path.join(__dirname, '../app/[locale]/signup.tsx');
const currentFile = path.join(__dirname, '../app/[locale]/page.tsx');

if (fs.existsSync(signupFile)) {
  const signupContent = fs.readFileSync(signupFile, 'utf8');
  fs.writeFileSync(currentFile, signupContent);
  console.log('✅ 已切换到注册页面');
} else {
  console.log('❌ 未找到注册页面文件:', signupFile);
}

console.log('\n🔄 要恢复原始主页，请运行:');
console.log('node scripts/restore-original-homepage.js');
