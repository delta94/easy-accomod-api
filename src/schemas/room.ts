import {Schema, Document} from 'mongoose'

export interface RoomDocument extends Document {
  owner: Schema.Types.ObjectId
  reviews: [Schema.Types.ObjectId]
  roomType: string
  roomQuantity: number
  area: number
  city: string
  detailAddress: string
  locationAround?: [string]
  bathroomType: string
  kitchenType: string
  hasWaterHeater: boolean
  hasConditioner: boolean
  hasBalcony: boolean
  hasFridge: boolean
  hasBed: boolean
  hasWardrobe: boolean
  roomPrice: number
  waterPrice: number
  electricityPrice: number
  images: [string]
  isWithOwner: boolean
  isExpired: boolean
  expiredDate: Date
  views: number
  isRent: boolean
  status: string
  isActive: boolean
}

const RoomSchema: Schema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Owner',
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  roomType: {
    type: String,
    required: [true, 'room type is required'],
    enum: ['MOTEL', 'APARTMENT', 'WHOLE_HOUSE', 'WHOLE_APARTMENT'],
  },
  roomQuantity: {
    type: Number,
    required: false,
    default: 1,
  },
  area: {
    type: Number,
    required: [true, 'area is required'],
  },
  city: {
    type: String,
    required: [true, 'city is required'],
  },
  detailAddress: {
    type: String,
    required: [true, 'detail address is required'],
  },
  locationAround: {
    type: [String],
    required: false,
  },
  bathroomType: {
    type: String,
    required: [true, 'bathroom type is required'],
    enum: ['PRIVATE', 'SHARED'],
  },
  kitchenType: {
    type: String,
    required: [true, 'kitchen type is required'],
    enum: ['PRIVATE', 'SHARED', 'NONE'],
  },
  hasWaterHeater: {
    type: Boolean,
    required: [true, 'hasWaterHeater is required'],
    enum: [true, false],
    default: false,
  },
  hasConditioner: {
    type: Boolean,
    required: [true, 'hasConditioner is required'],
    enum: [true, false],
    default: false,
  },
  hasBalcony: {
    type: Boolean,
    required: [true, 'hasBalcony is required'],
    enum: [true, false],
    default: false,
  },
  hasFridge: {
    type: Boolean,
    required: [true, 'hasFridge is required'],
    enum: [true, false],
    default: false,
  },
  hasBed: {
    type: Boolean,
    required: [true, 'hasBed is required'],
    enum: [true, false],
    default: false,
  },
  hasWardrobe: {
    type: Boolean,
    required: [true, 'hasWardrobe is required'],
    enum: [true, false],
    default: false,
  },
  roomPrice: {
    type: Number,
    required: [true, 'roomPrice is required'],
  },
  waterPrice: {
    type: Number,
    required: [true, 'waterPrice is required'],
  },
  electricityPrice: {
    type: Number,
    required: [true, 'electricityPrice is required'],
  },
  images: {
    type: [String],
    required: [true, 'images is required'],
    validate: {
      validator(v: [string]) {
        return v.length >= 3
      },
      message: () => `minimum is 3 images`,
    },
  },
  isWithOwner: {
    type: Boolean,
    required: [true, 'isWithOwner is required'],
  },
  isExpired: {
    type: Boolean,
    required: [true, 'isExpired is required'],
    enum: [true, false],
    default: true,
  },
  expiredDate: {
    type: Date,
    required: [true, 'expiredDate is required'],
    default: Date.now(),
  },
  views: {
    type: Number,
    required: [true, 'views is required'],
    default: 0,
  },
  isRent: {
    type: Boolean,
    required: [true, 'isRent is required'],
    default: false,
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['APPROVED', 'REJECTED', 'PENDING'],
    default: 'PENDING',
  },
  isActive: {
    type: String,
    required: [true, 'isActive is required'],
    enum: [true, false],
    default: true,
  },
})

export default RoomSchema
