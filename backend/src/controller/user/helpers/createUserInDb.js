import { getDb } from '../../../config/mongo.js'
import { hashPassword } from '../../../middleware/auth/hashPassword.js'
/**
 * Creates a new item in database
 */
export const createUserInDb = async (userData) => {
  const usersCollection = getDb().collection('users')

  const newUser = {
    name: userData.name,
    email: userData.email.toLowerCase(),
    password: await hashPassword(userData.password),
    homeCity: userData.homeCity,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await usersCollection.insertOne(newUser)
  return await usersCollection.findOne({ _id: result.insertedId })
}
