import { STATUS_CODE } from '../../constant/statusCode.js'
import { handleError } from '../../utils/handleError.js'
import { updateUserInDb } from './helpers/updateUserInDB.js'

const updateUser = async (req, res) => {
  try {
    const { email } = req.user
    const item = await updateUserInDb(email, req.body)
    res.status(STATUS_CODE.CREATED).json(item)
  } catch (error) {
    console.log('Error updating user:', error)
    handleError(res, error)
  }
}

export { updateUser }
