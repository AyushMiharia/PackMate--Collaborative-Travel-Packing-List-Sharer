import express from 'express'
import { getDb as getDB } from '../config/mongo.js'
import { ObjectId } from 'mongodb'

const router = express.Router()

// GET all tips (optionally filter by tripType)
router.get('/', async (req, res) => {
  try {
    const db = getDB()
    const filter = req.query.tripType
      ? { tripTypeTags: req.query.tripType }
      : {}
    const tips = await db.collection('communityTips').find(filter).toArray()
    res.json(tips)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single tip
router.get('/:id', async (req, res) => {
  try {
    const db = getDB()
    const tip = await db
      .collection('communityTips')
      .findOne({ _id: new ObjectId(req.params.id) })
    if (!tip) return res.status(404).json({ error: 'Tip not found' })
    res.json(tip)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create tip
router.post('/', async (req, res) => {
  try {
    const db = getDB()
    const newTip = {
      title: req.body.title || '',
      description: req.body.description || req.body.tip,
      authorId: req.body.authorId || null,
      tripTypeTags: [req.body.tripType],
      climateTags: req.body.climateTags || [],
      upvoteCount: 0,
      upvotedBy: [],
      isVerified: false,
      isFeatured: false,
      createdAt: new Date(),
    }
    const result = await db.collection('communityTips').insertOne(newTip)
    res.status(201).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update tip
router.put('/:id', async (req, res) => {
  try {
    const db = getDB()
    const result = await db
      .collection('communityTips')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH upvote a tip
router.patch('/:id/upvote', async (req, res) => {
  try {
    const db = getDB()
    const result = await db
      .collection('communityTips')
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $inc: { upvoteCount: 1 } },
      )
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE tip
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB()
    const result = await db
      .collection('communityTips')
      .deleteOne({ _id: new ObjectId(req.params.id) })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
