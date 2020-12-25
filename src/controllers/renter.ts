import Renter from '../models/owner'
import User from '../models/user'
import {MiddlewareFn} from '../types/express.d'

export const createRenter: MiddlewareFn = async (req, res, next) => {
  try {
    const {email, name}: {email: string; name: string} = req.body
    const {_id} = req.user
    const newRenter = new Renter({email, name})
    await newRenter.save()

    const newUser = new User({role: 'renter', _id, renter: newRenter._id})
    await newUser.save()

    return res.status(200).json({
      success: true,
      data: {
        email,
        name,
      },
    })
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Email or _id is existed',
      })
    }

    return res.status(400).json({
      success: false,
      error: error.errors[Object.keys(error.errors)[0]].message,
    })
  }
}
