const auth = require('../routes/auth')
const error = require('../routes/error')
const user = require('../routes/user')
const community = require('../routes/community')
const notification = require('../routes/notification')

module.exports = function (app) {
  app.use('/auth', auth)
  app.use('/error', error)
  app.use('/user', user)
  app.use('/community', community)
  app.use('/notification', notification)
}
