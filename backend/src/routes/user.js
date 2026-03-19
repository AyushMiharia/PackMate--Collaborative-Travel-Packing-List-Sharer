import express from 'express'
import trimRequest from 'trim-request'
import { createUser, getUsers } from '../controller/user/index.js'
import { updateUser } from '../controller/user/updateUser.js'
import passport from 'passport'

const router = express.Router()

const requieAuth = passport.authenticate('jwt', { session: false })

router.get('/', trimRequest.all, getUsers)
router.post('/', trimRequest.all, createUser)
router.put('/', requieAuth, trimRequest.all, updateUser)

export default router
