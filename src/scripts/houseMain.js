/**
 * 长沙楼市查询平台 - 爬虫主流程
 * 
 * @description 完整采集指定楼盘的所有数据
 * @author yu1596882018
 * @date 2021-02-15
 * 
 * @采集流程
 * 1. 采集楼盘基本信息（名称、地址、开发商等）
 * 2. 采集楼栋列表信息（楼栋名称、楼层数等）
 * 3. 采集每个楼栋的所有房源信息（房号、面积、状态等）
 * 4. 对失败的楼栋进行重试
 * 
 * @容错机制
 * - 单个楼栋采集失败不影响其他楼栋
 * - 失败的楼栋会收集起来进行二次重试
 * - 所有异常都会被捕获并记录
 */

const houseChildrenInfo = require('./houseChildrenInfo')
const houseChildren = require('./houseChildren')
const houseInfoList = require('./houseInfoList')

/**
 * 爬虫主函数
 * 
 * @param {string} id - 楼盘唯一标识（通过验证预售证号获取）
 * @returns {Promise<void>}
 * 
 * @example
 * const houseMain = require('./scripts/houseMain')
 * await houseMain('abc123def456')
 */
module.exports = async (id) => {
  console.log(`========================================`)
  console.log(`🕷️  开始采集楼盘数据`)
  console.log(`   楼盘ID: ${id}`)
  console.log(`   开始时间: ${new Date().toLocaleString()}`)
  console.log(`========================================`)

  try {
    // ===== 第一步：采集楼盘基本信息 =====
    console.log(`\n📋 [1/3] 正在采集楼盘基本信息...`)
    await houseInfoList(id)
    console.log(`✅ 楼盘基本信息采集完成`)

    // ===== 第二步：采集楼栋列表 =====
    console.log(`\n🏢 [2/3] 正在采集楼栋列表...`)
    const buildingList = await houseChildren(id)
    
    if (!buildingList || buildingList.length === 0) {
      console.log(`⚠️  未找到楼栋信息，跳过房源采集`)
      return
    }
    
    console.log(`✅ 楼栋列表采集完成，共 ${buildingList.length} 栋`)

    // ===== 第三步：采集每个楼栋的房源信息 =====
    console.log(`\n🏠 [3/3] 正在采集房源详细信息...`)
    const errorList = []  // 记录采集失败的楼栋
    
    // 遍历所有楼栋
    for (let i = 0; i < buildingList.length; i++) {
      const building = buildingList[i]
      
      try {
        console.log(`   [${i + 1}/${buildingList.length}] 采集楼栋: ${building.i}`)
        await houseChildrenInfo(id, building.i)
        
        // 请求间隔，避免请求过快被封IP
        if (i < buildingList.length - 1) {
          await sleep(1000)  // 延迟1秒
        }
      } catch (error) {
        // 单个楼栋失败不影响其他楼栋，记录到错误列表
        errorList.push(building.i)
        console.error(`   ❌ 楼栋 ${building.i} 采集失败:`, error.message)
      }
    }

    // ===== 第四步：重试失败的楼栋 =====
    if (errorList.length > 0) {
      console.log(`\n🔄 开始重试失败的楼栋，共 ${errorList.length} 个`)
      
      for (let i = 0; i < errorList.length; i++) {
        const buildingId = errorList[i]
        
        try {
          console.log(`   [${i + 1}/${errorList.length}] 重试楼栋: ${buildingId}`)
          await houseChildrenInfo(id, buildingId)
          
          if (i < errorList.length - 1) {
            await sleep(1000)
          }
        } catch (error) {
          console.error(`   ❌ 楼栋 ${buildingId} 重试仍然失败:`, error.message)
        }
      }
    }

    // ===== 采集完成 =====
    console.log(`\n========================================`)
    console.log(`✅ 楼盘数据采集完成！`)
    console.log(`   楼盘ID: ${id}`)
    console.log(`   楼栋总数: ${buildingList.length}`)
    console.log(`   失败数量: ${errorList.length}`)
    console.log(`   结束时间: ${new Date().toLocaleString()}`)
    console.log(`========================================\n`)

  } catch (error) {
    // 主流程异常
    console.error(`\n❌ 采集过程发生严重错误:`, error)
    console.error(`   楼盘ID: ${id}`)
    console.error(`   错误信息: ${error.message}`)
    console.error(`   错误堆栈:`, error.stack)
    throw error
  }
}

/**
 * 延迟函数
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
