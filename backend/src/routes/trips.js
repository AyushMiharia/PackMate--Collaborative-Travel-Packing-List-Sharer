import express from 'express'
import { ObjectId } from 'mongodb'
import passport from 'passport'
import { getDb } from '../config/mongo.js'

const router = express.Router()
const requieAuth = passport.authenticate('jwt', { session: false })

router.get('/', async (req, res) => {
  try {
    const db = getDb()
    const trips = await db.collection('trips').find({}).toArray()
    res.json(trips)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/my-trips', requieAuth, async (req, res) => {
  try {
    const db = getDb()
    const trips = await db
      .collection('trips')
      .find({ email: req.user.email })
      .toArray()
    res.json(trips)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid trip id' })
    }

    const db = getDb()
    const trip = await db
      .collection('trips')
      .findOne({ _id: new ObjectId(req.params.id) })

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' })
    }

    res.json(trip)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', requieAuth, async (req, res) => {
  try {
    const {
      tripName,
      destination,
      climate,
      tripType,
      luggageType,
      durationDays,
      startDate,
      endDate,
      status,
    } = req.body

    if (!tripName || !destination || !climate || !tripType) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const db = getDb()

    const newTrip = {
      email: req.user.email,
      tripName: tripName.trim(),
      destination: destination.trim(),
      climate,
      tripType,
      luggageType: luggageType || '',
      durationDays: Number(durationDays) || 0,
      startDate: startDate || null,
      endDate: endDate || null,
      status: status || 'upcoming',
      items: [],

      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection('trips').insertOne(newTrip)
    const createdTrip = await db
      .collection('trips')
      .findOne({ _id: result.insertedId })

    res.status(201).json(createdTrip)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid trip id' })
    }

    const {
      tripName,
      destination,
      climate,
      tripType,
      luggageType,
      durationDays,
      startDate,
      endDate,
      status,
    } = req.body

    const updatedFields = {
      ...(tripName && { tripName: tripName.trim() }),
      ...(destination && { destination: destination.trim() }),
      ...(climate && { climate }),
      ...(tripType && { tripType }),
      ...(luggageType !== undefined && { luggageType }),
      ...(durationDays !== undefined && {
        durationDays: Number(durationDays),
      }),
      ...(startDate !== undefined && { startDate }),
      ...(endDate !== undefined && { endDate }),
      ...(status && { status }),
      updatedAt: new Date(),
    }

    const db = getDb()

    const result = await db
      .collection('trips')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updatedFields })

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Trip not found' })
    }

    const trip = await db
      .collection('trips')
      .findOne({ _id: new ObjectId(req.params.id) })

    res.json(trip)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid trip id' })
    }

    const db = getDb()

    const result = await db
      .collection('trips')
      .deleteOne({ _id: new ObjectId(req.params.id) })

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Trip not found' })
    }

    res.json({ message: 'Trip deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.patch('/:id/items', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid trip id' })
    }

    const db = getDb()

    const item = {
      itemId: req.body.itemId ? new ObjectId(req.body.itemId) : null,
      isChecked: false,
      isCustom: req.body.isCustom || false,
      customName: req.body.customName || '',
    }

    const result = await db.collection('trips').updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $push: { items: item },
        $set: { updatedAt: new Date() },
      },
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Trip not found' })
    }

    res.json({ message: 'Item added' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.patch('/:id/items/:itemIndex', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid trip id' })
    }

    const index = parseInt(req.params.itemIndex, 10)

    if (isNaN(index)) {
      return res.status(400).json({ error: 'Invalid item index' })
    }

    const db = getDb()

    const result = await db.collection('trips').updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          [`items.${index}.isChecked`]: req.body.isChecked,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Trip not found' })
    }

    res.json({ message: 'Item updated' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id/items/:itemIndex', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid trip id' })
    }

    const db = getDb()

    const trip = await db
      .collection('trips')
      .findOne({ _id: new ObjectId(req.params.id) })

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' })
    }

    const index = parseInt(req.params.itemIndex, 10)

    if (isNaN(index) || index < 0 || index >= trip.items.length) {
      return res.status(400).json({ error: 'Invalid item index' })
    }

    trip.items.splice(index, 1)

    await db.collection('trips').updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          items: trip.items,
          updatedAt: new Date(),
        },
      },
    )

    res.json({ message: 'Item removed' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id/progress', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid trip id' })
    }

    const db = getDb()

    const trip = await db
      .collection('trips')
      .findOne({ _id: new ObjectId(req.params.id) })

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' })
    }

    const totalItems = trip.items.length
    const checkedItems = trip.items.filter((i) => i.isChecked).length

    const completionPercentage =
      totalItems === 0 ? 0 : Math.round((checkedItems / totalItems) * 100)

    res.json({
      totalItems,
      checkedItems,
      completionPercentage,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
