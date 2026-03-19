import { getDb } from '../../../config/mongo.js'
/**
 * Creates a new item in database
 */
const updateUserInDb = async (userEmail, userData) => {
  const usersCollection = getDb().collection('users')

  await usersCollection.updateOne({ email: userEmail }, { $set: userData })

  return await usersCollection.findOne({ email: userEmail })
}

export { updateUserInDb }
