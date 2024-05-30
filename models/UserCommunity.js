const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserCommunitySchema = new Schema({
  name: String,
  communityId: Schema.Types.ObjectId,
  isAdmin: { type: Boolean, default: false },
  panicAlertUser: { type: Boolean, default: true },
})

module.exports = UserCommunitySchema
