import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Wallet from '../models/Wallet.js'
import generateToken from '../utils/generateToken.js'

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body

  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
  })

  // Auto-create wallet for new user
  await Wallet.create({
    userId: user._id,
    balance: 50000, // Demo balance in paise (₹500)
    currency: 'INR',
  })

  if (user) {
    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    // Ensure wallet exists for user
    let wallet = await Wallet.findOne({ userId: user._id })
    if (!wallet) {
      wallet = await Wallet.create({
        userId: user._id,
        balance: 50000,
        currency: 'INR',
      })
    }

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

export const getProfile = asyncHandler(async (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      user: req.user,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})
