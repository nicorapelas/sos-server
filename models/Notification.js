const mongoose = require('mongoose')
const Schema = mongoose.Schema
const NotificationCommunityListSchema =
  require('./NotificationCommunityList').schema

const NotificationSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  userId: {
    type: String,
  },
  message: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  communityList: [NotificationCommunityListSchema],
})

module.exports = mongoose.model('Notification', NotificationSchema)
