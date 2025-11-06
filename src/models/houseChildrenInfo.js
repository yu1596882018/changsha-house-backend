const sequelize = require('sequelize')
const houseChildrenInfoSchema = require('./../schema/houseChildrenInfo')
const config = require('../config')
const mysqlDb = require('../db/mysql')
const CommonApi = require('./common')

class houseChildrenInfoModel extends CommonApi {
  constructor(example) {
    super(example)
  }
}

const exampleList = {}
const modelList = {}

module.exports = async (tableId) => {
  let example = exampleList[tableId]
  if (config.connectMysql && !example) {
    example = exampleList[tableId] = houseChildrenInfoSchema(mysqlDb, sequelize.DataTypes, {
      tableId,
    })
    await example.sync()
  }

  if (!modelList[tableId]) {
    return (modelList[tableId] = new houseChildrenInfoModel(example))
  } else {
    return modelList[tableId]
  }
}
