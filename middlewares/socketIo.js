const socketIo = require('socket.io')
const User = require('../models/User')
const authenticateSocket = require('./authenticateSocket') // Adjust the path as needed

const socketIoSetup = (server) => {
  const io = socketIo(server)

  io.use(authenticateSocket) // Use the authentication middleware

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.request.user.username)
    // Listen for 'message' events
    socket.on('message', async (data) => {
      console.log('data:', data)
      const { userId, event, message } = data
      switch (event) {
        case 'panic':
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
            // Broadcast the message to these users
            const sockets = Array.from(io.sockets.sockets.values())
            usersInCommunities.forEach((communityUser) => {
              sockets.forEach((s) => {
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
          console.log('Members notification triggered')
          // Handle membersNotification event here
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
            })
            // Broadcast the message to these users
            const sockets = Array.from(io.sockets.sockets.values())
            usersInCommunities.forEach((communityUser) => {
              sockets.forEach((s) => {
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

        default:
          console.log('Unknown event:', event)
          break
      }
    })
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.request.user.username)
    })
  })

  return io
}

module.exports = socketIoSetup
