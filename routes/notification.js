const express = require('express')
const router = express.Router()
const Notification = require('../models/Notification')
const requireAuth = require('../middlewares/requireAuth')

router.post('/create', requireAuth, async (req, res) => {
  const { message, userId } = req.body
  try {
    const notification = new Notification({
      userId,
      message,
    })
    await notification.save()
    res.json(notification)
  } catch (error) {
    console.log(error)
    return
  }
})

router.post('/fetch', requireAuth, async (req, res) => {})

module.exports = router
