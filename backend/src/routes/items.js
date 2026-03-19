import express from 'express'
import { ObjectId } from 'mongodb'
import { getDb } from '../config/mongo.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const db = getDb()
    const items = await db.collection('items').find({}).toArray()
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid item id' })
    }
    const db = getDb()
    const item = await db
      .collection('items')
      .findOne({ _id: new ObjectId(req.params.id) })
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.json(item)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
