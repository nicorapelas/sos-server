const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
})

module.exports = mongoose.model('Notification', NotificationSchema)
