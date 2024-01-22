const express = require('express')
const routesSetup = require('./setup/routesSetup')
const connectDB = require('./database/db')

const app = express()
const port = 5000

app.use(express.json())

// Connect to MongoDB
connectDB()

// Setup models and routes
routesSetup(app)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
