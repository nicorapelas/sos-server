const socketIo = require('socket.io')

const initializeSocketIo = (server) => {
  const io = socketIo(server)

  io.on('connection', (socket) => {
    console.log('A user connected')

    socket.on('disconnect', () => {
      console.log('User disconnected')
    })

    socket.on('chat message', (msg) => {
      console.log('Message: ' + msg)
      io.emit('chat message', msg)
    })
  })

  return io
}

module.exports = initializeSocketIo
