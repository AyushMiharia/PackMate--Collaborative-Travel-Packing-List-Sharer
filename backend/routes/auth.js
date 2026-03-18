import express from 'express'
import { getDB } from '../db/conn.js'
import { hashPassword, verifyPassword } from '../middleware/auth.js'

const router = express.Router()

// POST signup
router.post('/signup', async (req, res) => {
  try {
    const db = getDB()
    const { name, email, password, homeCity } = req.body

    // Check if email already exists
    const existing = await db.collection('users').findOne({ email })
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    const newUser = {
      name,
      email,
      passwordHash: hashPassword(password),
      homeCity,
      submittedTips: [],
      upvotedTips: [],
      createdAt: new Date(),
    }

    const result = await db.collection('users').insertOne(newUser)
    res.status(201).json({ message: 'User created', userId: result.insertedId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST login
router.post('/login', async (req, res) => {
  try {
    const db = getDB()
    const { email, password } = req.body

    const user = await db.collection('users').findOne({ email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid password' })
    }

    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        homeCity: user.homeCity,
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' })
})

export default router
