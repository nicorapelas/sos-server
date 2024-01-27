const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const devKeys = require('../config/devKeys')
const User = require('../models/User')
const requireAuth = require('../middlewares/requireAuth')

router.get('/fetch-user', requireAuth, (req, res) => {
  res.json(req.user)
})

router.patch('/edit-user', requireAuth, async (req, res) => {
  console.log(req.body)
  const { username } = req.body
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        username: username,
      },
      { new: true }
    )
    res.json(user)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

module.exports = router
