import asyncHandler from 'express-async-handler'
import Room from '../models/Room.js'

export const createRoom = asyncHandler(async (req, res) => {
  const { hotelId, roomType, price, capacity, availableRooms, amenities, images, description } = req.body
  const room = await Room.create({
    hotelId,
    roomType,
    price,
    capacity,
    availableRooms,
    amenities,
    images,
    description,
  })
  res.status(201).json(room)
})

export const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id)
  if (!room) {
    res.status(404)
    throw new Error('Room not found')
  }
  const updates = req.body
  Object.assign(room, updates)
  const updatedRoom = await room.save()
  res.json(updatedRoom)
})

export const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id)
  if (!room) {
    res.status(404)
    throw new Error('Room not found')
  }
  await room.deleteOne()
  res.json({ message: 'Room removed successfully' })
})

export const getRooms = asyncHandler(async (req, res) => {
  const { hotelId } = req.query
  const filters = {}
  if (hotelId) filters.hotelId = hotelId
  const rooms = await Room.find(filters).sort({ createdAt: -1 })
  res.json(rooms)
})
