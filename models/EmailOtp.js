const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EmailOtp = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('EmailOtp', EmailOtp)
