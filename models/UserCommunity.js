const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserCommunitySchema = new Schema({
  name: String,
  id: String,
})

module.exports = UserCommunitySchema
