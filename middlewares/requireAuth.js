const jwt = require('jsonwebtoken')
const User = require('../models/User')
const devKeys = require('../config/devKeys')

module.exports = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    res.json({ error: 'You must be logged in.' })
    return
  }
  const token = authorization.replace('Bearer ', '')
  jwt.verify(token, devKeys.JwtSecret, async (err, payload) => {
    if (err) {
      res.json({ error: 'You must be logged in.' })
      return
    }
    const { userId } = payload
    const user = await User.findById(userId)
    if (!user) {
      res.json({ error: 'noUserLogedIn' })
      return
    }
    req.user = user
    next()
  })
}
