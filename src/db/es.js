/**
 * 长沙楼市查询平台 - Elasticsearch 连接
 *
 * @description Elasticsearch 日志存储和全文检索连接配置
 * @author yu1596882018
 * @date 2021-02-15
 *
 * @功能说明
 * 1. 连接 Elasticsearch 服务
 * 2. 用于日志存储和全文检索
 * 3. 配合 Kibana 实现日志可视化分析
 *
 * @使用场景
 * - 应用日志存储（请求日志、错误日志、SQL日志）
 * - 日志查询和分析
 * - 全文检索（楼盘名称、地址等）
 * - 性能监控数据存储
 *
 * @使用示例
 * ```javascript
 * const esClient = require('./db/es')
 *
 * // 创建索引
 * await esClient.indices.create({
 *   index: 'changsha_house_logs'
 * })
 *
 * // 插入文档
 * await esClient.create({
 *   index: 'changsha_house_logs',
 *   type: '_doc',
 *   body: {
 *     level: 'info',
 *     message: 'Request log',
 *     timestamp: new Date()
 *   }
 * })
 *
 * // 搜索文档
 * const result = await esClient.search({
 *   index: 'changsha_house_logs',
 *   body: {
 *     query: {
 *       match: { level: 'error' }
 *     }
 *   }
 * })
 * ```
 *
 * @配置说明
 * 配置在 src/config/index.js 中
 * - connectES: 是否连接 Elasticsearch
 * - esConfig.host: ES 服务地址
 * - esConfig.apiVersion: ES API 版本
 *
 * @注意事项
 * - 如果不需要日志监控功能，可以在配置中设置 connectES: false
 * - 未连接时会返回空客户端对象，避免代码报错
 */

const elasticsearch = require('elasticsearch')
const { esConfig, connectES } = require('../config')

/**
 * 创建 Elasticsearch 客户端
 *
 * 根据配置决定是否真正连接 ES：
 * - connectES = true: 创建真实的 ES 客户端
 * - connectES = false: 返回空对象（方法为空函数），避免调用时报错
 */
let esClient

if (connectES) {
  // 创建真实的 ES 客户端
  esClient = new elasticsearch.Client(esConfig)

  // 测试连接
  esClient
    .ping({
      requestTimeout: 5000,
    })
    .then(() => {
      console.log('✅ Elasticsearch 连接成功')
      console.log(`   - 服务地址: ${esConfig.host}`)
      console.log(`   - API版本: ${esConfig.apiVersion}`)
    })
    .catch((error) => {
      console.error('❌ Elasticsearch 连接失败:', error.message)
      console.error('   提示: 如不需要日志监控，可在配置中关闭 ES')
      console.error('   设置 connectES: false')
    })
} else {
  // 返回空客户端对象
  // 所有方法都是空函数，避免代码调用时报错
  esClient = {
    create: () => Promise.resolve(),
    index: () => Promise.resolve(),
    search: () => Promise.resolve({ hits: { hits: [] } }),
    delete: () => Promise.resolve(),
    update: () => Promise.resolve(),
    ping: () => Promise.resolve(),
    indices: {
      create: () => Promise.resolve(),
      delete: () => Promise.resolve(),
      exists: () => Promise.resolve(false),
    },
  }

  console.log('ℹ️  Elasticsearch 未启用（connectES: false）')
  console.log('   如需日志监控功能，请在配置中开启')
}

// 导出 Elasticsearch 客户端实例
module.exports = esClient
