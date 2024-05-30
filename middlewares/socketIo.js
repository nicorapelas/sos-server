const socketIo = require('socket.io')
const User = require('../models/User')
const authenticateSocket = require('./authenticateSocket') // Adjust the path as needed

const socketIoSetup = (server) => {
  const io = socketIo(server)

  io.use(authenticateSocket) // Use the authentication middleware

  io.on('connection', (socket) => {
    console.log('A user connected', socket.request.user.username)

    // Listen for 'message' events
    socket.on('message', async (data) => {
      console.log('Message received:', data)
      const { userId, event, message } = data

      switch (event) {
        case 'panic':
          console.log(`User panic`)

          try {
            // Find the user and their communities
            const user = await User.findById(userId).populate(
              'community.communityId'
            )
            if (!user) {
              console.log(`User with ID ${userId} not found`)
              return
            }

            const communityIds = user.community.map((c) => c.communityId._id)

            // Find all users in the same communities with panicAlertUser: true
            const usersInCommunities = await User.find({
              'community.communityId': { $in: communityIds },
              'community.panicAlertUser': true,
            })
            console.log(`usersInCommunities:`, usersInCommunities)
            // Broadcast the message to these users
            usersInCommunities.forEach((communityUser) => {
              console.log(`communityUser:`, communityUser)
              const sockets = Array.from(io.sockets.sockets.values())
              sockets.forEach((s) => {
                console.log(`s.request.user:`, s.request.user)
                if (
                  s.request.user &&
                  s.request.user._id.equals(communityUser._id)
                ) {
                  s.emit('message', { event, message })
                }
              })
            })
          } catch (error) {
            console.error('Error broadcasting panic message:', error)
          }
          break

        case 'membersNotification':
          console.log(`Members notification`)
          // Handle membersNotification event here
          break

        default:
          break
      }
    })

    socket.on('disconnect', () => {
      console.log('A user disconnected')
    })
  })

  return io
}

module.exports = socketIoSetup
