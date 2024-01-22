const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ErrorSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  error: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Error', ErrorSchema)
