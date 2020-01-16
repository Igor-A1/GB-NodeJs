const request = require('request')
const cheerio = require('cheerio')
const loadMyNews = url => {
  return new Promise((resolve, reject) => {
    request(url, (e, res, html) => {
      if (e) reject(e)
      else if (res.statusCode !== 200) 
        reject(new Error(`-!!!- ответ сервиса новостей :: ${res.statusCode} -!!!- : что-то пошло не так :-(`))
      else 
        resolve(html)
    })
  })
}
   
console.log('===> свежак новостей от newsru.com <===')

loadMyNews('http://txt.newsru.com/allnews/')
  .then(html => {
    let $ = cheerio.load(html)
    $('.index-news-title').each(function(i, el) {
      if(i < 20) {
        let news = $(this).text().trim()
        if(news.length > 75)
          news = news.slice(0, 75) + '\u2026'
        console.log(`  \u2022 ${news}`)
      }
    })
        
    console.log('<=== а теперь расслабьтесь ...')
  })
  .catch(e => console.log(e))
