import {Schema, Document} from 'mongoose'

export interface UserDocument extends Document {
  _id: string
  role: string
  user?: Schema.Types.ObjectId
  renter?: Schema.Types.ObjectId
  owner?: Schema.Types.ObjectId
}

const UserSchema: Schema = new Schema({
  _id: {
    type: String,
    required: [true, '_id is required'],
  },
  role: {
    type: String,
    required: [true, 'isActive is required'],
    enum: ['admin', 'renter', 'owner'],
  },
  admin: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Admin',
  },
  renter: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Renter',
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Owner',
  },
})

export default UserSchema
