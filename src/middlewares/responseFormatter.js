/**
 * 长沙楼市查询平台 - 响应格式化中间件
 *
 * @description 统一处理API响应格式和错误信息
 * @author yu1596882018
 * @date 2021-02-15
 *
 * @功能说明
 * 1. 捕获所有请求处理过程中的异常
 * 2. 区分业务异常（APIError）和系统异常
 * 3. 统一响应格式
 * 4. 记录详细的错误日志
 *
 * @响应格式
 * 成功：{ success: true, data: any }
 * 失败：{ code: number, error_name: string, message: string }
 */

const APIError = require('./apiError')

module.exports = async (ctx, next) => {
  try {
    // 执行后续中间件
    await next()
  } catch (error) {
    /**
     * 错误分类处理
     */

    // 1. 业务异常（APIError）- 可预期的错误，如参数错误、权限不足等
    if (error instanceof APIError) {
      ctx.status = 200 // 业务异常仍返回 200，通过 code 区分
      ctx.body = {
        code: error.code,
        error_name: error.name,
        message: error.message,
      }
    }
    // 2. 系统异常（Error）- 不可预期的错误，如数据库连接失败、第三方服务异常等
    else {
      // 记录详细的错误信息，便于排查问题
      console.error('========== 系统异常 ==========')
      console.error(`错误代码: ${error.code || 'N/A'}`)
      console.error(`错误信息: ${error.message}`)
      console.error(`错误堆栈: ${error.stack}`)
      console.error('==============================')

      // 设置 HTTP 状态码为 500
      ctx.status = 500

      // 返回通用错误信息，避免泄露敏感信息
      ctx.body = {
        code: -1,
        error_name: 'InternalServerError',
        message: process.env.NODE_ENV === 'production' ? '服务器错误，请稍后重试' : error.message, // 开发环境返回详细错误信息
      }
    }

    /**
     * 继续抛出异常，让外层中间件处理日志记录
     * 这样可以在全局错误处理中统一记录到 Elasticsearch
     */
    throw error
  }
}
