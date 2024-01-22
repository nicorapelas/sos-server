const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const devKeys = require('../config/devKeys')
const User = require('../models/User')
const requireAuth = require('../middlewares/requireAuth')

router.get('/fetch-user', requireAuth, (req, res) => {
  console.log(`hello world`)
  console.log(req.headers)
  res.send('yebo')
  // try {
  //   if (!req.user) {
  //     res.json({ error: 'no user signed' })
  //     return
  //   }
  //   res.json(req.user)
  //   return
  // } catch (error) {
  //   console.error(error)
  //   res.status(500).send({ error: 'Failed to verify OTP' })
  //   return
  // }
})

module.exports = router
