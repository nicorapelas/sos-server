const express = require('express')
const router = express.Router()
const Community = require('../models/Community')
const User = require('../models/User')
const CommunityInvite = require('../models/CommunityInvite')
const requireAuth = require('../middlewares/requireAuth')

router.post('/triggered', requireAuth, async (req, res) => {
  console.log('/triggerd', req.body)
  res.json(`req.body`)
})

module.exports = router
