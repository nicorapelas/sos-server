const express = require('express')
const router = express.Router()
const Notification = require('../models/Notification')
const requireAuth = require('../middlewares/requireAuth')

router.post('/create', requireAuth, async (req, res) => {
  const { message, userId, communityList } = req.body
  try {
    const notification = new Notification({
      userId,
      message,
      communityList,
    })
    await notification.save()
    res.json(notification)
  } catch (error) {
    console.log(error)
    res.status(500).send('Server Error')
  }
})

router.post('/fetch', requireAuth, async (req, res) => {})

module.exports = router
