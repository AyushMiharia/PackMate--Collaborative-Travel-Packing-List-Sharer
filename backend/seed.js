import { MongoClient } from 'mongodb'
import crypto from 'crypto'
import 'dotenv/config'

const client = new MongoClient(process.env.MONGO_URI)

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

const tripTypes = ['beach', 'hiking', 'city', 'winter', 'business']
const climates = ['tropical', 'cold', 'dry', 'temperate']
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

const tipTexts = {
  beach: [
    'Always pack reef-safe sunscreen to protect coral reefs.',
    'A dry bag is essential for keeping your phone safe near water.',
    'Pack a microfiber towel — it dries fast and takes up no space.',
    'Bring water shoes for rocky beaches.',
    'A rashguard saves you from sunburn during long swim days.',
    'Pack extra ziplock bags for wet swimsuits.',
    'Flip flops are a must but bring one pair of sneakers too.',
    'Aloe vera gel is a lifesaver after a long beach day.',
  ],
  hiking: [
    'Merino wool socks prevent blisters better than cotton.',
    'A headlamp is essential even for day hikes — emergencies happen.',
    'Pack more water than you think you need.',
    'Trekking poles save your knees on steep descents.',
    'A lightweight rain jacket packs small but saves trips.',
    'Always carry a basic first aid kit on trails.',
    'Bring high-calorie snacks like trail mix and energy bars.',
    'Break in new hiking boots before your trip.',
  ],
  city: [
    'A crossbody bag is safer than a backpack in crowded cities.',
    'Download offline maps before you arrive.',
    'Pack a portable phone charger for long days of sightseeing.',
    'Comfortable walking shoes are more important than stylish ones.',
    'A light scarf doubles as a shawl for visiting religious sites.',
    'Always carry a small amount of local cash.',
    'Pack a reusable water bottle to save money and plastic.',
    'A travel umbrella fits in any bag and saves you constantly.',
  ],
  winter: [
    'Layer with moisture-wicking base layers, not just thick sweaters.',
    'Hand warmers are cheap and take up almost no space.',
    'Waterproof boots matter more than warm boots in wet snow.',
    'A balaclava protects your face in extreme cold.',
    'Pack lip balm and moisturizer — cold air dries out your skin fast.',
    'Thermal underlayers let you pack fewer bulky sweaters.',
    'Wool socks are warmer than synthetic ones in wet conditions.',
    "Don't forget a hat — you lose most heat through your head.",
  ],
  business: [
    'Pack a wrinkle-release spray to keep shirts looking fresh.',
    'A universal power adapter is non-negotiable for international trips.',
    'Keep all your important documents in one travel wallet.',
    'Pack a spare dress shirt in your carry-on in case luggage is lost.',
    'Noise-cancelling headphones make long flights productive.',
    'A lightweight blazer works for meetings and dinners alike.',
    "Carry business cards even if you think you won't need them.",
    'Pack a portable laptop stand for better ergonomics in hotels.',
  ],
}

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

async function seed() {
  try {
    await client.connect()
    const db = client.db(process.env.DB_NAME)

    // Clear existing data
    await db.collection('users').deleteMany({})
    await db.collection('communityTips').deleteMany({})
    console.log('Cleared existing users and communityTips')

    // Seed 200 users
    const users = []
    for (let i = 0; i < 200; i++) {
      const firstName =
        firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      users.push({
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        passwordHash: hashPassword('password123'),
        homeCity: homeCities[Math.floor(Math.random() * homeCities.length)],
        submittedTips: [],
        upvotedTips: [],
        createdAt: new Date(),
      })
    }
    const insertedUsers = await db.collection('users').insertMany(users)
    console.log(`Inserted ${users.length} users`)

    // Seed 800 community tips
    const tips = []
    const userIds = Object.values(insertedUsers.insertedIds)

    for (let i = 0; i < 800; i++) {
      const tripType = tripTypes[Math.floor(Math.random() * tripTypes.length)]
      const tipOptions = tipTexts[tripType]
      const tip = tipOptions[Math.floor(Math.random() * tipOptions.length)]
      const authorId = userIds[Math.floor(Math.random() * userIds.length)]

      tips.push({
        title: `${tripType.charAt(0).toUpperCase() + tripType.slice(1)} Tip`,
        description: tip,
        authorId,
        tripTypeTags: [tripType],
        climateTags: [climates[Math.floor(Math.random() * climates.length)]],
        upvoteCount: Math.floor(Math.random() * 100),
        upvotedBy: [],
        isVerified: Math.random() > 0.8,
        isFeatured: Math.random() > 0.9,
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 10000000000),
        ),
      })
    }
    await db.collection('communityTips').insertMany(tips)
    console.log(`Inserted ${tips.length} community tips`)

    console.log(
      'Seeding complete! Total records: ' + (users.length + tips.length),
    )
  } catch (err) {
    console.error('Seeding failed', err)
  } finally {
    await client.close()
  }
}

seed()
