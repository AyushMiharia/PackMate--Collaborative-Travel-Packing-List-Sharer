import express from 'express'
import { connectDB } from './db/conn.js'
import userRoutes from './routes/users.js'
import communityTipsRoutes from './routes/communityTips.js'
import authRoutes from './routes/auth.js'
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/communityTips', communityTipsRoutes)
app.use('/api/auth', authRoutes)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})
