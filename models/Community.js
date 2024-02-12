const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommunitySchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  adminId: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Community', CommunitySchema)
