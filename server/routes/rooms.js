import express from 'express'
import { createRoom, updateRoom, deleteRoom, getRooms } from '../controllers/roomController.js'
import { protect, admin } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getRooms)
router.post('/', protect, admin, createRoom)
router.put('/:id', protect, admin, updateRoom)
router.delete('/:id', protect, admin, deleteRoom)

export default router
