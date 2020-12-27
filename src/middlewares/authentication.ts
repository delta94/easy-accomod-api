import admin from '../firebase/admin'
import {MiddlewareFn} from '../types/express.d'
import User from '../models/user'

export const checkAuth: MiddlewareFn = async (req, res, next) => {
  let token = req.headers.authorization
  if (token) {
    admin
      .auth()
      .verifyIdToken(token)
      .then(async (decodedToken) => {
        try {
          const schema = await User.findOne({_id: decodedToken.uid})
          console.log(schema)

          const user = await User.findOne({_id: decodedToken.uid}).populate(schema?.role)
          req.user = {role: user?.role, uid: decodedToken.uid, ...user?.get(user.role)._doc}
          next()
        } catch (error) {
          console.log(error)
        }
      })
      .catch(() => {
        res.status(403).json({
          success: false,
          error: 'Unauthorized',
        })
      })
  } else {
    res.status(403).json({
      success: false,
      error: 'Unauthorized',
    })
  }
}

export const getUID: MiddlewareFn = async (req, res, next) => {
  let token = req.headers.authorization
  if (token) {
    admin
      .auth()
      .verifyIdToken(token)
      .then(async (decodedToken) => {
        req.user = {uid: decodedToken.uid}
        next()
      })
      .catch(() => {
        res.status(403).json({
          success: false,
          error: 'Unauthorized',
        })
      })
  } else {
    res.status(403).json({
      success: false,
      error: 'Unauthorized',
    })
  }
}

export const checkAdmin: MiddlewareFn = async (req, res, next) => {
  const {user} = req
  if (user.role === 'admin') {
    next()
  } else {
    res.status(403).json({
      success: false,
      error: 'Not allow',
    })
  }
}

export const checkOwner: MiddlewareFn = async (req, res, next) => {
  const {user} = req
  if (user.role === 'owner') {
    next()
  } else {
    res.status(403).json({
      success: false,
      error: 'Not allow',
    })
  }
}
