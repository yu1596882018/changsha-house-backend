/**
 * 长沙楼市查询平台 - 项目配置文件
 * 
 * @description 集中管理应用的各项配置
 * @author yu1596882018
 * @date 2021-02-15
 * 
 * @注意事项
 * 1. 敏感信息（如数据库密码）建议使用环境变量配置
 * 2. 生产环境配置请在 .env 文件中覆盖
 * 3. 配置修改后需要重启应用才能生效
 */

module.exports = {
  // ==================== 服务器配置 ====================
  
  /**
   * 是否开启 HTTPS
   * 开发环境可以开启用于测试
   * 生产环境建议使用 Nginx 统一处理 HTTPS
   */
  openHttps: false,
  
  /**
   * 是否开启 JSON 美化输出
   * 开发环境：开启，方便调试
   * 生产环境：关闭，减小响应体积，提升性能
   */
  jsonSchema: process.env.NODE_ENV !== 'production',
  
  /**
   * 默认启动端口
   * 可通过环境变量 PORT 覆盖
   */
  port: 8899,

  // ==================== MySQL 数据库配置 ====================
  
  /**
   * 是否连接 MySQL
   * true: 应用启动时自动连接数据库
   * false: 不连接数据库（仅测试时使用）
   */
  connectMysql: true,
  
  /**
   * MySQL 连接配置
   * 配置格式: [数据库名, 用户名, 密码, 其他配置]
   * 
   * 生产环境建议：
   * 1. 使用环境变量配置敏感信息
   * 2. 创建专用数据库用户，避免使用 root
   * 3. 使用连接池管理连接
   */
  mysqlConfig: [
    process.env.MYSQL_DATABASE || 'changsha_house',  // 数据库名
    process.env.MYSQL_USERNAME || 'root',            // 用户名
    process.env.MYSQL_PASSWORD || 'XingYun2022',     // 密码
    {
      host: process.env.MYSQL_HOST || 'localhost',   // 数据库地址
      dialect: 'mysql',                               // 数据库类型
      port: process.env.MYSQL_PORT || 3306,          // 端口号
      
      // 连接池配置（高并发场景下很重要）
      pool: {
        max: 10,       // 最大连接数
        min: 2,        // 最小连接数
        acquire: 30000, // 获取连接的最长等待时间（毫秒）
        idle: 10000    // 连接空闲的最长时间（毫秒）
      },
      
      // 查询配置
      define: {
        underscored: true,  // 字段名使用下划线分割（user_name）
        timestamps: true,   // 自动添加 created_at 和 updated_at 字段
        paranoid: false,    // 软删除（deleted_at）
        freezeTableName: true, // 禁止表名复数化
      },
      
      // 日志配置
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      
      // 时区配置
      timezone: '+08:00',
    },
  ],

  // ==================== Elasticsearch 配置 ====================
  
  /**
   * 是否连接 Elasticsearch
   * 用于日志存储和全文检索
   * 如果不需要日志监控功能，可以设置为 false
   */
  connectES: true,
  
  /**
   * Elasticsearch 连接配置
   */
  esConfig: {
    host: process.env.ES_HOST || 'http://localhost:9200',
    apiVersion: '7.2',
    
    // 请求超时配置
    requestTimeout: 30000,
    
    // 日志级别（trace, debug, info, warning, error）
    log: process.env.NODE_ENV === 'development' ? 'info' : 'error',
  },

  // ==================== Redis 缓存配置 ====================
  
  /**
   * 是否连接 Redis
   * 用于数据缓存和会话存储
   * 建议生产环境开启，显著提升查询性能
   */
  connectRedis: process.env.NODE_ENV === 'production' || false,
  
  /**
   * Redis 连接配置
   */
  redisConfig: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',  // 如果设置了密码
    db: process.env.REDIS_DB || 0,               // 数据库索引（0-15）
    
    // 重连配置
    retry_strategy: function (options) {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        // Redis 服务器拒绝连接
        return new Error('Redis 服务器拒绝连接');
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        // 重试超过1小时后放弃
        return new Error('Redis 重试超时');
      }
      if (options.attempt > 10) {
        // 重试10次后放弃
        return undefined;
      }
      // 重连间隔：最小100ms，最大3秒
      return Math.min(options.attempt * 100, 3000);
    }
  },
  
  // ==================== 业务配置 ====================
  
  /**
   * 爬虫配置
   */
  crawler: {
    // 住建局官网地址
    baseUrl: 'http://www.cszjxx.net',
    // 请求延迟（毫秒），避免请求过于频繁
    delay: 1000,
    // 请求超时时间（毫秒）
    timeout: 30000,
    // 最大重试次数
    maxRetry: 3,
  },
  
  /**
   * 缓存配置
   */
  cache: {
    // 楼盘信息缓存时间（秒）
    houseInfoTTL: 600,      // 10分钟
    // 楼栋列表缓存时间（秒）
    buildingListTTL: 600,   // 10分钟
    // 房源详情缓存时间（秒）
    unitInfoTTL: 300,       // 5分钟
    // 统计数据缓存时间（秒）
    statsTTL: 900,          // 15分钟
  },
  
  /**
   * 日志配置
   */
  log: {
    // 日志级别
    level: process.env.LOG_LEVEL || 'info',
    // 日志目录
    dir: './logs',
    // 日志文件最大大小（bytes）
    maxSize: 10 * 1024 * 1024,  // 10MB
    // 日志文件备份数量
    backups: 10,
  },
}
