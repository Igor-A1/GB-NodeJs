const path = require('path')
const sound = require('sound-play')
const anitext = require('chalk-animation')

const mp3 = path.join(__dirname, 'media/hny.mp3')
const banner = anitext.rainbow('-!!!- с наступающими новогодними праздниками -!!!-');

(async () => {
  try {
    console.log('---> starting...')
    banner.start()
    await sound.play(mp3)
    banner.stop()
    console.log('<--- done.')
  } catch (error) {
    banner.stop()
    console.error(error)
  }
})()
