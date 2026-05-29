import asyncHandler from 'express-async-handler'
import Wallet from '../models/Wallet.js'
import WalletTransaction from '../models/WalletTransaction.js'
import Booking from '../models/Booking.js'
import Room from '../models/Room.js'
import { rupeesToPaise } from '../utils/currency.js'

// Get or create wallet for user
export const getOrCreateWallet = async (userId) => {
  let wallet = await Wallet.findOne({ userId })
  if (!wallet) {
    wallet = await Wallet.create({ userId })
  }
  return wallet
}

export const getBalance = asyncHandler(async (req, res) => {
  const wallet = await getOrCreateWallet(req.user._id)
  res.json({ balance: wallet.balance, currency: wallet.currency })
})

export const getTransactions = asyncHandler(async (req, res) => {
  const txs = await WalletTransaction.find({ userId: req.user._id }).sort({ createdAt: -1 })
  res.json(txs)
})

export const topUp = asyncHandler(async (req, res) => {
  const { amount, method = 'demo_topup', reference } = req.body
  const value = rupeesToPaise(amount)
  if (!value || value <= 0) {
    res.status(400)
    throw new Error('Invalid top-up amount')
  }

  const wallet = await getOrCreateWallet(req.user._id)
  wallet.balance = wallet.balance + value
  await wallet.save()

  const tx = await WalletTransaction.create({
    userId: req.user._id,
    type: 'credit',
    amount: value,
    method,
    reference: reference || `topup_${Date.now()}`,
    balanceAfter: wallet.balance,
    description: 'Demo wallet top-up',
  })

  res.status(201).json({ wallet, transaction: tx })
})

export const payWithWallet = asyncHandler(async (req, res) => {
  const { amount, bookingPayload, reference } = req.body
  const value = rupeesToPaise(amount)
  if (!value || value <= 0) {
    res.status(400)
    throw new Error('Invalid payment amount')
  }

  const wallet = await getOrCreateWallet(req.user._id)
  if (wallet.balance < value) {
    res.status(400)
    throw new Error('Insufficient wallet balance')
  }

  // Deduct
  wallet.balance = wallet.balance - value
  await wallet.save()

  const tx = await WalletTransaction.create({
    userId: req.user._id,
    type: 'debit',
    amount: value,
    method: 'wallet_payment',
    reference: reference || `wallet_pay_${Date.now()}`,
    balanceAfter: wallet.balance,
    description: 'Booking payment via wallet',
  })

  // Create booking record (totalAmount expected to be in paise)
  const { hotelId, roomId, checkIn, checkOut, guests, totalAmount, customer } = bookingPayload
  const booking = await Booking.create({
    userId: req.user._id,
    hotelId,
    roomId,
    checkIn,
    checkOut,
    guests,
    totalAmount,
    customer,
    paymentId: tx.reference,
    orderId: reference || tx.reference,
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
  })

  const room = await Room.findById(roomId)
  if (room) {
    room.availableRooms = Math.max(0, room.availableRooms - 1)
    await room.save()
  }

  await booking.populate('hotelId', 'name address city')
  await booking.populate('roomId', 'roomType price')
  await booking.populate('userId', 'name email')

  res.status(201).json({ booking, transaction: tx, wallet })
})

export default {
  getBalance,
  getTransactions,
  topUp,
  payWithWallet,
}
