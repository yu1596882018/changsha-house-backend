const cheerio = require('cheerio')
const rp = require('request-promise')

const attrNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

module.exports = async (id) => {
  const datas = []

  const res = await rp('http://222.240.149.21:8081/floorinfo/' + id, {
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'cache-control': 'max-age=0',
      'proxy-connection': 'keep-alive',
      'upgrade-insecure-requests': '1',
      cookie:
        'XSRF-TOKEN=eyJpdiI6IkNCTDVJUFRLUy8zcnBua1U0ZlRHS2c9PSIsInZhbHVlIjoidCtINWZ4NlFrL09IRittMmg4R3NzcFVCUHFrYUs2NWVFTHJCa05MRm1FYTJJUmR2ZVN3UXJRUUx4alJEb3M1MU1sZEcwODNneWRqMzBMU3ZKVjNWZ0FTNDYvdVFVZkoxY2U0L1RUeUN4U1h4RVNqQkJlVHFYQ3NwWU5uRTBXazciLCJtYWMiOiI2YTFmZTdmYmU0ZDQ5NDg3YmVjZTRjNzdjYzgwNTkwODI4YjMyNGNjZmJmOTdlYmE0ZTVkMDY3NTRmMjY2ZDFkIn0%3D; laravel_session=eyJpdiI6Iko0UUtnd1ZyY0luUVJyUkxBa2VVWGc9PSIsInZhbHVlIjoiRWhMTllPRGt0VEtSZkJTTVZ1RFVVVDdidlhtcXZpUm14UkQvZG9DbUE4dy9hbXRjYldRL2Z3MmxJYlc1aTFLcEYrUlA0TGxJbmVwTldmN3JSQ3hJZDB2UFpKYkZMb2F3N01QMXQyTFZlL3JBVllBbmI0aXRLbVVMQ0kyMElyWDAiLCJtYWMiOiIxNGM0OTc4NzdjZGEwMjA1YmUxMjYwOGM2YjkyY2U3N2U3MjgzN2MzZmZjNjFiYzU5YjFmZGE0ZTNlYzg3OWI4In0%3D',
    },
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors',
  })
  // console.log('res', res)
  const $ = cheerio.load(res)
  const $trs = $('.hs_table > table > tbody > tr:not(.hs_table1)')
  // console.log('trs', $trs.length)

  $trs.each((index, element) => {
    if (index !== 0) {
      const $tds = $(element).children('td')
      const onclickValue = $(element).children('td.hs_zk').attr('onclick')
      const iMatch = onclickValue && onclickValue.match(/javascript:hsjajx\('(\w+)',\d+\)/)

      const data = {
        i: iMatch ? iMatch[1] : null,
      }

      attrNames.forEach((item, index) => {
        data[item] = $tds.eq(index).text()
      })
      datas.push(data)
    }
  })

  // console.log(datas)
  await rp({
    method: 'DELETE',
    url: 'http://localhost:8899/houseChildren/' + id,
  })

  const result = await rp({
    method: 'POST',
    url: 'http://localhost:8899/houseChildren/' + id + '/bulkCreate',
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
    },
    body: {
      data: datas,
    },
    json: true,
  })

  // console.log('success - houseChildren - POST', result)
  return datas
}
