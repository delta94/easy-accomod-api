import {Schema, Document} from 'mongoose'

export interface BookmarkDocument extends Document {
  renter: Schema.Types.ObjectId
  room: Schema.Types.ObjectId
}

const BookmarkSchema: Schema = new Schema({
  renter: {
    type: Schema.Types.ObjectId,
    required: [true, 'renter is required'],
    ref: 'Renter',
  },
  room: {
    type: Schema.Types.ObjectId,
    required: [true, 'room is required'],
    ref: 'Room',
  },
})

export default BookmarkSchema
