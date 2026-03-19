// scripts/seedItems.js
// Run with: node scripts/seedItems.js

import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI
const DB_NAME = process.env.DB_NAME // e.g. 'packmate'

const packingItems = [
  {
    name: 'Thermal Underlayer',
    category: 'Clothing',
    climateTags: ['cold'],
    tripTypeTags: ['hiking', 'city', 'business'],
    isEssential: true,
  },
  {
    name: 'Winter Coat',
    category: 'Clothing',
    climateTags: ['cold'],
    tripTypeTags: ['city', 'business'],
    isEssential: true,
  },
  {
    name: 'Wool Socks (5 pairs)',
    category: 'Clothing',
    climateTags: ['cold'],
    tripTypeTags: ['hiking', 'city'],
    isEssential: true,
  },
  {
    name: 'Gloves & Scarf',
    category: 'Clothing',
    climateTags: ['cold'],
    tripTypeTags: ['city', 'hiking'],
    isEssential: false,
  },
  {
    name: 'Travel Adapter',
    category: 'Electronics',
    climateTags: ['tropical', 'cold', 'desert', 'mediterranean'],
    tripTypeTags: ['city', 'business', 'beach', 'hiking', 'backpacking'],
    isEssential: true,
  },
  {
    name: 'Swimsuit',
    category: 'Clothing',
    climateTags: ['tropical', 'mediterranean'],
    tripTypeTags: ['beach'],
    isEssential: true,
  },
  {
    name: 'Reef-Safe Sunscreen',
    category: 'Toiletries',
    climateTags: ['tropical', 'mediterranean'],
    tripTypeTags: ['beach'],
    isEssential: true,
  },
  {
    name: 'Waterproof Sandals',
    category: 'Footwear',
    climateTags: ['tropical', 'mediterranean'],
    tripTypeTags: ['beach'],
    isEssential: false,
  },
  {
    name: 'Hiking Boots',
    category: 'Footwear',
    climateTags: ['cold', 'desert', 'mediterranean'],
    tripTypeTags: ['hiking'],
    isEssential: true,
  },
  {
    name: 'Trekking Poles',
    category: 'Activity Gear',
    climateTags: ['cold', 'mediterranean'],
    tripTypeTags: ['hiking'],
    isEssential: false,
  },
  {
    name: 'First Aid Kit',
    category: 'Health & Safety',
    climateTags: ['tropical', 'cold', 'desert', 'mediterranean'],
    tripTypeTags: ['hiking', 'beach', 'backpacking'],
    isEssential: true,
  },
  {
    name: 'Passport & Copies',
    category: 'Documents',
    climateTags: ['tropical', 'cold', 'desert', 'mediterranean'],
    tripTypeTags: ['city', 'business', 'beach', 'hiking', 'backpacking'],
    isEssential: true,
  },
  {
    name: 'Travel Insurance Docs',
    category: 'Documents',
    climateTags: ['tropical', 'cold', 'desert', 'mediterranean'],
    tripTypeTags: ['city', 'business', 'beach', 'hiking', 'backpacking'],
    isEssential: true,
  },
  {
    name: 'Laptop & Charger',
    category: 'Electronics',
    climateTags: ['tropical', 'cold', 'desert', 'mediterranean'],
    tripTypeTags: ['business'],
    isEssential: true,
  },
  {
    name: 'Business Cards',
    category: 'Documents',
    climateTags: ['tropical', 'cold', 'desert', 'mediterranean'],
    tripTypeTags: ['business'],
    isEssential: false,
  },
  {
    name: 'Linen Shirts (3)',
    category: 'Clothing',
    climateTags: ['tropical', 'mediterranean'],
    tripTypeTags: ['beach', 'city'],
    isEssential: false,
  },
  {
    name: 'Insect Repellent',
    category: 'Toiletries',
    climateTags: ['tropical'],
    tripTypeTags: ['beach', 'hiking'],
    isEssential: true,
  },
  {
    name: 'Reusable Water Bottle',
    category: 'Activity Gear',
    climateTags: ['tropical', 'cold', 'desert', 'mediterranean'],
    tripTypeTags: ['hiking', 'city', 'beach', 'backpacking'],
    isEssential: true,
  },
  {
    name: 'Noise-Cancelling Headphones',
    category: 'Electronics',
    climateTags: ['tropical', 'cold', 'desert', 'mediterranean'],
    tripTypeTags: ['city', 'business', 'backpacking'],
    isEssential: false,
  },
  {
    name: 'Lightweight Rain Jacket',
    category: 'Clothing',
    climateTags: ['tropical', 'cold', 'mediterranean'],
    tripTypeTags: ['hiking', 'city', 'backpacking'],
    isEssential: true,
  },
  {
    name: 'Portable Power Bank',
    category: 'Electronics',
    climateTags: ['tropical', 'cold', 'desert', 'mediterranean'],
    tripTypeTags: ['city', 'hiking', 'backpacking'],
    isEssential: true,
  },
  {
    name: 'Packing Cubes (set)',
    category: 'Activity Gear',
    climateTags: ['tropical', 'cold', 'desert', 'mediterranean'],
    tripTypeTags: ['city', 'business', 'beach', 'hiking', 'backpacking'],
    isEssential: false,
  },
  {
    name: 'Quick-Dry Towel',
    category: 'Activity Gear',
    climateTags: ['tropical', 'mediterranean'],
    tripTypeTags: ['beach', 'backpacking'],
    isEssential: false,
  },
  {
    name: 'Prescription Medications',
    category: 'Health & Safety',
    climateTags: ['tropical', 'cold', 'desert', 'mediterranean'],
    tripTypeTags: ['city', 'business', 'beach', 'hiking', 'backpacking'],
    isEssential: true,
  },
  {
    name: 'Formal Dress Shoes',
    category: 'Footwear',
    climateTags: ['cold', 'mediterranean'],
    tripTypeTags: ['business'],
    isEssential: true,
  },
]

async function seed() {
  const client = new MongoClient(MONGO_URI)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db(DB_NAME)
    const collection = db.collection('items')

    // Check if already seeded to avoid duplicates
    const existing = await collection.countDocuments()
    if (existing > 0) {
      console.log(
        `⚠️  Collection already has ${existing} items. Skipping seed.`,
      )
      console.log('   To re-seed, drop the collection first:')
      console.log('   db.items.drop() in mongosh')
      return
    }

    const now = new Date()
    const docs = packingItems.map((item) => ({
      ...item,
      createdAt: now,
      updatedAt: now,
    }))

    const result = await collection.insertMany(docs)
    console.log(
      `🌱 Seeded ${result.insertedCount} packing items into 'items' collection.`,
    )
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    process.exit(1)
  } finally {
    await client.close()
  }
}

seed()
