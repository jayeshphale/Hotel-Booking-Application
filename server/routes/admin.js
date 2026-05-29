import express from 'express'
import { getDashboard, getCustomers } from '../controllers/adminController.js'
import { protect, admin } from '../middleware/auth.js'

const router = express.Router()

router.get('/dashboard', protect, admin, getDashboard)
router.get('/customers', protect, admin, getCustomers)

export default router
