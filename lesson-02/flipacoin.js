const fs = require('fs'),
  path = require('path')

let logFilename = process.argv[2]
if(!logFilename)
  logFilename = 'stats.txt'
logFilename = path.join(__dirname, logFilename)
console.log(`---> статистика игры будет записана в файл "${logFilename}"`) 

const log2file = data => fs.appendFile(logFilename, `${data}\n`, err => {if (err) throw err})

const readline = require('readline'),
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
 
const validAnswer = answer => {
  if(isNaN(answer)) {
    console.log('   !!! Число, плиз !!!')
    return false
  } else if (answer < 0 || answer > 1) {
    console.log('   !!! 0 или 1, неужели не понятно !!!')
    return false
  }
  return true
}
 
(newParty = () => {
  let riddle = Math.round(Math.random())

  rl.question('??? орёл(1) || решка(0) || конец_игры(exit) :: ', answer => {
    if(answer === 'exit') {
      console.log('<--- спасибо, приходите еще!')
      rl.close()
      return
    }
    
    if(validAnswer(answer)) {
      if (+answer === riddle) {
          console.log('   +++ угадал!')
          log2file('true');
      } else {
          console.log('   --- облом :-(')
          log2file('false');
      }
    }
    
    newParty() // recursion !!!
  })
})()
