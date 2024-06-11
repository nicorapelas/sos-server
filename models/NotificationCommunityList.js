const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationCommunityListSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  communityId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'NotificationCommunityList',
  },
})

module.exports = mongoose.model(
  'NotificationCommunityList',
  NotificationCommunityListSchema
)
