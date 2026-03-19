import express from 'express'
import session from 'express-session'
import { connectDB } from './db/conn.js'
import userRoutes from './routes/users.js'
import communityTipsRoutes from './routes/communityTips.js'
import authRoutes from './routes/auth.js'
import tripRoutes from './routes/trips.js'
import packingItemRoutes from './routes/packingItems.js'
import passport from './middleware/auth.js'
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'packmate_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/users', userRoutes)
app.use('/api/communityTips', communityTipsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/trips', tripRoutes)
app.use('/api/packingItems', packingItemRoutes)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})
