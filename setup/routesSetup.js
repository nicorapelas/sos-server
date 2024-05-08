const { handleSSE } = require('../middlewares/sseHandler')
const auth = require('../routes/auth')
const error = require('../routes/error')
const user = require('../routes/user')
const community = require('../routes/community')
const panic = require('../routes/panic')

module.exports = function (app) {
  app.get('/events', handleSSE)
  app.use('/auth', auth)
  app.use('/error', error)
  app.use('/user', user)
  app.use('/community', community)
  app.use('/panic', panic)
}
