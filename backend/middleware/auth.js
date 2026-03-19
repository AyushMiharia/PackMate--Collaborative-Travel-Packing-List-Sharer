import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import crypto from 'crypto'
import { getDB } from '../db/conn.js'
import { ObjectId } from 'mongodb'

export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export function verifyPassword(password, hash) {
  return hashPassword(password) === hash
}

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const db = getDB()
        const user = await db.collection('users').findOne({ email })
        if (!user) {
          return done(null, false, { message: 'User not found' })
        }
        if (!verifyPassword(password, user.passwordHash)) {
          return done(null, false, { message: 'Invalid password' })
        }
        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user._id.toString())
})

passport.deserializeUser(async (id, done) => {
  try {
    const db = getDB()
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(id) })
    done(null, user)
  } catch (err) {
    done(err)
  }
})

export default passport