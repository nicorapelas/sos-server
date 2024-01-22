const express = require('express')
const mongoose = require('mongoose')
const Error = require('../models/Error')

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const error = new Error({
      _user: req.user.id,
      ...req.body,
    })
    await error.save()
    res.json(error)
    return
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
