/**
 * 长沙楼市查询平台 - Redis 连接
 *
 * @description Redis 缓存数据库连接配置
 * @author yu1596882018
 * @date 2021-02-15
 *
 * @功能说明
 * 1. 创建 Redis 客户端连接
 * 2. 用于数据缓存和会话存储
 * 3. 显著提升查询性能
 *
 * @使用场景
 * - 热点数据缓存（楼盘信息、房源列表等）
 * - Session 存储
 * - 验证码存储
 * - 接口频率限制计数器
 *
 * @使用示例
 * ```javascript
 * const redisClient = require('./db/redis')
 *
 * // 设置缓存
 * redisClient.set('key', JSON.stringify(data), 'EX', 600)
 *
 * // 获取缓存
 * redisClient.get('key', (err, reply) => {
 *   if (reply) {
 *     const data = JSON.parse(reply)
 *   }
 * })
 *
 * // 删除缓存
 * redisClient.del('key')
 * ```
 *
 * @配置说明
 * 配置在 src/config/index.js 中的 redisConfig
 * - port: Redis 端口（默认 6379）
 * - host: Redis 主机地址（默认 localhost）
 * - password: Redis 密码（可选）
 * - db: 数据库索引（默认 0）
 */

const redis = require('redis')
const config = require('../config')

/**
 * 创建 Redis 客户端
 *
 * 参数：
 * - port: 端口号
 * - host: 主机地址
 * - 其他配置通过 config.redisConfig 传入
 */
const redisClient = redis.createClient(
  config.redisConfig.port,
  config.redisConfig.host,
  config.redisConfig
)

/**
 * 连接成功事件
 */
redisClient.on('connect', () => {
  console.log('✅ Redis 连接成功')
  console.log(`   - 主机: ${config.redisConfig.host}:${config.redisConfig.port}`)
})

/**
 * 连接错误事件
 */
redisClient.on('error', (err) => {
  console.error('❌ Redis 连接错误:', err.message)
  console.error('   提示: 如不需要缓存功能，可在配置中关闭 Redis')

  // 生产环境连接失败可能需要退出
  if (process.env.NODE_ENV === 'production' && config.connectRedis) {
    // console.error('   生产环境 Redis 连接失败，程序将退出')
    // process.exit(1)
  }
})

/**
 * 重连事件
 */
redisClient.on('reconnecting', () => {
  console.log('🔄 Redis 正在重连...')
})

/**
 * 连接就绪事件
 */
redisClient.on('ready', () => {
  console.log('🎉 Redis 已就绪，可以处理命令')
})

// 导出 Redis 客户端实例
module.exports = redisClient
