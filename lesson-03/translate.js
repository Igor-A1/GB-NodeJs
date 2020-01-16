const request = require('request');

const myKey  = 'trnsl.1.1.20200115T120023Z.c8285b4960349c45.e28d25b764e41970df4439bf33cfe0247e65ad4e'
  , langFrom = 'ru'
  , langTo = 'en'

const transPromise = phrase => {
  return new Promise((resolve, reject) => {
    let query = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${myKey}&text=${encodeURIComponent(phrase)}&lang=${langFrom}-${langTo}`

    request(query, (e, res, data) => {
        if (e) reject(e)
        else if (res.statusCode !== 200)
          reject(new Error(`-!!!- ответ сервиса перевода :: ${res.statusCode} -!!!- : что-то пошло не так :-(`))
        else
          resolve(JSON.parse(data))
    })
  })
}

async function translate(txt) {
  data = await transPromise(txt)
  console.log(`---> ${langFrom.toUpperCase()} :: ${txt}`)
  console.log(`<--- ${langTo.toUpperCase()} :: ${data.text[0]}`)
}


const validAnswer = answer => {
  if(isNaN(answer) || answer == '') {
    console.log('   !!! введите текст уже, плиз !!!')
    return false
  } 
  return true
}


console.log('===> переводчик слов с английского на русский <===')
console.log('     вводите фразы на русском языке (000 - выход)')

const readline = require('readline'),
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
 
(transCycle = () => {
  rl.question('', answer => {
    answer = answer.trim()
    if(answer === '000') {
      console.log('<=== спасибо, приходите еще! ===>')
      rl.close()
      return
    }
    
    translate(answer)
    transCycle() // recursion !!!
  })
})()
