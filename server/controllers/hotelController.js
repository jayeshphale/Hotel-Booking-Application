import asyncHandler from 'express-async-handler'
import Hotel from '../models/Hotel.js'

export const getHotels = asyncHandler(async (req, res) => {
  const { city, minPrice, maxPrice, rating, search } = req.query
  const filters = {}

  if (city) filters.city = new RegExp(city, 'i')
  if (rating) filters.rating = { $gte: Number(rating) }
  if (search) filters.name = new RegExp(search, 'i')

  const hotels = await Hotel.find(filters).sort({ createdAt: -1 })
  res.json(hotels)
})

export const getHotelById = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id)
  if (hotel) {
    res.json(hotel)
  } else {
    res.status(404)
    throw new Error('Hotel not found')
  }
})

export const createHotel = asyncHandler(async (req, res) => {
  const { name, city, address, description, amenities, images, rating, featured } = req.body
  const hotel = await Hotel.create({
    name,
    city,
    address,
    description,
    amenities,
    images,
    rating,
    featured,
  })
  res.status(201).json(hotel)
})

export const updateHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id)
  if (!hotel) {
    res.status(404)
    throw new Error('Hotel not found')
  }
  const updates = req.body
  Object.assign(hotel, updates)
  const updatedHotel = await hotel.save()
  res.json(updatedHotel)
})

export const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id)
  if (!hotel) {
    res.status(404)
    throw new Error('Hotel not found')
  }
  await hotel.deleteOne()
  res.json({ message: 'Hotel deleted successfully' })
})
