const WebSocket = require('ws')

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server })

  wss.on('connection', function connection(ws) {
    console.log('A new client connected.')

    ws.on('message', function incoming(data) {
      try {
        const messageObject = JSON.parse(data) // Parsing the JSON string
        console.log('received:', messageObject.message)

        // Broadcast incoming message to all clients
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(messageObject.message) // Send the actual message part
          }
        })
      } catch (error) {
        console.error('Failed to parse message:', error)
      }
    })

    ws.on('close', () => {
      console.log('Client has disconnected.')
    })

    ws.send(JSON.stringify({ message: 'Welcome to the chat!' })) // Send initial message as JSON
  })
}

module.exports = setupWebSocket
