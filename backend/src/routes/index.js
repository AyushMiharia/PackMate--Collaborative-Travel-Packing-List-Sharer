import express from 'express'
import authRouter from './auth.js'
import createUser from './user.js'
import tripRouter from './trips.js'
import itemsRouter from './items.js'
import tipsRouter from './communityTips.js'

const router = express.Router()

router.use('/api/auth', authRouter)
router.use('/api/user', createUser)
router.use('/api/trips', tripRouter)
router.use('/api/tips', tipsRouter)
router.use('/api/items', itemsRouter)

router.get('/test', (req, res) => {
  try {
    console.log('API is working')
    res.status(200).json({ message: 'API is working' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
