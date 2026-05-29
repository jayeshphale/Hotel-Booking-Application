import mongoose from 'mongoose'

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 50000 },
  currency: { type: String, default: 'INR' },
}, { timestamps: true })

const Wallet = mongoose.model('Wallet', walletSchema)
export default Wallet
