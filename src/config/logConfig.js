/**
 * 长沙楼市查询平台 - 日志配置
 *
 * @description Log4js 日志配置文件
 * @author yu1596882018
 * @date 2021-02-15
 *
 * @功能说明
 * 配置应用的日志输出规则，包括：
 * 1. 日志输出位置
 * 2. 日志分类（错误、响应、MySQL、调试）
 * 3. 日志轮转策略（按时间切分）
 * 4. 日志级别控制
 *
 * @日志分类
 * - errorLogger: 错误日志（仅记录 ERROR 级别）
 * - resLogger: 响应日志（记录 HTTP 请求响应）
 * - mysqlLogger: MySQL 日志（记录数据库查询）
 * - DebugLogger: 调试日志（记录所有级别）
 *
 * @日志级别
 * ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < OFF
 *
 * @日志文件
 * - logs/error/error-yyyy-MM-dd-hh.log - 错误日志
 * - logs/response/response-yyyy-MM-dd-hh.log - 响应日志
 * - logs/mysql/mysql-yyyy-MM-dd-hh.log - MySQL日志
 * - logs/debug/debug-yyyy-MM-dd-hh.log - 调试日志
 *
 * @轮转策略
 * 每小时创建一个新的日志文件，自动按日期命名
 *
 * @使用方式
 * ```javascript
 * const log4js = require('log4js')
 * const logConfig = require('./config/logConfig')
 *
 * log4js.configure(logConfig)
 * const logger = log4js.getLogger('errorLogger')
 * logger.error('This is an error message')
 * ```
 */

const path = require('path')

/**
 * 日志根目录
 * 所有日志文件都保存在此目录下
 */
const baseLogPath = path.resolve(__dirname, '../../logs')

/**
 * Log4js 配置对象
 */
module.exports = {
  /**
   * Appenders（输出器）配置
   * 定义日志输出的目标和格式
   */
  appenders: {
    /**
     * 错误日志输出器
     * 用于记录应用中的错误信息
     */
    errorLogger: {
      type: 'dateFile',                              // 类型：按日期切分的文件
      filename: `${baseLogPath}/error/error`,        // 文件名（不含后缀）
      alwaysIncludePattern: true,                    // 始终在文件名中包含日期模式
      pattern: '-yyyy-MM-dd-hh.log',                 // 日期模式（每小时一个文件）
      encoding: 'utf-8',                             // 文件编码
      maxLogSize: 10 * 1024 * 1024,                  // 单个文件最大 10MB
      backups: 30,                                   // 保留最近 30 个文件
    },

    /**
     * 响应日志输出器
     * 用于记录 HTTP 请求和响应信息
     */
    resLogger: {
      type: 'dateFile',
      filename: `${baseLogPath}/response/response`,
      alwaysIncludePattern: true,
      pattern: '-yyyy-MM-dd-hh.log',
      encoding: 'utf-8',
      maxLogSize: 10 * 1024 * 1024,
      backups: 30,
    },

    /**
     * MySQL 日志输出器
     * 用于记录数据库查询语句和性能信息
     */
    mysqlLogger: {
      type: 'dateFile',
      filename: `${baseLogPath}/mysql/mysql`,
      alwaysIncludePattern: true,
      pattern: '-yyyy-MM-dd-hh.log',
      encoding: 'utf-8',
      maxLogSize: 10 * 1024 * 1024,
      backups: 30,
    },

    /**
     * 调试日志输出器
     * 用于记录开发调试信息（所有级别）
     */
    DebugLogger: {
      type: 'dateFile',
      filename: `${baseLogPath}/debug/debug`,
      alwaysIncludePattern: true,
      pattern: '-yyyy-MM-dd-hh.log',
      encoding: 'utf-8',
      maxLogSize: 10 * 1024 * 1024,
      backups: 30,
    },
  },

  /**
   * Categories（分类）配置
   * 将日志分类关联到具体的输出器，并设置日志级别
   */
  categories: {
    /**
     * 错误日志分类
     * 仅记录 ERROR 及以上级别的日志
     */
    errorLogger: {
      appenders: ['errorLogger'],
      level: 'error'
    },

    /**
     * 响应日志分类
     * 记录 INFO 及以上级别的日志
     */
    resLogger: {
      appenders: ['resLogger'],
      level: 'info'
    },

    /**
     * MySQL 日志分类
     * 记录 INFO 及以上级别的日志
     */
    mysqlLogger: {
      appenders: ['mysqlLogger'],
      level: 'info'
    },

    /**
     * 默认日志分类
     * 记录所有级别的日志（用于调试）
     */
    default: {
      appenders: ['DebugLogger'],
      level: 'all'
    },
  },

  /**
   * 生产环境建议配置
   *
   * 可以根据环境变量动态调整日志级别：
   * - 开发环境：level: 'all' 或 'debug'
   * - 生产环境：level: 'info' 或 'warn'
   *
   * 示例：
   * level: process.env.NODE_ENV === 'production' ? 'info' : 'all'
   */
}
