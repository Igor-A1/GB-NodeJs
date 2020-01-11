const fs = require('fs'),
  path = require('path')

let logFilename = process.argv[2]
if(!logFilename)
  logFilename = 'stats.txt'
logFilename = path.join(__dirname, logFilename)
console.log(`---> статистика игры из файла "${logFilename}"`)

const readLog = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(logFilename, 'utf-8', (err, data) => {
      if(err) 
        reject(err)
      else
        resolve(data)
    })
  })
}

readLog()
  .then(data => {
    let party     = data.split('\n').slice(0, -1),
      win         = party.filter(p => p === 'true').length,
      winLen      = 0,
      winLenMax   = 0,
      loss        = party.filter(p => p === 'false').length,
      lossLen     = 0,
      lossLenMax  = 0

    party.forEach((p, i) => {
      if(p === 'true')
        winLen++
      else {
        if (winLenMax < winLen)
          winLength = winLen
        winLen = 0
      }
      // last item
      if(i === party.length - 1 && winLenMax < winLen)
        winLenMax = winLen

      if(p === 'false')
        lossLen++
      else {
        if (lossLenMax < lossLen)
          lossLength = lossLen
        lossLen = 0
      }
      // last item
      if(i === party.length - 1 && lossLenMax < lossLen)
        lossLenMax = lossLen
    })

    console.log('Количество партий:                    ' + party.length)
    console.log('Количество побед:                     ' + win)
    console.log('Количество проигрышей:                ' + loss)
    console.log('Процент побед:                        ' + Math.round(win / (win + loss) * 100) + '%')
    console.log('Процент проигрышей:                   ' + Math.round(loss / (win + loss) * 100) + '%')
    console.log('Максимальное число побед подряд:      ' + ++winLenMax)
    console.log('Максимальное число проигрышей подряд: ' + ++lossLenMax)
    console.log('<--- кто не играет, тот не выигрывает!')
  })
  .catch(err => {
          console.error(err)
  })
