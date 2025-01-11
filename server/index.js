const express = require('express')
const cors = require('cors')
require('dotenv').config()

const routes = require('./router')
const app = express()
const PORT = process.env.PORT || 9173

// Enable CORS for requests from localhost:5173
app.use(cors({
  origin: 'http://localhost:5173'
}))

app.use(express.json())
app.use(routes)

app.listen(PORT, () => {
  console.log(`Pick it up! Ska-net is now skanking on http://localhost:${PORT} 🎺 🎺 🎺 `)
})
