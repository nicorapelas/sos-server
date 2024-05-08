const express = require('express')
const router = express.Router()
const Community = require('../models/Community')
const User = require('../models/User')
const CommunityInvite = require('../models/CommunityInvite')
const requireAuth = require('../middlewares/requireAuth')
const { broadcast } = require('../middlewares/sseHandler')

router.post('/triggered', requireAuth, async (req, res) => {
  console.log(req.user)
  try {
    // Use SSE to send all connected users an object { userId, panic: true }
    const data = { userId: req.user.id, panic: true }
    broadcast(data)
    res.json('Notification sent')
  } catch (error) {
    res.status(500).json('Internal Server Error')
  }
})

module.exports = router
