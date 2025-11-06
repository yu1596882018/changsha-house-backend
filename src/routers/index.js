/**
 * 长沙楼市查询平台 - 路由汇总
 *
 * @description 集中管理和导出所有路由模块
 * @author yu1596882018
 * @date 2021-02-15
 *
 * @说明
 * 所有路由模块在此文件中统一导出，然后在 app.js 中批量注册
 *
 * @路由列表
 * - houseEnterList: 楼盘入驻列表路由
 * - houseInfoList: 楼盘信息路由
 * - houseChildrenRouter: 楼栋信息路由
 * - houseChildrenInfoRouter: 房源详情路由
 * - queryHouseInfoRouter: 查询相关路由
 * - tempRouter: 临时测试路由
 * - restsRouter: RESTful API 路由
 *
 * @使用方式
 * 在 app.js 中会遍历此对象，批量注册路由：
 * ```javascript
 * Object.keys(routers).forEach((routerName) => {
 *   const router = routers[routerName]
 *   App.use(router.routes()).use(router.allowedMethods())
 * })
 * ```
 */

// 导入各个路由模块
const houseEnterList = require('./houseEnterList')          // 楼盘入驻列表
const houseInfoList = require('./houseInfoList')            // 楼盘信息
const houseChildrenRouter = require('./houseChildren')      // 楼栋信息
const houseChildrenInfoRouter = require('./houseChildrenInfo')  // 房源详情
const queryHouseInfoRouter = require('./queryHouseInfo')    // 查询相关
const tempRouter = require('./temp')                        // 临时测试
const restsRouter = require('./rests')                      // RESTful API

/**
 * 导出所有路由模块
 *
 * 注意：
 * 1. 导出的每个属性都应该是 koa-router 实例
 * 2. 临时测试路由（tempRouter）仅在开发环境使用，生产环境可以移除
 * 3. 新增路由时，在此处添加导出即可自动注册
 */
module.exports = {
  houseEnterList,
  houseInfoList,
  houseChildrenRouter,
  houseChildrenInfoRouter,
  queryHouseInfoRouter,
  tempRouter,
  restsRouter,
}
