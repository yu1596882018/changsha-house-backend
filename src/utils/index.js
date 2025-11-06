/**
 * 长沙楼市查询平台 - 工具函数集合
 * 
 * @description 集中管理项目的各种工具函数
 * @author yu1596882018
 * @date 2021-02-15
 */

const LogUtil = require('@yu1596882018/server-sdk/utils/logUtil')
const logConfig = require('../config/logConfig')
const esClient = require('../db/es')
const os = require('os')

/**
 * 日志工具实例
 * 
 * 功能：
 * - 记录请求日志
 * - 记录错误日志
 * - 记录MySQL查询日志
 * - 上报到 Elasticsearch
 * 
 * 使用：
 * ```javascript
 * const { logUtil } = require('./utils')
 * logUtil.logResponse(ctx, responseTime)
 * logUtil.logError(ctx, error, responseTime)
 * ```
 */
const logUtil = new LogUtil(logConfig, esClient)

/**
 * 获取本机局域网 IP 地址
 * 
 * @returns {string|undefined} 返回本机的局域网 IP 地址，如 "192.168.1.100"
 * 
 * @description
 * 遍历所有网络接口，找到第一个非回环的 IPv4 地址
 * 用于服务启动时显示可访问的网络地址
 * 
 * @example
 * const ip = getIPAdress()
 * console.log(`服务地址: http://${ip}:8899`)
 */
function getIPAdress() {
  const interfaces = os.networkInterfaces()
  
  // 遍历所有网络接口
  for (const devName in interfaces) {
    const iface = interfaces[devName]
    
    // 遍历每个接口的地址配置
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i]
      
      // 查找 IPv4、非回环、非内部地址
      if (
        alias.family === 'IPv4' &&      // IPv4 地址
        alias.address !== '127.0.0.1' && // 非回环地址
        !alias.internal                   // 非内部地址
      ) {
        return alias.address
      }
    }
  }
  
  // 未找到合适的地址，返回 undefined
  return undefined
}

/**
 * 延迟函数（异步等待）
 * 
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise<void>}
 * 
 * @example
 * await sleep(1000)  // 等待 1 秒
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 格式化日期时间
 * 
 * @param {Date|string|number} date - 日期对象、时间戳或日期字符串
 * @param {string} format - 格式模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 * 
 * @example
 * formatDate(new Date())  // "2021-02-15 10:30:00"
 * formatDate(Date.now(), 'YYYY-MM-DD')  // "2021-02-15"
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  const d = new Date(date)
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 生成随机字符串
 * 
 * @param {number} length - 字符串长度
 * @returns {string}
 * 
 * @example
 * randomString(8)  // "a3f9d2e1"
 */
function randomString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 导出工具函数
module.exports = {
  logUtil,           // 日志工具
  getIPAdress,       // 获取本机IP
  sleep,             // 延迟函数
  formatDate,        // 格式化日期
  randomString,      // 随机字符串
}
