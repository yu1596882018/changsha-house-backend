const houseChildrenInfoModel = require('../models/houseChildrenInfo')
const commonExt = require('./commonExt')

module.exports = {
  ...commonExt(houseChildrenInfoModel, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'], {
    modelIsMethod: true,
  }),

  async bulkCreate(ctx, next) {
    let result = await (
      await houseChildrenInfoModel(ctx.params.tableId)
    ).bulkCreate(ctx.request.body.data || [])

    ctx.body = result
    await next()
  },

  async destroyAll(ctx, next) {
    await (
      await houseChildrenInfoModel(ctx.params.tableId)
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
