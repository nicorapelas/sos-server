const express = require('express')
const http = require('http')
const routesSetup = require('./setup/routesSetup')
const connectDB = require('./database/db')
const setupWebSocket = require('./middlewares/webSocket')
const {
  sseMiddleware,
  sendToAllClients,
} = require('./middlewares/sseMiddleware')

const app = express()
const port = 5000

app.use(express.json())

// Connect to MongoDB
connectDB()

// Middleware for handling SSE:
app.get('/events', sseMiddleware, (req, res) => {
  // Clients will be listening on this endpoint
})

// Route to receive data and broadcast:
app.post('/trigger', express.json(), (req, res) => {
  console.log('Received trigger:', req.body)
  sendToAllClients(req.body)
  res.status(200).json({ message: 'Event triggered' })
})

// Setup models and routes
routesSetup(app)

// Create an HTTP server and wrap the Express app
const server = http.createServer(app)

// Setup WebSocket using the external module
setupWebSocket(server)

// Listen on the HTTP server instead of the Express app
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
