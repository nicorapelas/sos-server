const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommunityInviteSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  pin: {
    type: String,
    required: true,
  },
  communityId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('CommunityInvite', CommunityInviteSchema)
