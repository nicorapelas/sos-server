const mongoose = require('mongoose')
const devKeys = require('../config/devKeys')

const connectDB = async () => {
  try {
    await mongoose.connect(devKeys.mongoURI)
    console.log('MongoDB Connected...')
  } catch (err) {
    console.error('Failed to connect to MongoDB', err)
    process.exit(1) // Exit process with failure
  }
}

module.exports = connectDB
