import http from 'http'
import app from './app.js'
import connectDB from './config/db.js'
import { autoSeed } from './seed.js'
import Hotel from './models/Hotel.js'
import User from './models/User.js'

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB()
    console.log('✓ MongoDB connected successfully')

    // Auto-seed database if empty
    await autoSeed()

    // Log database status
    const hotelCount = await Hotel.countDocuments()
    const adminExists = await User.findOne({ role: 'admin' })
    console.log(`✓ Hotels count: ${hotelCount}`)
    console.log(`✓ Admin user exists: ${adminExists ? 'Yes' : 'No'}`)

    // Start server
    const server = http.createServer(app)
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
