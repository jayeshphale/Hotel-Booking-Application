import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import Hotel from '../models/Hotel.js'
import Booking from '../models/Booking.js'

export const getDashboard = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments()
  const totalHotels = await Hotel.countDocuments()
  const totalBookings = await Booking.countDocuments()
  const revenueResult = await Booking.aggregate([
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ])
  const totalRevenue = revenueResult[0]?.total || 0

  const activeBookings = await Booking.countDocuments({ bookingStatus: { $in: ['confirmed', 'pending'] } })
  const cancelledBookings = await Booking.countDocuments({ bookingStatus: 'cancelled' })

  const statusCounts = await Booking.aggregate([
    { $group: { _id: '$bookingStatus', count: { $sum: 1 } } },
  ])

  const statusBreakdown = statusCounts.reduce((result, item) => {
    result[item._id] = item.count
    return result
  }, { pending: 0, confirmed: 0, cancelled: 0, completed: 0 })

  const monthlyData = await Booking.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalRevenue: { $sum: '$totalAmount' },
        totalBookings: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])

  const recentBookings = await Booking.find()
    .populate('userId', 'name email')
    .populate('hotelId', 'name')
    .populate('roomId', 'roomType')
    .sort({ createdAt: -1 })
    .limit(8)

  res.json({
    totalUsers,
    totalHotels,
    totalBookings,
    totalRevenue,
    activeBookings,
    cancelledBookings,
    statusBreakdown,
    monthlyData,
    recentBookings,
  })
})

export const getCustomers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 })
  res.json(users)
})
