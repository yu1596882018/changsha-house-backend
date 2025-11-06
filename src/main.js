/**
 * 长沙楼市查询平台 - 服务启动入口
 * 
 * @description 应用启动文件，负责创建HTTP/HTTPS服务器并监听端口
 * @author yu1596882018
 * @date 2021-02-15
 */

const Http = require('http')
const Https = require('https')
const { default: enforceHttps } = require('koa-sslify')
const fs = require('fs')
const path = require('path')
const App = require('./app')
const utils = require('./utils')
const config = require('./config')

// 从环境变量或配置文件获取端口号
const Port = process.env.port || config.port
const NODE_ENV = process.env.NODE_ENV || 'development'

/**
 * 创建并启动 HTTP 服务器
 * 监听配置的端口，接收客户端请求
 */
Http.createServer(App.callback()).listen(Port, () => {
  console.log(`🚀 HTTP 服务器启动成功！`)
  console.log(`   - 本地访问: http://localhost:${Port}`)
  console.log(`   - 网络访问: http://${utils.getIPAdress()}:${Port}`)
  console.log(`   - 运行环境: ${NODE_ENV}`)
  console.log(`   - 进程ID: ${process.pid}`)
  console.log(`================================================`)
})

/**
 * HTTPS 服务器配置（仅开发环境）
 * 用于本地开发时测试 HTTPS 功能
 * 生产环境建议使用 Nginx 统一处理 HTTPS
 */
if (NODE_ENV === 'development' && config.openHttps) {
  // 强制 HTTP 请求重定向到 HTTPS
  App.use(
    enforceHttps({
      port: 8081,
    }),
  )

  // SSL 证书配置
  const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, './data/server.key')),   // 私钥
    cert: fs.readFileSync(path.join(__dirname, './data/server.pem')),  // 证书
  }

  // 创建 HTTPS 服务器
  Https.createServer(sslOptions, App.callback()).listen(8081, () => {
    console.log(`🔒 HTTPS 服务器启动成功！`)
    console.log(`   - 网络访问: https://${utils.getIPAdress()}:8081`)
    console.log(`================================================`)
  })
}

/**
 * 进程异常处理
 * 捕获未处理的异常和Promise拒绝，防止进程崩溃
 */
process.on('uncaughtException', (error) => {
  console.error('❌ 未捕获的异常:', error)
  // 生产环境建议记录日志后优雅退出
  // process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ 未处理的Promise拒绝:', reason)
  // 生产环境建议记录日志后优雅退出
})

/**
 * 优雅退出处理
 * 接收到终止信号时，关闭服务器并清理资源
 */
process.on('SIGINT', () => {
  console.log('\n⏳ 正在关闭服务器...')
  // 这里可以添加清理逻辑：关闭数据库连接、保存状态等
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n⏳ 正在关闭服务器...')
  process.exit(0)
})
