import asyncHandler from 'express-async-handler'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import Booking from '../models/Booking.js'
import Room from '../models/Room.js'
import { sendBookingConfirmationEmail } from '../utils/mailer.js'

const isRazorpayConfigured = () => Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the server environment.')
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  })
}

const createDemoOrder = ({ amount, currency, receipt }) => ({
  id: `demo_order_${Date.now()}`,
  amount,
  currency,
  receipt: receipt || `demo_receipt_${Date.now()}`,
  status: 'created',
})

const isDemoVerificationValid = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) =>
  razorpay_order_id?.startsWith('demo_order_') &&
  razorpay_payment_id === 'demo_payment' &&
  razorpay_signature === 'demo_signature'

const createBookingRecord = async ({ userId, hotelId, roomId, checkIn, checkOut, guests, totalAmount, customer, paymentId, orderId }) => {
  const booking = await Booking.create({
    userId,
    hotelId,
    roomId,
    checkIn,
    checkOut,
    guests,
    totalAmount,
    customer,
    paymentId,
    orderId,
    paymentStatus: paymentId ? 'paid' : 'pending',
    bookingStatus: paymentId ? 'confirmed' : 'pending',
  })

  const room = await Room.findById(roomId)
  if (room && paymentId) {
    room.availableRooms = Math.max(0, room.availableRooms - 1)
    await room.save()
  }

  await booking.populate('hotelId', 'name address city')
  await booking.populate('roomId', 'roomType price')
  await booking.populate('userId', 'name email')
  const populatedBooking = booking

  await sendBookingConfirmationEmail(populatedBooking)
  return populatedBooking
}

export { createBookingRecord }

export const createOrder = asyncHandler(async (req, res) => {
  const { amount, currency = 'INR', receipt, demo } = req.body
  if (!amount || amount <= 0) {
    res.status(400)
    throw new Error('Invalid order amount')
  }

  // Use demo mode by default if Razorpay is not configured
  const useDemo = demo || !isRazorpayConfigured()

  if (useDemo) {
    const order = createDemoOrder({ amount: Number(amount), currency, receipt })
    console.log('✓ Created demo payment order:', order.id)
    return res.json(order)
  }

  const razorpay = getRazorpayInstance()
  const order = await razorpay.orders.create({
    amount: Number(amount),
    currency,
    receipt: receipt || `receipt_${Date.now()}`,
    payment_capture: 1,
  })

  res.json(order)
})

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingPayload, demo } = req.body
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingPayload) {
    res.status(400)
    throw new Error('Missing payment verification data')
  }

  // Use demo verification by default if Razorpay is not configured
  const useDemo = demo || !isRazorpayConfigured()

  if (!useDemo) {
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
      res.status(500)
      throw new Error('Razorpay secret key is not configured for payment verification.')
    }

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      res.status(400)
      throw new Error('Payment verification failed')
    }
  } else {
    // Demo mode verification
    if (!isDemoVerificationValid({ razorpay_order_id, razorpay_payment_id, razorpay_signature })) {
      res.status(400)
      throw new Error('Demo payment verification failed')
    }
    console.log('✓ Demo payment verified:', razorpay_order_id)
  }

  const { hotelId, roomId, checkIn, checkOut, guests, totalAmount, customer } = bookingPayload
  const booking = await createBookingRecord({
    userId: req.user._id,
    hotelId,
    roomId,
    checkIn,
    checkOut,
    guests,
    totalAmount,
    customer,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
  })

  res.status(201).json(booking)
})
