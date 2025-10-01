import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// 创建邮件传输器
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // 使用Gmail服务
    auth: {
      user: process.env.EMAIL_USER, // 发送邮件的Gmail地址
      pass: process.env.EMAIL_APP_PASSWORD, // Gmail应用密码
    },
  })
}

// 生成欢迎邮件HTML模板
const generateWelcomeEmailHTML = (firstName: string, lastName: string, locale: string) => {
  const isChinese = locale === 'zh'
  
  return `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isChinese ? '欢迎加入SuperAnalyst' : 'Welcome to SuperAnalyst'}</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #8B5CF6;
                margin-bottom: 10px;
            }
            .subtitle {
                color: #6B7280;
                font-size: 16px;
            }
            .content {
                margin-bottom: 30px;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #8B5CF6, #A855F7);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                text-align: center;
                margin: 20px 0;
            }
            .features {
                background: #F3F4F6;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .feature-item {
                margin: 10px 0;
                display: flex;
                align-items: center;
            }
            .feature-icon {
                width: 20px;
                height: 20px;
                background: #8B5CF6;
                border-radius: 50%;
                margin-right: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
            }
            .footer {
                text-align: center;
                color: #6B7280;
                font-size: 14px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #E5E7EB;
            }
            .social-links {
                margin: 20px 0;
            }
            .social-links a {
                color: #8B5CF6;
                text-decoration: none;
                margin: 0 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">SuperAnalyst</div>
                <div class="subtitle">${isChinese ? '专业股票研究平台' : 'Professional Equity Research Platform'}</div>
            </div>
            
            <div class="content">
                <h1>${isChinese ? `欢迎 ${firstName}！` : `Welcome ${firstName}!`}</h1>
                <p>${isChinese 
                    ? `感谢您注册SuperAnalyst！我们很高兴您加入我们的专业股票研究社区。` 
                    : `Thank you for signing up for SuperAnalyst! We're excited to have you join our professional equity research community.`}
                </p>
                
                <div class="features">
                    <h3>${isChinese ? '您将获得：' : 'What you\'ll get:'}</h3>
                    <div class="feature-item">
                        <div class="feature-icon">✓</div>
                        <span>${isChinese ? 'AI驱动的深度股票分析报告' : 'AI-powered in-depth equity analysis reports'}</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">✓</div>
                        <span>${isChinese ? '5分钟内生成专业研究报告' : 'Professional research reports generated in 5 minutes'}</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">✓</div>
                        <span>${isChinese ? '覆盖美股、A股、港股市场' : 'Coverage of US, A-share, and Hong Kong markets'}</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">✓</div>
                        <span>${isChinese ? '免费试用报告' : 'Free trial report'}</span>
                    </div>
                </div>
                
                <div style="text-align: center;">
                    <a href="https://superanalyst.pro" class="cta-button">
                        ${isChinese ? '开始您的免费报告' : 'Get Your Free Report'}
                    </a>
                </div>
            </div>
            
            <div class="social-links">
                <p>${isChinese ? '关注我们：' : 'Follow us:'}</p>
                <a href="https://www.linkedin.com/company/superanalystpro/">LinkedIn</a>
                <a href="https://x.com/superanalyst">X (Twitter)</a>
                <a href="https://discord.gg/mdnT7VWr">Discord</a>
            </div>
            
            <div class="footer">
                <p>${isChinese 
                    ? '如有任何问题，请随时联系我们。' 
                    : 'If you have any questions, please don\'t hesitate to contact us.'}
                </p>
                <p>${isChinese ? '祝您投资顺利！' : 'Happy investing!'}</p>
                <p><strong>SuperAnalyst Team</strong></p>
            </div>
        </div>
    </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, locale } = await request.json()
    
    // 验证必需字段
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ 
        error: 'Missing required fields: firstName, lastName, email' 
      }, { status: 400 })
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 })
    }

    // 检查环境变量
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.error('Email configuration missing')
      
      // 在开发环境中，返回成功响应但不实际发送邮件
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Email would be sent to:', email)
        return NextResponse.json({ 
          success: true, 
          messageId: 'dev-mode-' + Date.now(),
          message: locale === 'zh' ? '开发模式：邮件发送模拟成功' : 'Development mode: Email sending simulated'
        })
      }
      
      return NextResponse.json({ 
        error: 'Email service not configured' 
      }, { status: 500 })
    }

    // 创建邮件传输器
    const transporter = createTransporter()

    // 验证传输器配置
    try {
      await transporter.verify()
      console.log('Email transporter verification successful')
    } catch (error) {
      console.error('Email transporter verification failed:', error)
      
      // 提供更详细的错误信息
      if (error instanceof Error) {
        if (error.message.includes('Application-specific password required')) {
          return NextResponse.json({ 
            error: 'Gmail应用密码配置错误',
            details: '请确保使用正确的16位Gmail应用密码，而不是Gmail登录密码',
            help: '请访问 https://myaccount.google.com/apppasswords 生成新的应用密码'
          }, { status: 500 })
        } else if (error.message.includes('Username and Password not accepted')) {
          return NextResponse.json({ 
            error: 'Gmail认证失败',
            details: '请检查EMAIL_USER和EMAIL_APP_PASSWORD是否正确',
            help: '确保使用完整的Gmail地址和应用密码'
          }, { status: 500 })
        }
      }
      
      return NextResponse.json({ 
        error: 'Email service configuration error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    }

    // 生成邮件内容
    const isChinese = locale === 'zh'
    const subject = isChinese 
      ? `欢迎加入SuperAnalyst - ${firstName} ${lastName}`
      : `Welcome to SuperAnalyst - ${firstName} ${lastName}`
    
    const htmlContent = generateWelcomeEmailHTML(firstName, lastName, locale)

    // 发送邮件
    const mailOptions = {
      from: {
        name: 'SuperAnalyst',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: subject,
      html: htmlContent,
    }

    const info = await transporter.sendMail(mailOptions)
    
    console.log('Welcome email sent successfully:', info.messageId)
    
    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId,
      message: isChinese ? '欢迎邮件发送成功' : 'Welcome email sent successfully'
    })

  } catch (error) {
    console.error('Error sending welcome email:', error)
    return NextResponse.json({ 
      error: 'Failed to send welcome email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
