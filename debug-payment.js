// 调试Payment 500错误
const debugPayment = async () => {
  console.log('🔍 调试Payment 500错误...')
  
  // 检查环境变量
  console.log('\n📋 检查环境变量:')
  const envVars = [
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY', 
    'STRIPE_WEBHOOK_SECRET',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ]
  
  envVars.forEach(varName => {
    const value = process.env[varName]
    if (value) {
      console.log(`✅ ${varName}: ${value.substring(0, 10)}...`)
    } else {
      console.log(`❌ ${varName}: 未设置`)
    }
  })
  
  // 测试API端点
  console.log('\n📋 测试API端点:')
  try {
    const response = await fetch('http://localhost:3000/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId: 'basic',
        successUrl: 'http://localhost:3000/payment/success',
        cancelUrl: 'http://localhost:3000/payment/cancel'
      })
    })
    
    const result = await response.text()
    console.log(`API响应状态: ${response.status}`)
    console.log(`API响应内容: ${result}`)
    
  } catch (error) {
    console.log(`❌ API调用失败: ${error.message}`)
  }
}

debugPayment().catch(console.error)

