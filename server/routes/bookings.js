import express from 'express'
import { createBooking, getMyBookings, getBookingInvoice, getAllBookings, updateBooking } from '../controllers/bookingController.js'
import { protect, admin } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, createBooking)
router.get('/my', protect, getMyBookings)
router.get('/:id/invoice', protect, getBookingInvoice)
router.get('/', protect, admin, getAllBookings)
router.put('/:id', protect, admin, updateBooking)

export default router
