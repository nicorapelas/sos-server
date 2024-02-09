const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserCommunitySchema = new Schema({
  name: String,
  communityId: String,
  adminId: String,
})

module.exports = UserCommunitySchema
