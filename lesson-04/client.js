const start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open')
const server = require('./modules/server.js')
require('child_process').exec(`${start} ${server.url}:${server.port}`)