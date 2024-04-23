const express = require('express')
const http = require('http')
const routesSetup = require('./setup/routesSetup')
const connectDB = require('./database/db')
const setupWebSocket = require('./middlewares/webSocket')

const app = express()
const port = 5000

app.use(express.json())

// Connect to MongoDB
connectDB()

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
