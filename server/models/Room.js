import mongoose from 'mongoose'

const roomSchema = new mongoose.Schema(
  {
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomType: { type: String, required: true },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    availableRooms: { type: Number, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    description: { type: String },
  },
  { timestamps: true }
)

const Room = mongoose.model('Room', roomSchema)
export default Room
