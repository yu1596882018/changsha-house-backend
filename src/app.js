/**
 * 长沙楼市查询平台 - Koa应用配置
 *
 * @description Koa应用实例的创建和中间件配置
 * @author yu1596882018
 * @date 2021-02-15
 */

const Koa = require('koa')
const path = require('path')
const serve = require('koa-static')
const logger = require('koa-logger')
const json = require('koa-json')
const bodyparse = require('koa-bodyparser')
const cors = require('koa2-cors')
const routers = require('./routers')
const { logUtil } = require('./utils')
const config = require('./config')
const responseFormatter = require('./middlewares/responseFormatter')

// 创建Koa应用实例
const App = new Koa()

/**
 * 全局错误处理中间件
 *
 * 功能：
 * 1. 捕获所有请求处理过程中的异常
 * 2. 记录请求日志（成功/失败）
 * 3. 统计请求响应时间
 *
 * 注意：此中间件必须放在最前面，才能捕获后续中间件的异常
 */
App.use(async (ctx, next) => {
  const startTime = Date.now()

  try {
    // 执行后续中间件
    await next()

    // 请求处理成功，记录响应日志
    const responseTime = Date.now() - startTime
    logUtil.logResponse(ctx, responseTime)
  } catch (error) {
    // 请求处理失败，记录错误日志
    const responseTime = Date.now() - startTime
    logUtil.logError(ctx, error, responseTime)
  }
})

/**
 * JSON美化中间件（可选）
 * 将响应数据格式化为易读的JSON格式
 * 注意：生产环境建议关闭，可减小响应体积
 */
if (config.jsonSchema) {
  App.use(json())
}

/**
 * 响应格式化中间件
 * 统一API响应格式：{ success: boolean, data: any, error: any }
 */
App.use(responseFormatter)

/**
 * 中间件链配置
 * 按照执行顺序依次注册各个中间件
 */
App
  // 1. 请求日志中间件 - 打印请求信息到控制台
  .use(logger())

  // 2. CORS跨域中间件 - 允许跨域请求
  .use(
    cors({
      origin: '*', // 生产环境建议配置具体域名
      credentials: true,
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    })
  )

  // 3. 静态资源中间件 - 提供静态文件访问
  .use(
    serve(path.join(__dirname, './static'), {
      maxage: 10 * 60 * 1000, // 缓存10分钟
    })
  )

  // 4. 请求体解析中间件 - 解析POST请求的body数据
  .use(
    bodyparse({
      enableTypes: ['json', 'form', 'text'],
      jsonLimit: '10mb', // JSON最大限制10MB
      formLimit: '10mb', // 表单最大限制10MB
      textLimit: '10mb', // 文本最大限制10MB
    })
  )

/**
 * 路由注册
 * 遍历所有路由模块，注册到Koa应用
 *
 * routes() - 返回路由中间件
 * allowedMethods() - 处理OPTIONS请求和405/501错误
 */
Object.keys(routers).forEach((routerName) => {
  const router = routers[routerName]
  App.use(router.routes()).use(router.allowedMethods())
})

/**
 * 404处理
 * 所有未匹配到路由的请求都会进入这里
 */
App.use(async (ctx) => {
  ctx.status = 404
  ctx.body = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: '请求的资源不存在',
      path: ctx.path,
    },
  }
})

// 导出Koa应用实例
module.exports = App
