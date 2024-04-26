const WebSocket = require('ws')

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server })
  wss.on('connection', function connection(ws) {
    console.log('A new client connected.')
    ws.on('message', function incoming(data) {
      console.log('Received message:', data)
      try {
        const messageObject = JSON.parse(data) // Parsing the JSON string
        if (messageObject.panic) {
          console.log('Broadcasting panic data:', messageObject)
          // Broadcast panic message to all clients
          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(messageObject)) // Send the entire panicData object
            }
          })
        }
      } catch (error) {
        console.error('Failed to parse message:', error)
      }
    })
    ws.on('close', () => {
      console.log('Client has disconnected.')
    })
    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
    })
    ws.send(JSON.stringify({ message: 'Welcome to the chat!' })) // Send initial message as JSON
    console.log('Welcome message sent.')
  })
}

module.exports = setupWebSocket
