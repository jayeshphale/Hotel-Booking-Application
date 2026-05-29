import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import hotelRoutes from './routes/hotels.js'
import roomRoutes from './routes/rooms.js'
import bookingRoutes from './routes/bookings.js'
import paymentRoutes from './routes/payments.js'
import walletRoutes from './routes/wallets.js'
import adminRoutes from './routes/admin.js'
import { notFound, errorHandler } from './middleware/error.js'

dotenv.config()

const app = express()
app.use(express.json())

// CORS configuration for production and development
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'https://hotel-booking-application-enlq.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
]

app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))

app.use('/api/auth', authRoutes)
app.use('/api/hotels', hotelRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/wallets', walletRoutes)
app.use('/api/admin', adminRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Hotel Booking API is running' })
})

app.use(notFound)
app.use(errorHandler)

export default app
