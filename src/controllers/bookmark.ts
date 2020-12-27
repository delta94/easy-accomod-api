import Bookmark from '../models/bookmark'
import {MiddlewareFn} from '../types/express.d'

export const createBookmark: MiddlewareFn = async (req, res, next) => {
  try {
    const {_id} = req.user
    const {roomId} = req.body
    const newBookmark = new Bookmark({renter: _id, room: roomId})
    await newBookmark.save()
    return res.status(200).json({
      success: true,
      data: {renter: _id, room: roomId},
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'create bookmark failed',
    })
  }
}

export const removeBookmark: MiddlewareFn = async (req, res, next) => {
  try {
    const {_id} = req.user
    const {bookmarkId} = req.body
    const bookmark = await Bookmark.findOne({_id: bookmarkId})
    if (bookmark?.renter === _id) {
      bookmark?.remove()
      return res.status(200).json({
        success: true,
        data: 'Delete bookmark successfully',
      })
    }
    return res.status(400).json({
      success: false,
      error: 'Not allow to remove bookmark',
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'create bookmark failed',
    })
  }
}

export const getAllBookmarks: MiddlewareFn = async (req, res, next) => {
  try {
    const {_id} = req.user
    const bookmarks = Bookmark.find({renter: _id}).populate('room')
    return res.status(200).json({
      success: true,
      data: bookmarks,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get bookmarks failed',
    })
  }
}
