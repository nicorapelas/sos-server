let clients = []

const handleSSE = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders() // Flush headers to establish SSE

  // Add this client to the list
  const clientId = Date.now()
  clients.push({ id: clientId, res })

  req.on('close', () => {
    clients = clients.filter((client) => client.id !== clientId)
    res.end()
  })
}

// Function to send a message to all connected clients
const broadcast = (data) => {
  console.log(`data at sseHandler:`, data)
  clients.forEach((client) =>
    client.res.write(`data: ${JSON.stringify(data)}\n\n`)
  )
}

module.exports = { handleSSE, broadcast }
