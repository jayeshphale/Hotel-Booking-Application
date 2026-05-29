import asyncHandler from 'express-async-handler'
import Booking from '../models/Booking.js'
import Room from '../models/Room.js'

export const createBooking = asyncHandler(async (req, res) => {
  const { hotelId, roomId, checkIn, checkOut, guests, totalAmount, customer, paymentStatus, paymentId, orderId, bookingStatus } = req.body
  const booking = await Booking.create({
    userId: req.user._id,
    hotelId,
    roomId,
    checkIn,
    checkOut,
    guests,
    totalAmount,
    customer,
    paymentId,
    orderId,
    paymentStatus: paymentStatus || 'pending',
    bookingStatus: bookingStatus || (paymentStatus === 'paid' ? 'confirmed' : 'pending'),
  })

  const room = await Room.findById(roomId)
  if (room && booking.paymentStatus === 'paid') {
    room.availableRooms = Math.max(0, room.availableRooms - 1)
    await room.save()
  }

  res.status(201).json(booking)
})

export const getBookingInvoice = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('hotelId')
    .populate('roomId')
    .populate('userId')

  if (!booking) {
    res.status(404)
    throw new Error('Booking not found')
  }

  if (booking.userId?._id?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403)
    throw new Error('Unauthorized to access invoice')
  }

  const PDFDocument = (await import('pdfkit')).default
  const doc = new PDFDocument({ size: 'A4', margin: 50 })

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="invoice-${booking._id}.pdf"`)

  doc.pipe(res)
  doc.fontSize(20).text('Hotel Booking Invoice', { align: 'center' })
  doc.moveDown()
  doc.fontSize(12).text(`Booking ID: ${booking._id}`)
  doc.text(`Hotel: ${booking.hotelId?.name || 'N/A'}`)
  doc.text(`Room: ${booking.roomId?.roomType || 'N/A'}`)
  doc.text(`Guest: ${booking.customer?.firstName || booking.userId?.name || 'Guest'} ${booking.customer?.lastName || ''}`)
  doc.text(`Email: ${booking.customer?.email || booking.userId?.email || 'N/A'}`)
  doc.text(`Phone: ${booking.customer?.phone || 'N/A'}`)
  doc.text(`Check-in: ${new Date(booking.checkIn).toLocaleDateString()}`)
  doc.text(`Check-out: ${new Date(booking.checkOut).toLocaleDateString()}`)
  doc.moveDown()
  doc.text(`Total amount: ₹${booking.totalAmount || 0}`, { continued: true }).text(`    Payment status: ${booking.paymentStatus}`)
  doc.text(`Booking status: ${booking.bookingStatus}`)
  doc.text(`Order ID: ${booking.orderId || 'N/A'}`)
  doc.text(`Payment ID: ${booking.paymentId || 'N/A'}`)
  doc.moveDown(2)
  doc.text('Thank you for booking with us.', { align: 'center' })

  doc.end()
})

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate('hotelId', 'name city address')
    .populate('roomId', 'roomType price capacity')
    .sort({ createdAt: -1 })

  res.json(bookings)
})

export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('userId', 'name email')
    .populate('hotelId', 'name city')
    .populate('roomId', 'roomType')
    .sort({ createdAt: -1 })

  res.json(bookings)
})

export const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
  if (!booking) {
    res.status(404)
    throw new Error('Booking not found')
  }

  const { bookingStatus } = req.body
  if (bookingStatus) booking.bookingStatus = bookingStatus
  const updatedBooking = await booking.save()

  res.json(updatedBooking)
})
