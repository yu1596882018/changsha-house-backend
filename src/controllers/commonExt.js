/**
 * 基本增、删、改、查逻辑复用
 * @param exampleModel
 * @param attrNames
 * @param options
 * @returns {{addCont(*, *): Promise<void>, deleteCont(*, *): Promise<void>, updateCont(*, *): Promise<void>, queryCont(*, *): Promise<void>}}
 */
module.exports = function (exampleModel, attrNames = [], options = {}) {
  const { modelIsMethod } = options

  return {
    async addCont(ctx, next) {
      let options = {}

      attrNames.forEach((attrName) => {
        let val = ctx.request.body[attrName]
        if (val !== undefined) {
          options[attrName] = val
        }
      })

      let result = await (
        modelIsMethod ? await exampleModel(ctx.params.tableId) : exampleModel
      ).create(options)

      ctx.body = result
      await next()
    },

    async deleteCont(ctx, next) {
      await (modelIsMethod ? await exampleModel(ctx.params.tableId) : exampleModel).destroy({
        id: ctx.params.id,
      })

      ctx.body = 'success'
      await next()
    },

    async updateCont(ctx, next) {
      let options = {}

      attrNames.forEach((attrName) => {
        let val = ctx.request.body[attrName]
        // if (val !== undefined) {
        options[attrName] = val
        // }
      })

      await (modelIsMethod ? await exampleModel(ctx.params.tableId) : exampleModel).update(
        options,
        {
          id: ctx.params.id,
        }
      )

      ctx.body = 'success'
      await next()
    },

    async patchCont(ctx, next) {
      let options = {}

      attrNames.forEach((attrName) => {
        let val = ctx.request.body[attrName]
        if (val !== undefined) {
          options[attrName] = val
        }
      })

      await (modelIsMethod ? await exampleModel(ctx.params.tableId) : exampleModel).update(
        options,
        {
          id: ctx.params.id,
        }
      )

      ctx.body = 'success'
      await next()
    },

    async queryOneCont(ctx, next) {
      let result = await (
        modelIsMethod ? await exampleModel(ctx.params.tableId) : exampleModel
      ).findOne({
        id: ctx.params.id,
      })

      ctx.body = result
      await next()
    },

    async queryAllCont(ctx, next) {
      let options = {}

      console.log(ctx.params)
      attrNames.forEach((attrName) => {
        let val = ctx.query[attrName]
        if (val !== undefined) {
          options[attrName] = val
        }
      })

      let result = await (
        modelIsMethod ? await exampleModel(ctx.params.tableId) : exampleModel
      ).findAndCountAll(options, +ctx.query.offset || 0, +ctx.query.limit || 10)

      ctx.body = result
      await next()
    },
  }
}
