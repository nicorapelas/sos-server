const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserCommunitySchema = new Schema({
  name: String,
  communityId: Schema.Types.ObjectId,
  isAdmin: { type: Boolean, default: false },
  panicAlertMembers: { type: Boolean, default: true },
  panicAlertUser: { type: Boolean, default: true },
})

module.exports = UserCommunitySchema
