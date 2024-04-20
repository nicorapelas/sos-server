const express = require('express')
const http = require('http')
const routesSetup = require('./setup/routesSetup')
const connectDB = require('./database/db')
const initializeSocketIo = require('./middlewares/socketio')

const app = express()
const port = 5000

app.use(express.json())

// Connect to MongoDB
connectDB()

// Setup models and routes
routesSetup(app)

// Create an HTTP server and wrap the Express app
const server = http.createServer(app)

// Initialize Socket.IO with the server
initializeSocketIo(server)

// Listen on the HTTP server instead of the Express app
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
