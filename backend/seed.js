import { MongoClient } from 'mongodb'
import crypto from 'crypto'
import 'dotenv/config'

const client = new MongoClient(process.env.MONGO_URI)

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// ------------------ CONSTANTS ------------------

const tripTypes = [
  'beach',
  'hiking',
  'city',
  'winter',
  'business',
  'backpacking',
]
const climates = ['tropical', 'cold', 'dry', 'temperate']
const luggageTypes = ['carry-on', 'backpack', 'checked']
const tripStatuses = ['planning', 'ongoing', 'completed']

const destinations = [
  'Paris',
  'Tokyo',
  'New York',
  'Bali',
  'Sydney',
  'Rome',
  'Dubai',
  'Bangkok',
]

const homeCities = [
  'Boston',
  'New York',
  'Chicago',
  'Los Angeles',
  'Seattle',
  'Austin',
  'Miami',
  'Denver',
]

const firstNames = [
  'Sarah',
  'Marcus',
  'Priya',
  'Alex',
  'Jordan',
  'Taylor',
  'Morgan',
  'Casey',
  'Riley',
  'Jamie',
  'Chris',
  'Sam',
  'Drew',
  'Blake',
  'Quinn',
]

const lastNames = [
  'Chen',
  'Lee',
  'Patel',
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Wilson',
  'Moore',
  'Taylor',
  'Anderson',
]

const tipTexts = {
  beach: ['Pack sunscreen', 'Use dry bag', 'Bring flip flops'],
  hiking: ['Carry water', 'Use trekking poles', 'Wear wool socks'],
  city: ['Use crossbody bag', 'Carry charger', 'Wear comfy shoes'],
  winter: ['Wear layers', 'Use hand warmers', 'Carry lip balm'],
  business: ['Carry blazer', 'Keep documents', 'Use laptop stand'],
  backpacking: ['Pack light', 'Use hostel locks', 'Carry power bank'],
}

// ------------------ SEED FUNCTION ------------------

async function seed() {
  try {
    await client.connect()
    const db = client.db(process.env.DB_NAME)

    console.log('Clearing database...')
    await Promise.all([
      db.collection('users').deleteMany({}),
      db.collection('trips').deleteMany({}),
      db.collection('communityTips').deleteMany({}),
    ])

    // ------------------ USERS (200) ------------------
    const users = []

    for (let i = 0; i < 200; i++) {
      const first = firstNames[Math.floor(Math.random() * firstNames.length)]
      const last = lastNames[Math.floor(Math.random() * lastNames.length)]

      users.push({
        name: `${first} ${last}`,
        email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
        password: hashPassword('password123'),
        homeCity: homeCities[Math.floor(Math.random() * homeCities.length)],
        createdAt: new Date(),
      })
    }

    await db.collection('users').insertMany(users)
    const userEmails = users.map((u) => u.email)

    console.log('Inserted 200 users')

    // ------------------ TRIPS (1000) ------------------
    const trips = []

    for (let i = 0; i < 1000; i++) {
      const email = userEmails[Math.floor(Math.random() * userEmails.length)]

      const destination =
        destinations[Math.floor(Math.random() * destinations.length)]

      const startDate = new Date(
        Date.now() + Math.floor(Math.random() * 10000000000),
      )

      const duration = Math.floor(Math.random() * 10) + 2
      const endDate = new Date(startDate.getTime() + duration * 86400000)

      const tripType = tripTypes[Math.floor(Math.random() * tripTypes.length)]

      trips.push({
        email, // ✅ matches your schema
        tripName: `${destination} Trip`,
        destination,
        climate: climates[Math.floor(Math.random() * climates.length)],
        tripType,
        durationDays: duration,
        luggageType:
          luggageTypes[Math.floor(Math.random() * luggageTypes.length)],
        startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD
        endDate: endDate.toISOString().split('T')[0],
        status: tripStatuses[Math.floor(Math.random() * tripStatuses.length)],
        items: [], // ✅ as per your schema
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    await db.collection('trips').insertMany(trips)
    console.log('Inserted 1000 trips')

    // ------------------ COMMUNITY TIPS (800) ------------------
    const tips = []

    for (let i = 0; i < 800; i++) {
      const email = userEmails[Math.floor(Math.random() * userEmails.length)]

      const tripType = tripTypes[Math.floor(Math.random() * tripTypes.length)]

      const tipList = tipTexts[tripType]

      tips.push({
        email,
        title: `${tripType} travel tip`,
        description: tipList[Math.floor(Math.random() * tipList.length)],
        tripTypeTags: [tripType],
        climateTags: [climates[Math.floor(Math.random() * climates.length)]],
        upvoteCount: Math.floor(Math.random() * 200),
        isVerified: Math.random() > 0.8,
        isFeatured: Math.random() > 0.9,
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 10000000000),
        ),
      })
    }

    await db.collection('communityTips').insertMany(tips)
    console.log('Inserted 800 community tips')

    // ------------------ INDEXES ------------------
    await db.collection('users').createIndex({ email: 1 }, { unique: true })
    await db.collection('trips').createIndex({ email: 1 })
    await db.collection('communityTips').createIndex({ email: 1 })

    console.log('Indexes created')

    console.log('✅ Seeding Complete!')
    console.log('Total Records: 2000')
  } catch (err) {
    console.error('❌ Seeding failed:', err)
  } finally {
    await client.close()
  }
}

seed()
