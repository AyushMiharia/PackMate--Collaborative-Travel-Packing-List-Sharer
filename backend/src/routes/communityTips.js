import express from 'express'
import { ObjectId } from 'mongodb'
import { getDb as getDB } from '../config/mongo.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const db = getDB()
    const filter = {}
    if (req.query.tripType) filter.tripTypeTags = req.query.tripType
    if (req.query.climate) filter.climateTags = req.query.climate
    const tips = await db.collection('communityTips').find(filter).toArray()
    res.json(tips)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

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

router.post('/', async (req, res) => {
  try {
    const db = getDB()
    const newTip = {
      email: req.body.email || null,
      title: req.body.title || '',
      description: req.body.description || req.body.tip,
      authorId: req.body.authorId || null,
      tripTypeTags: Array.isArray(req.body.tripTypeTags)
        ? req.body.tripTypeTags
        : [req.body.tripType],
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

router.post('/:id/upvote', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email required' })
    const db = getDB()
    const tip = await db
      .collection('communityTips')
      .findOne({ _id: new ObjectId(req.params.id) })
    if (!tip) return res.status(404).json({ error: 'Tip not found' })
    if (tip.upvotedBy?.includes(email)) {
      return res.status(400).json({ error: 'Already upvoted' })
    }
    const result = await db
      .collection('communityTips')
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $inc: { upvoteCount: 1 }, $addToSet: { upvotedBy: email } },
      )
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id/upvote', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email required' })
    const db = getDB()
    const tip = await db
      .collection('communityTips')
      .findOne({ _id: new ObjectId(req.params.id) })
    if (!tip) return res.status(404).json({ error: 'Tip not found' })
    if (!tip.upvotedBy?.includes(email)) {
      return res.status(400).json({ error: 'Not upvoted' })
    }
    const result = await db
      .collection('communityTips')
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $inc: { upvoteCount: -1 }, $pull: { upvotedBy: email } },
      )
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

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
