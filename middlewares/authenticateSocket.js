const jwt = require('jsonwebtoken')
const User = require('../models/User')
const devKeys = require('../config/devKeys')

const authenticateSocket = async (socket, next) => {
  const { authorization } = socket.handshake.headers

  if (!authorization) {
    return next(new Error('Authentication error: No authorization header'))
  }

  const token = authorization.replace('Bearer ', '')

  jwt.verify(token, devKeys.JwtSecret, async (err, payload) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token'))
    }

    const { userId } = payload
    try {
      const user = await User.findById(userId)
      if (!user) {
        return next(new Error('Authentication error: User not found'))
      }

      socket.request.user = user // Attach user to socket request
      next()
    } catch (error) {
      next(new Error('Authentication error: Database error'))
    }
  })
}

module.exports = authenticateSocket
