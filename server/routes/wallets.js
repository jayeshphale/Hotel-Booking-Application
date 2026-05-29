import express from 'express'
import { protect } from '../middleware/auth.js'
import { getBalance, getTransactions, topUp, payWithWallet } from '../controllers/walletController.js'

const router = express.Router()

router.get('/balance', protect, getBalance)
router.get('/transactions', protect, getTransactions)
router.post('/topup', protect, topUp)
router.post('/pay', protect, payWithWallet)

export default router
