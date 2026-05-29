import mongoose from 'mongoose'

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    rating: { type: Number, default: 4.2 },
    featured: { type: Boolean, default: false },
    startingPrice: { type: Number, required: true, default: 150 },
    maxGuests: { type: Number, required: true, default: 4 },
  },
  { timestamps: true }
)

const Hotel = mongoose.model('Hotel', hotelSchema)
export default Hotel
