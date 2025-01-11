const express = require('express')
const app = express()
const PORT = process.env.PORT || 9173

app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

app.listen(PORT, () => {
  console.log(`Pick it up! Ska-net is now skanking on http://localhost:${PORT}! 🎺 🎺 🎺 `)
})
