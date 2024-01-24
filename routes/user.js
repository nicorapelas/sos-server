const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const devKeys = require('../config/devKeys')
const User = require('../models/User')
const requireAuth = require('../middlewares/requireAuth')

router.get('/fetch-user', requireAuth, (req, res) => {
  console.log(req.user)
  res.json(req.user)
})

module.exports = router
