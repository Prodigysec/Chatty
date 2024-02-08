const express = require('express')
const path = require('path')

// Initialize the app
const app = express()

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')))

const PORT = 3000 || process.env.PORT

// Start the server
app.listen(PORT, () => console.log(`App is live on port ${PORT}`))

