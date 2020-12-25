import * as dotenv from 'dotenv'
import express, {Response, NextFunction} from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import bodyParser from 'body-parser'
import hpp from 'hpp'
import mongoose from 'mongoose'

import {checkAuth} from './middlewares/authentication'

import * as ownerController from './controllers/owner'
import * as userController from './controllers/user'

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

app.post('/api/owner/create', checkAuth, ownerController.createOwner)

app.get('/api/profile', checkAuth, userController.getProfile)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
