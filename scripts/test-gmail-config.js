#!/usr/bin/env node

const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testGmailConfig() {
  console.log('🧪 测试Gmail配置...\n');
  
  // 检查环境变量
  console.log('📋 环境变量检查:');
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? '✅ 已设置' : '❌ 未设置'}`);
  console.log(`EMAIL_APP_PASSWORD: ${process.env.EMAIL_APP_PASSWORD ? '✅ 已设置' : '❌ 未设置'}`);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.log('\n❌ 环境变量未正确设置');
    console.log('请确保 .env.local 文件包含:');
    console.log('EMAIL_USER=your_gmail_address@gmail.com');
    console.log('EMAIL_APP_PASSWORD=your_16_digit_app_password');
    return;
  }
  
  // 检查应用密码格式
  const appPassword = process.env.EMAIL_APP_PASSWORD;
  console.log(`\n🔍 应用密码格式检查:`);
  console.log(`长度: ${appPassword.length} 字符`);
  console.log(`格式: ${appPassword}`);
  
  if (appPassword.length !== 16) {
    console.log('❌ 应用密码长度不正确，应该是16位字符');
    console.log('请重新生成Gmail应用密码');
    return;
  }
  
  if (!/^[a-zA-Z0-9]+$/.test(appPassword)) {
    console.log('❌ 应用密码包含无效字符，应该只包含字母和数字');
    console.log('请重新生成Gmail应用密码');
    return;
  }
  
  console.log('✅ 应用密码格式正确');
  
  // 创建传输器
  console.log('\n📧 创建邮件传输器...');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  
  // 验证配置
  console.log('🔐 验证Gmail配置...');
  try {
    await transporter.verify();
    console.log('✅ Gmail配置验证成功！');
    
    // 发送测试邮件
    console.log('\n📤 发送测试邮件...');
    const testEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // 发送给自己
      subject: 'SuperAnalyst邮件服务测试',
      html: `
        <h2>🎉 Gmail配置测试成功！</h2>
        <p>如果您收到这封邮件，说明Gmail应用密码配置正确。</p>
        <p>时间: ${new Date().toLocaleString()}</p>
      `
    };
    
    const info = await transporter.sendMail(testEmail);
    console.log('✅ 测试邮件发送成功！');
    console.log(`邮件ID: ${info.messageId}`);
    console.log('请检查您的邮箱收件箱');
    
  } catch (error) {
    console.log('❌ Gmail配置验证失败:');
    console.log(`错误: ${error.message}`);
    
    if (error.message.includes('Application-specific password required')) {
      console.log('\n💡 解决方案:');
      console.log('1. 确保使用Gmail应用密码，不是Gmail登录密码');
      console.log('2. 访问 https://myaccount.google.com/apppasswords');
      console.log('3. 生成新的16位应用密码');
      console.log('4. 确保两步验证已启用');
    } else if (error.message.includes('Username and Password not accepted')) {
      console.log('\n💡 解决方案:');
      console.log('1. 检查Gmail地址是否正确');
      console.log('2. 检查应用密码是否正确复制');
      console.log('3. 确保没有多余的空格或字符');
    }
  }
}

// 运行测试
testGmailConfig().catch(console.error);
