const express = require('express')
const router = express.Router()

  const data = require('../assets/js/data.json')
  const news = require('../modules/news-parser')
  const server = require('../modules/server')
  const cookieParser = require('cookie-parser')

router.post('/', (req, res) => {
  //console.log(req.body)
  const url =
    `${data[req.body.source].url}${data[req.body.source].cat[req.body.cathegory].url}`
  const charset = data[req.body.source].charset
  const filter = data[req.body.source].filter
  const limit = req.body.count
  //console.log({url: url, charset: charset, filter: filter, limit: limit})
    
  news.load(url,charset)
  .then(html => {
    // save cookie here
    router.use(cookieParser(server.cookiePassword))
    res.cookie(
      server.cookieDir, {
        source: req.body.source, 
        cathegory: req.body.cathegory, 
        count: req.body.count
      }, 
      {signed: true}
    )
    
    return res.json({data: news.get(filter, html, limit), error: null})
  })
  .catch(e => {
    return res.json({data: null, error: e})
  })
})

module.exports = router