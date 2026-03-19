import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { ObjectId } from 'mongodb'
import { decrypt } from '../middleware/auth/dcrypt.js'
import { getDb } from '../config/mongo.js'

const cookieExtractor = (req) => {
  let token = null
  if (req && req.cookies.authToken) {
    token = req.cookies.authToken
  }
  if (token) {
    // Decrypts token
    token = decrypt(token)
  }
  return token
}

/**
 * Options object for jwt middleware
 */
const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET || 'SecretKey123',
}

/**
 * Login with JWT middleware
 */
const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const db = getDb()
    const usersCollection = db.collection('users')

    const user = await usersCollection.findOne({
      _id: new ObjectId(payload.data._id),
    })

    if (!user) {
      return done(null, false)
    }

    return done(null, user)
  } catch (err) {
    return done(err, false)
  }
})

passport.use(jwtLogin)
