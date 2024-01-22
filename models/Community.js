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
  identifier: {
    type: String,
    required: true,
  },
  admin: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Community', CommunitySchema)
