const express = require('express')
const router = express.Router()
const Community = require('../models/Community')
const requireAuth = require('../middlewares/requireAuth')

router.get('/fetch-community', requireAuth, async (req, res) => {
  try {
    const community = await Community.find({ _user: req.user._id })
    res.json(community)
  } catch (error) {
    console.log(error)
    return
  }
})

router.post('/create-community', async (req, res) => {
  const { name, adminId } = req.body
  try {
    const community = new Community({
      _user: req.user.id,
      name,
      adminId,
    })
    await community.save()
    res.json(community)
    return
  } catch (error) {
    console.log(error)
  }
})
module.exports = router
