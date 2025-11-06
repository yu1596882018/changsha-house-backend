/**
 * 长沙楼市查询平台 - 查询控制器
 *
 * @description 处理楼盘查询相关的业务逻辑
 * @author yu1596882018
 * @date 2021-02-15
 *
 * @功能列表
 * - getCodeImg: 获取验证码图片
 * - verifyCode: 验证预售证号并获取楼盘ID
 * - collectHouseInfo: 触发爬虫采集楼盘数据
 */

const rp = require('request-promise')
const cheerio = require('cheerio')
const houseMain = require('./../scripts/houseMain')

module.exports = {
  /**
   * 获取验证码图片
   *
   * @description 从住建局官网获取验证码图片
   * @route GET /api/getCodeImg
   * @returns {Image} 验证码图片（PNG格式）
   *
   * @说明
   * 1. 验证码与Session绑定
   * 2. 验证码有效期10分钟
   * 3. 每次请求都会生成新的验证码
   */
  getCodeImg: async (ctx, next) => {
    ctx.set('Content-Type', 'image/png')
    const imgRes = await rp('http://www.cszjxx.net/newCaptcha?r=' + Math.random(), {
      headers: {
        accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'proxy-connection': 'keep-alive',
        cookie:
          'XSRF-TOKEN=eyJpdiI6IlMzTGEwaHZ4M1Uyd3lkaTVTbU9YeEE9PSIsInZhbHVlIjoiUlJIXC9aRVc0eFJLTm5xQzNrOTRuQlwvRjZ2SDBqeHNRVXdGa25VWnVUNm5mQWVFV21BTkxDZDRtcmRyTnc5NkduUDVDc29zU1FsQ2xXMzNocFA0MmMzUT09IiwibWFjIjoiYjFkZTc0Mzk4NDljMTA5NzY2ODlkN2NjMmM4NmE3ZmUxYmQzZWU3NDhkNWFiMjJlMDEyYTZjMjcyMDE3Y2RjMyJ9; laravel_session=eyJpdiI6Ind5YWdycUZRVkJ0XC9pRW1LTXNsYzJnPT0iLCJ2YWx1ZSI6Ing4RmxOTkRLTzlucG14UUVBQ21BVEZKWTMrQkVrbWJKTXFKUFliVk10ekJ3XC9UZ3VUU1dzMWRlOG9SWThJRFk2a1FKckwzZXVqeVpCaUtHUEJZeHpYZz09IiwibWFjIjoiMzZhNDI3OTgxNzMwMWYwOGM2M2RhZDRjZTUwYWMzNzk5NDU4NDg0ZWNhNTQ3YzE0NWJlNGVhMzg4NDYxOTdkYiJ9',
      },
      referrer: 'http://www.cszjxx.net/preselllicence',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      encoding: null,
      jar: true,
    })

    ctx.body = imgRes
  },
  verifyCode: async (ctx, next) => {
    const htmlRes = await rp('http://www.cszjxx.net/preselllicence', {
      jar: true,
    })
    const $ = cheerio.load(htmlRes)

    const result = await rp('http://www.cszjxx.net/preselllicence', {
      headers: {
        accept: 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'proxy-connection': 'keep-alive',
        'x-requested-with': 'XMLHttpRequest',
        cookie:
          'XSRF-TOKEN=eyJpdiI6IlMzTGEwaHZ4M1Uyd3lkaTVTbU9YeEE9PSIsInZhbHVlIjoiUlJIXC9aRVc0eFJLTm5xQzNrOTRuQlwvRjZ2SDBqeHNRVXdGa25VWnVUNm5mQWVFV21BTkxDZDRtcmRyTnc5NkduUDVDc29zU1FsQ2xXMzNocFA0MmMzUT09IiwibWFjIjoiYjFkZTc0Mzk4NDljMTA5NzY2ODlkN2NjMmM4NmE3ZmUxYmQzZWU3NDhkNWFiMjJlMDEyYTZjMjcyMDE3Y2RjMyJ9; laravel_session=eyJpdiI6Ind5YWdycUZRVkJ0XC9pRW1LTXNsYzJnPT0iLCJ2YWx1ZSI6Ing4RmxOTkRLTzlucG14UUVBQ21BVEZKWTMrQkVrbWJKTXFKUFliVk10ekJ3XC9UZ3VUU1dzMWRlOG9SWThJRFk2a1FKckwzZXVqeVpCaUtHUEJZeHpYZz09IiwibWFjIjoiMzZhNDI3OTgxNzMwMWYwOGM2M2RhZDRjZTUwYWMzNzk5NDU4NDg0ZWNhNTQ3YzE0NWJlNGVhMzg4NDYxOTdkYiJ9',
      },
      referrer: 'http://www.cszjxx.net/preselllicence',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body:
        'area=cs&yszh=' +
        ctx.request.body.yszh +
        '&_token=' +
        $('#form [name="_token"]').val() +
        '&ismobile=0&xmmc=&verify_code=' +
        ctx.request.body.verify_code,
      method: 'POST',
      mode: 'cors',
      json: true,
      jar: true,
    })

    if (result.status === '1') {
      const $ = cheerio.load(eval("'" + result.content + "'"))
      const $a = $('a')
      const hrefValue = $a.attr('href')
      const iMatch = hrefValue && hrefValue.match(/\S+floorinfo\/(\w+)/)

      const id = iMatch ? iMatch[1] : null
      result.id = id
    }

    ctx.body = result
  },

  async collectHouseInfo(ctx, next) {
    await houseMain(ctx.query.id)

    ctx.body = 'success'
  },
}
