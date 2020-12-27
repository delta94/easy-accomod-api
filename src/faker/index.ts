import * as dotenv from 'dotenv'
import mongoose from 'mongoose'
import faker from 'faker'
import admin from '../firebase/admin'
import Admin from '../models/admin'
import Owner from '../models/owner'
import Renter from '../models/renter'
import User from '../models/user'
import Room from '../models/room'

dotenv.config()

const {DB_USERNAME, DB_PASSWORD, DB_NAME} = process.env
const MONGODB_URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.3ukly.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('Database connected ...'))
  .catch((error) => console.log('Could not connect to database ...', error.message))

const cities = ['hanoi', 'hcm', 'vungtau', 'dalat', 'danang', 'nhatrang', 'quangninh', 'hoian']
const roomTypes = ['MOTEL', 'APARTMENT', 'WHOLE_HOUSE', 'WHOLE_APARTMENT']
const bathroomTypes = ['PRIVATE', 'SHARED']
const kitchenTypes = ['PRIVATE', 'SHARED', 'NONE']
admin
  .auth()
  .createUser({
    email: 'admin@gmail.com',
    password: '123456',
  })
  .then(async (userRecord) => {
    const newAdmin = new Admin({email: 'admin@gmail.com', name: 'Admin'})
    await newAdmin.save()

    const newUser = new User({roles: ['admin'], _id: userRecord.uid, admin: newAdmin._id})
    await newUser.save()
    console.log('Created admin')
  })
  .catch((error) => {
    console.log('Error creating new user:', error)
  })

for (let i = 0; i < 3; i += 1) {
  admin
    .auth()
    .createUser({
      email: `owner${i + 1}@gmail.com`,
      password: '123456',
    })
    .then(async (userRecord) => {
      const newOwner = new Owner({
        email: `owner${i + 1}@gmail.com`,
        name: faker.name.findName(),
        identity: faker.finance.creditCardNumber(),
        address: faker.address.streetAddress(),
        phone: '0968123456',
        status: 'APPROVED',
      })
      await newOwner.save()

      const newUser = new User({roles: ['owner'], _id: userRecord.uid, owner: newOwner._id})
      await newUser.save()

      for (let j = 0; j < 8; j += 1) {
        const newRoom = new Room({
          owner: newOwner._id,
          roomType: roomTypes[j % 4],
          area: 30,
          city: cities[j],
          detailAddress: faker.address.streetAddress(),
          bathroomType: bathroomTypes[j % 2],
          kitchenType: kitchenTypes[j % 3],
          hasWaterHeater: j % 2 === 0,
          hasConditioner: j % 2 === 1,
          hasBalcony: j % 2 === 1,
          hasFridge: j % 2 === 0,
          hasBed: j % 2 === 0,
          hasWardrobe: j % 2 === 1,
          roomPrice: 1000000 * (j % 4) + 500000,
          waterPrice: 50000,
          electricityPrice: 5000,
          isWithOwner: j % 2 === 1,
          isExpired: false,
          expiredDate: Date.now(),
          views: 0,
          isRent: false,
          status: 'APPROVED',
          images: [
            'https://firebasestorage.googleapis.com/v0/b/easy-accomod-57b04.appspot.com/o/download%20(1).jpeg?alt=media&token=4a5db726-dcb6-46b3-98ac-9ecffe84e601',
            'https://firebasestorage.googleapis.com/v0/b/easy-accomod-57b04.appspot.com/o/download%20(2).jpeg?alt=media&token=1e12f1e3-4081-4adc-be3f-10793f368eef',
            'https://firebasestorage.googleapis.com/v0/b/easy-accomod-57b04.appspot.com/o/download.jpeg?alt=media&token=b4b5f627-fb4c-4494-9839-59a4a6a2c121',
          ],
        })
        newRoom.save()
      }
    })
    .catch((error) => {
      console.log('Error creating new user:', error)
    })
}

for (let i = 3; i < 6; i += 1) {
  admin
    .auth()
    .createUser({
      email: `owner${i + 1}@gmail.com`,
      password: '123456',
    })
    .then(async (userRecord) => {
      const newOwner = new Owner({
        email: `owner${i + 1}@gmail.com`,
        name: faker.name.findName(),
        identity: faker.finance.creditCardNumber(),
        address: faker.address.streetAddress(),
        phone: '0968123456',
        status: 'PENDING',
      })
      await newOwner.save()

      const newUser = new User({roles: ['owner'], _id: userRecord.uid, owner: newOwner._id})
      await newUser.save()
      console.log(newOwner)
    })
    .catch((error) => {
      console.log('Error creating new user:', error)
    })
}
