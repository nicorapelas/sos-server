const auth = require('../routes/auth')
const error = require('../routes/error')
const user = require('../routes/user')

module.exports = function (app) {
  app.use('/auth', auth)
  app.use('/error', error)
  app.use('/user', user)
}
