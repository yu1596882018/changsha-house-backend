/**
 * 长沙楼市查询平台 - MySQL 数据库连接
 * 
 * @description 使用 Sequelize ORM 连接 MySQL 数据库
 * @author yu1596882018
 * @date 2021-02-15
 * 
 * @功能说明
 * 1. 初始化 Sequelize 实例
 * 2. 配置数据库连接池
 * 3. 集成日志记录
 * 4. 支持自动建表（sync）
 * 
 * @配置说明
 * 配置在 src/config/index.js 中的 mysqlConfig
 * 
 * @使用示例
 * ```javascript
 * const sequelize = require('./db/mysql')
 * 
 * // 定义模型
 * const User = sequelize.define('user', {
 *   name: Sequelize.STRING,
 *   age: Sequelize.INTEGER
 * })
 * 
 * // 查询数据
 * const users = await User.findAll()
 * ```
 */

const Sequelize = require('sequelize')
const config = require('../config')
const { logUtil } = require('../utils')

// 配置 SQL 日志输出函数
// 将 Sequelize 的 SQL 查询日志统一记录到日志系统
config.mysqlConfig[3].logging = logUtil.logMysql.bind(logUtil)

/**
 * 创建 Sequelize 实例
 * 
 * 参数说明（来自 config.mysqlConfig）：
 * - 参数1: 数据库名称
 * - 参数2: 用户名
 * - 参数3: 密码
 * - 参数4: 配置对象（host、dialect、pool等）
 */
const sequelize = new Sequelize(...config.mysqlConfig)

/**
 * 测试数据库连接
 * 在应用启动时验证数据库是否可连接
 */
if (config.connectMysql) {
  sequelize
    .authenticate()
    .then(() => {
      console.log('✅ MySQL 数据库连接成功')
      console.log(`   - 数据库: ${config.mysqlConfig[0]}`)
      console.log(`   - 主机: ${config.mysqlConfig[3].host}:${config.mysqlConfig[3].port}`)
    })
    .catch(err => {
      console.error('❌ MySQL 数据库连接失败:', err.message)
      console.error('   请检查数据库配置和服务状态')
      // 开发环境连接失败不退出，生产环境建议退出
      if (process.env.NODE_ENV === 'production') {
        // process.exit(1)
      }
    })
}

// 导出 Sequelize 实例
module.exports = sequelize
