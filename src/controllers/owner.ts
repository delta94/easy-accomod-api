import Owner from '../models/owner'
import User from '../models/user'
import {MiddlewareFn} from '../types/express.d'

export const createOwner: MiddlewareFn = async (req, res, next) => {
  try {
    const {
      email,
      identity,
      name,
      address,
      phone,
    }: {email: string; identity: string; name: string; address: string; phone: string} = req.body
    const {_id} = req.user
    const newOwner = new Owner({email, identity, name, address, phone})
    await newOwner.save()

    const newUser = new User({role: 'owner', _id, owner: newOwner._id})
    await newUser.save()

    return res.status(200).json({
      success: true,
      data: {
        email,
        identity,
        name,
        address,
        phone,
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
