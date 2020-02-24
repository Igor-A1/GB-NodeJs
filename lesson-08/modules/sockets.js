const config = require('../config')
const rooms = ['users', 'tasks']
let io

function init() {
  io = require('socket.io').listen(config.cli.port)

  console.log(`---> [${new Date().toLocaleTimeString()}]` +
    ` listen for socket connection requests on port ${config.cli.port}`)

  io.sockets.on('connection', socket => {
    console.log(
      `client connected to the socket #${socket.id}.`)

    socket.on('roomJoin', data => {
      const roomName = data.toLowerCase().trim()
  
      if (roomName && rooms.includes(roomName)) {
        socket.join(roomName);
        socket.emit('roomJoin', {room: roomName})
      }
    })
  
    socket.on('roomLeave', data => {
      const roomName = data.toLowerCase().trim()
  
      if (roomName && rooms.includes(roomName)) {
        socket.leave(roomName)
        socket.emit('roomLeave', {room: roomName})
      }
    })
  })

}

function broadcastMessage(room, message) {
  io.in(room).emit('message', {room, timestamp: new Date(), text: message})
}

module.exports = {
  rooms,
  fn: {
    init,
    broadcastMessage
  }
}
