const express = require('express')
const router = express.Router()

const cookieParser  = require('cookie-parser')
const server = require('../modules/server')

router.use(cookieParser(server.cookiePassword))

const data = require('../assets/js/data.json')

const source = []
data.forEach(d => source.push({title: d.title, selected: false}))

const cathegoryFromSource = (index) => {
  const cathegory = [] 
  data[index].cat.forEach(d => 
    cathegory.push({
      title: d.title, 
      selected: false,
      value: `${data[index].url}${d.url}`
    })
  )
  return cathegory
}

const minCount = 4, maxCount = 20, defCount = 12

router.get('/', (req, res) => {
  let cathegory = [], count = defCount
  
  let cookies = req.signedCookies[server.cookieDir]
  if(cookies == undefined) {
    console.log('WARNING: cookies not found...')
    cookies = {
      source: 0,
      cathegory: 0,
      count: minCount
    }
    
    // test of GET query keys
    if(Object.keys(req.query).length > 0) {
      console.log('INFO: using GET query params...')
      for(let key in req.query) 
        switch(key) {
          case 'source':
            const value1 = +req.query[key]
            if(value1 > 0)
              if(value1 > data.length)
                cookies.source = data.length - 1
              else
                cookies.source = value1 
            break
          case 'cathegory':
            const value2 = +req.query[key]
            if(value2> 0)
              cookies.cathegory = value2 
            break
          case 'count':
            const value3 = +req.query[key]
            if(value3 > minCount)
              if(value3 > maxCount)
                cookies.count = maxCount
              else
                cookies.count = value3 
            break
        }
      }
      // test max index of cathegories
      const maxCathegory = data[cookies.source].cat.length - 1
      if(cookies.cathegory > maxCathegory)
        cookies.cathegory = maxCathegory
  }
  
  source[cookies.source].selected = true
  cathegory = cathegoryFromSource(cookies.source)
  cathegory[cookies.cathegory].selected = true
  count = cookies.count
  
  let output = ''
  
  res.render('index', {source, cathegory, minCount, maxCount, count, output})
})

module.exports = router