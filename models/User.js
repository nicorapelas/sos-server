const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    default: '',
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  phoneNumberVerified: {
    type: Boolean,
    default: false,
  },
  termsAndConditionsAccepted: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    default: '',
  },
  created: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('User', userSchema)
