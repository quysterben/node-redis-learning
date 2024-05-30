import express, { Express, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import multer from 'multer'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { redisFunction } from './redis/client'

import serverRoute from './routes/router'

dotenv.config()

const app: Express = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())
app.use(cors())
app.use(cookieParser())

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
const fileFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
app.use(multer({ storage: fileStorage, fileFilter }).array('image', 10))

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Hello')
    await redisFunction('SET', 'name', 'Nguyen Van A')
    console.log(await redisFunction('GET', 'name'))
    return res.status(200).json({ messenge: 'Hello xin chao' })
  } catch (error: any) {
    next(error)
  }
})
app.use('/api/v1', serverRoute)
app.use((err: any, req: Request, res: Response, next: any) => {
  const status = err.statusCode || 500
  const message = err.message
  const data = err.data
  res.status(status).json({
    message: message,
    success: false,
    data: data
  })
})

const port = process.env.PORT || 9900
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
