// sseMiddleware.js
const clients = []

function sseMiddleware(req, res, next) {
  res.sseSetup = function () {
    console.log('Client connected for SSE.')
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })
    res.sseSend = function (data) {
      res.write(`data: ${JSON.stringify(data)}\n\n`)
    }
  }

  res.sseSetup()
  clients.push(res)
  req.on('close', () => {
    console.log('Client disconnected from SSE.')
    clients.splice(clients.indexOf(res), 1)
  })
  next()
}

module.exports = { sseMiddleware, clients }

function sendToAllClients(data) {
  console.log('Sending data to all clients:', data)
  clients.forEach((client) => client.sseSend(data))
}

module.exports.sendToAllClients = sendToAllClients
