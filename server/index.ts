import express, { Application } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './router.js'

dotenv.config()

const app: Application = express()
const PORT: number = parseInt(process.env.PORT as string, 10) || 9173

app.use(cors({
  origin: 'http://localhost:5173'
}))

app.use(express.json())
app.use(router)

app.listen(PORT, () => {
  console.log(`Pick it up! Ska-net is now skanking on http://localhost:${PORT} 🎺 🎺 🎺 `)
})
