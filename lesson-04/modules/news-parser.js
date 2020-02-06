const cheerio = require('cheerio')

function parse(html, filter, count) {
  const $ = cheerio.load(html)
  return $(filter).get().slice(0, count)
    .map(el => ($(el).eq(0).text().trim()))
}

const get = (filter, html, count) => {
  let list = parse(html, filter, count)
  if(list.length ===0)
    list.push('похоже нет новостей по этой теме...')
  return list
}

const iconv = require('iconv-lite')

const load = (url, charset) => {
  const http = require(url.substring(0, 5) === 'https' ? 'https' : 'http')
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      // if(charset === 'utf8') {
        // if (res.statusCode !== 200)
          // reject(new Error(`сервис новостей :: ${res.statusCode} :: что-то пошло не так...`))
        // else {
          // let html = ''
          // res.on('data', chunk => html += chunk)
          // //res
          // resolve(html)
        // }
      // } else {
        res.pipe(iconv.decodeStream(charset))
          .collect((e, html) => {
            if(e) reject(e)
            if (res.statusCode !== 200)
              reject(new Error(`сервис новостей :: ${res.statusCode} :: что-то пошло не так...`))
            else
              resolve(html)
          })
      // }
    })
  })
}

if(typeof window === 'undefined' && module.exports)
  module.exports = {load, get}

/* for testing as single node script:
async function test(url, charset, filter, count)  {
  try {
    let html = await load(url, charset)
    let news = get(filter, html, count)
    console.log(news)
  }
  catch(e) {console.log(e)}
}


test('https://hitech.newsru.com/', 'win1251', '.index-news-title', 5)
//test('http://www.meddaily.ru/rubric/789', 'win1251', '.news_block .topic_title', 5)
//test('https://www.inopressa.ru/rubrics/different', 'win1251', 'h2', 5)
*/