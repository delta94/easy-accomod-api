import Room from '../models/room'
import Bookmark from '../models/bookmark'
import {MiddlewareFn} from '../types/express'

export const createRoom: MiddlewareFn = async (req, res, next) => {
  try {
    const {_id} = req.user
    const newRoom = new Room({owner: _id, ...req.body})
    await newRoom.save()
    return res.status(200).json({
      success: true,
      data: req.body,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'Create room failed',
    })
  }
}

export const getRoomDetail: MiddlewareFn = async (req, res, next) => {
  try {
    const {room_id} = req.params
    const room = await Room.findOne({_id: room_id}).populate('owner')
    const {_id} = req.user
    if (_id !== '') {
      const bookmark = await Bookmark.findOne({renter: _id, room: room_id})
      if (bookmark) {
        return res.status(200).json({
          success: true,
          data: {room, is_bookmarked: true},
        })
      }
      return res.status(200).json({
        success: true,
        data: {room, is_bookmarked: false},
      })
    }

    return res.status(200).json({
      success: true,
      data: {room},
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get room failed',
    })
  }
}

export const getRoomsByCity: MiddlewareFn = async (req, res, next) => {
  const {city} = req.params
  try {
    const rooms = await Room.find({city, status: 'APPROVED'}).populate('owner')
    return res.status(200).json({
      success: true,
      data: rooms,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get rooms failed',
    })
  }
}

export const getPendingRooms: MiddlewareFn = async (req, res, next) => {
  try {
    const rooms = await Room.find({status: 'PENDING'}).populate('owner')
    return res.status(200).json({
      success: true,
      data: rooms,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get rooms failed',
    })
  }
}

export const approveRoom: MiddlewareFn = async (req, res, next) => {
  try {
    const {room_id} = req.params
    const room = await Room.findOne({_id: room_id})
    await room?.update({status: 'APPROVED'})
    return res.status(200).json({
      success: true,
      data: room,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get rooms failed',
    })
  }
}

export const rejectRoom: MiddlewareFn = async (req, res, next) => {
  try {
    const {room_id} = req.params
    const room = await Room.findOne({_id: room_id})
    await room?.update({status: 'REJECTED'})
    return res.status(200).json({
      success: true,
      data: room,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'get rooms failed',
    })
  }
}

export const updateRoom: MiddlewareFn = async (req, res, next) => {
  try {
    const {room_id} = req.params
    const room = await Room.findOne({_id: room_id})
    if (room?.status === 'APPROVED') {
      return res.status(400).json({
        success: false,
        error: 'Not allow to edit room info',
      })
    }
    if (room?.status === 'NONE') {
      await room.update({...req.body})
      if (room) {
        return res.status(200).json({
          success: true,
          data: {...room, ...req.body},
        })
      }
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      error: 'update failed',
    })
  }
}
