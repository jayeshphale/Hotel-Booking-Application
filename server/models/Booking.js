import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    customer: {
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String },
      phone: { type: String },
      city: { type: String },
      country: { type: String },
    },
    paymentId: { type: String },
    orderId: { type: String },
    receiptUrl: { type: String },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

const Booking = mongoose.model('Booking', bookingSchema)
export default Booking
