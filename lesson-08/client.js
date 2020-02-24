const start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open')
const config = require('./config.json')
require('child_process').exec(`${start} ${config.serve.url}:${config.serve.port}`)