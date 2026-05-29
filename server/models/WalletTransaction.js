import mongoose from 'mongoose'

const walletTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  reference: { type: String },
  balanceAfter: { type: Number },
  description: { type: String },
}, { timestamps: true })

const WalletTransaction = mongoose.model('WalletTransaction', walletTransactionSchema)
export default WalletTransaction
