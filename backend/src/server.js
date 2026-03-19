import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import http from 'http'
import express from 'express'
import passport from 'passport'
import initMongo from './config/mongo.js'
import './config/passport.js'
import router from './routes/index.js'
import { serverConnectionLog } from './utils/serverStartLog.js'
import { configDotenv } from 'dotenv'

configDotenv()

const app = express()

/**
 * -------------------------- Cors --------------------------
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }),
)
/**
 * -------------------------- EXPRESS --------------------------
 */
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/**
 * -------------------------- PASSPORT --------------------------
 */
app.use(passport.initialize())

/**
 * -------------------------- LOGGER --------------------------
 */
app.use(morgan('dev'))

/**
 * -------------------------- COOKIE PARSER --------------------------
 */
app.use(cookieParser())

/**
 * -------------------------- ROUTES --------------------------
 */
app.use('/', router)

/**
 *  -------------------------- Global error handler--------------------------
 */
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  })
})

/**
 * -------------------------- HTTP SERVER --------------------------
 */
const server = http.createServer(app)

/**
 * -------------------------- APP START --------------------------
 */
const APPSERVER = async () => {
  try {
    await initMongo()

    server.listen(process.env.PORT || 5000, () => {
      serverConnectionLog()
    })
  } catch (err) {
    console.error('Server startup error:', err)
    process.exit(1)
  }
}

APPSERVER()

/**
 * -------------------------- PROCESS SAFETY --------------------------
 */
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason)
  process.exit(1)
})

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})

export default app
