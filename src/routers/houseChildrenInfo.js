const Router = require('koa-router')
const houseChildrenInfoRouter = new Router()
const houseChildrenInfoCont = require('../controllers/houseChildrenInfo')
const routerCommonExt = require('./routerCommonExt')

routerCommonExt(houseChildrenInfoRouter, houseChildrenInfoCont, '/houseChildrenInfo/:tableId')

houseChildrenInfoRouter.post(
  '/houseChildrenInfo/:tableId/bulkCreate',
  houseChildrenInfoCont.bulkCreate
)

houseChildrenInfoRouter.delete('/houseChildrenInfo/:tableId', houseChildrenInfoCont.destroyAll)

module.exports = houseChildrenInfoRouter
