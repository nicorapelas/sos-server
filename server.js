const express = require('express')
const http = require('http')
const routesSetup = require('./setup/routesSetup')
const connectDB = require('./database/db')
const setupWebSocket = require('./middlewares/webSocket')
const sseMiddleware = require('./middlewares/sseMiddleware')

const app = express()
const port = 5000

app.use(express.json())

// Connect to MongoDB
connectDB()

let clients = []

app.get('/events', sseMiddleware, (req, res) => {
  clients.push(res)
  console.log('Client connected, total clients:', clients.length)
  req.on('close', () => {
    clients = clients.filter((client) => client !== res)
    console.log('Client disconnected, total clients:', clients.length)
  })
})

app.post('/trigger', (req, res) => {
  console.log(`req.body:`, req.body)
  const eventData = req.body
  console.log('Trigger event received:', eventData)
  clients.forEach((client) => client.sseSend(eventData))
  res.status(200).json({ event: 'panic...!' })
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
