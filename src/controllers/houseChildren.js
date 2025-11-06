const houseChildrenModel = require('../models/houseChildren')
const commonExt = require('./commonExt')

const attrNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l']

module.exports = {
  ...commonExt(houseChildrenModel, attrNames, { modelIsMethod: true }),

  async bulkCreate(ctx, next) {
    let result = await (
      await houseChildrenModel(ctx.params.tableId)
    ).bulkCreate(ctx.request.body.data || [])

    ctx.body = result
    await next()
  },

  async destroyAll(ctx, next) {
    await (
      await houseChildrenModel(ctx.params.tableId)
    ).destroy(
      {},
      {
        truncate: true,
      }
    )

    ctx.body = 'success'
    await next()
  },
}
