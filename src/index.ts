import * as dotenv from 'dotenv'
import express, {Response, NextFunction} from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import bodyParser from 'body-parser'
import hpp from 'hpp'
import mongoose from 'mongoose'

import {checkAuth, checkAdmin, getUID} from './middlewares/authentication'

import * as ownerController from './controllers/owner'
import * as userController from './controllers/user'
import * as renterController from './controllers/renter'
import * as adminController from './controllers/admin'
import * as roomController from './controllers/room'
import * as reviewController from './controllers/review'

dotenv.config()

const PORT: number = parseInt(process.env.PORT as string, 10) || 8000
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

const app = express()

app.use(cors())
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(compression())
app.use(hpp())

/**
 * user api
 */
app.get('/api/profile', checkAuth, userController.getProfile)

/**
 * renter api
 */
app.post('/api/renters/create', getUID, renterController.createRenter)

/**
 * owner api
 */
app.post('/api/owners/create', getUID, ownerController.createOwner)
app.get('/api/owners/pending', checkAuth, ownerController.getPendingOwners) // admin
app.get('/api/owners/approved', checkAuth, ownerController.getApprovedOwners) // admin
app.put('/api/owners/:owner_id/approve', checkAuth, ownerController.approveOwner) // admin
app.put('/api/owners/:owner_id/reject', checkAuth, ownerController.rejectOwner) // admin
// app.put('/api/owners/:owner_id/update', checkAuth, ownerController.updateOwnerInfo) // admin

/**
 * admin api
 */
app.post('/api/admins/create', getUID, adminController.createAdmin)

/**
 * room api
 */
app.post('/api/rooms/create', checkAuth, roomController.createRoom) // owner, admin
app.put('/api/rooms/:room_id/update', checkAuth, roomController.updateRoom) // owner, admin
app.get('/api/rooms/:room_id', roomController.getRoomDetail)
app.get('/api/rooms/city/:city', roomController.getRoomsByCity)
app.put('/api/rooms/:room_id/approve', roomController.approveRoom) // admin
app.put('/api/rooms/:room_id/reject', roomController.rejectRoom) // admin

/**
 * review api
 */
app.post('/api/reviews/create', reviewController.createReview) // renter
app.put('/api/reviews/:review_id/approve', reviewController.approveReview) // admin
app.put('/api/reviews/:review_id/reject', reviewController.rejectReview) // admin

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
