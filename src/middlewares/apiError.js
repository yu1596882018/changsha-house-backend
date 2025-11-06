/**
 * 长沙楼市查询平台 - API 错误类
 * 
 * @description 统一的业务异常处理类
 * @author yu1596882018
 * @date 2021-02-15
 * 
 * @用途
 * - 定义标准的业务异常
 * - 提供友好的错误信息
 * - 区分业务异常和系统异常
 * 
 * @使用示例
 * ```javascript
 * // 抛出参数缺失异常
 * throw ApiError.ErrorForNeedParameter('id', ctx)
 * 
 * // 抛出参数错误异常
 * throw ApiError.ErrorForWrongParameter('id', ctx)
 * 
 * // 抛出自定义异常
 * throw new ApiError(ApiError.Error404NotFound, ctx, '楼盘不存在')
 * ```
 */

class ApiError extends Error {
  /**
   * 构造函数
   * @param {Object} error - 错误类型对象 { code: number, name: string }
   * @param {Context} ctx - Koa 上下文对象
   * @param {string} message - 自定义错误信息（可选）
   */
  constructor(error, ctx, message) {
    super()
    
    // 打印错误堆栈，便于调试
    if (process.env.NODE_ENV === 'development') {
      console.trace()
    }
    
    // 设置错误码和名称
    this.code = error.code
    this.name = error.name
    
    // 设置错误信息
    if (message) {
      // 使用自定义错误信息
      this.message = message
    } else if (ctx && ctx.__) {
      // 使用国际化错误信息（如果配置了 i18n）
      this.message = ctx.__(error.name)
    } else {
      // 使用默认错误名称
      this.message = error.name
    }
    
    // 记录错误日志
    console.log(`[APIError] Code: ${this.code}, Message: ${this.message}`)
  }
}

/**
 * 标准 HTTP 错误码
 */

// 400 - 错误的请求（参数错误）
ApiError.Error400BadRequest = { 
  code: 400, 
  name: 'Bad Request' 
}

// 401 - 未授权（需要登录）
ApiError.Error401UnAuthorized = { 
  code: 401, 
  name: 'Unauthorized' 
}

// 403 - 禁止访问（权限不足）
ApiError.Error403Forbidden = { 
  code: 403, 
  name: 'Forbidden' 
}

// 404 - 资源不存在
ApiError.Error404NotFound = { 
  code: 404, 
  name: 'Not Found' 
}

// 409 - 冲突（资源已存在）
ApiError.Error409Conflict = { 
  code: 409, 
  name: 'Conflict' 
}

/**
 * 自定义业务错误码
 */

// 511 - 服务器内部错误
ApiError.Error511SomeError = { 
  code: 511, 
  name: 'Server Internal Error' 
}

// 512 - 校验失败
ApiError.Error512CheckFail = { 
  code: 512, 
  name: 'Validation Failed' 
}

/**
 * 便捷方法：参数错误
 * 
 * @param {string} parameterName - 参数名称
 * @param {Context} ctx - Koa 上下文
 * @returns {ApiError}
 * 
 * @example
 * throw ApiError.ErrorForWrongParameter('id', ctx)
 */
ApiError.ErrorForWrongParameter = (parameterName, ctx) => {
  return new ApiError(
    ApiError.Error400BadRequest, 
    ctx, 
    `参数 ${parameterName} 的值不正确`
  )
}

/**
 * 便捷方法：参数缺失
 * 
 * @param {string} parameterName - 参数名称
 * @param {Context} ctx - Koa 上下文
 * @returns {ApiError}
 * 
 * @example
 * throw ApiError.ErrorForNeedParameter('id', ctx)
 */
ApiError.ErrorForNeedParameter = (parameterName, ctx) => {
  return new ApiError(
    ApiError.Error400BadRequest, 
    ctx, 
    `缺少必需参数: ${parameterName}`
  )
}

module.exports = ApiError
