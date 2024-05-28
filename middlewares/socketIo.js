const socketIo = require('socket.io')

const socketIoSetup = (server) => {
  const io = socketIo(server)

  io.on('connection', (socket) => {
    console.log('A user connected')

    // Listen for 'message' events
    socket.on('message', (data) => {
      console.log('Message received:', data)
      // Broadcast the message to all connected clients
      io.emit('message', data)
    })

    socket.on('disconnect', () => {
      console.log('A user disconnected')
    })
  })

  return io
}

module.exports = socketIoSetup
