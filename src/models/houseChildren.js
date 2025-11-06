const sequelize = require('sequelize')
const houseChildrenSchema = require('./../schema/houseChildren')
const config = require('../config')
const mysqlDb = require('../db/mysql')
const CommonApi = require('./common')

class HouseChildrenModel extends CommonApi {
  constructor(example) {
    super(example)
  }
}

const exampleList = {}
const modelList = {}

module.exports = async (tableId) => {
  let example = exampleList[tableId]
  if (config.connectMysql && !example) {
    example = exampleList[tableId] = houseChildrenSchema(mysqlDb, sequelize.DataTypes, { tableId })
    await example.sync()
  }

  if (!modelList[tableId]) {
    return (modelList[tableId] = new HouseChildrenModel(example))
  } else {
    return modelList[tableId]
  }
}
