const sseMiddleware = (req, res, next) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders() // flush the headers to establish SSE with the client

  res.sseSend = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  req.on('close', () => {
    console.log('Connection closed')
    res.end()
  })

  console.log('New SSE connection established')

  next()
}

module.exports = sseMiddleware
