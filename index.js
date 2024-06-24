import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { connectToDB } from './database/db.js'
import { handleErrors } from './middlewares/errorHandler.js'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { membershipRoutes } from './routes/membership-routes.js'

const app = express()
const port = process.env.PORT

// helmet to secure app by setting http response headers
app.use(helmet());
app.use(morgan('tiny'))

let limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "We have received too many requests from this IP. Please try again after one hour."
})


// middlewares
app.use('/api', limiter)
app.use(express.json())
app.use(express.urlencoded({extended: true}))


// Middleware to parse date strings into Date objects
app.use((req, res, next) => {
  if (req.body.startDate) {
    req.body.startDate = new Date(req.body.startDate);
  }
  if (req.body.dueDate) {
    req.body.dueDate = new Date(req.body.dueDate);
  }
  if (req.body.monthlyDueDate) {
    req.body.monthlyDueDate = new Date(req.body.monthlyDueDate)
  }
  next()
})


// cors config
const corsOptions = {
  origin: ['http://localhost:5173'],
  optionsSuccessStatus: 200,
  credentiasl: true,  
}

app.use(cors(corsOptions))

// routes
app.use('/api/v1/member', membershipRoutes)

// home
app.get('/', (req, res) => {
  res.json({success: true, message: 'Backend Connected Successfully'})
})

// error handler
app.use(handleErrors)

// connect to database
connectToDB()


app.listen(port, ()=> {
  console.log(`Server running on port ${port}`)
})