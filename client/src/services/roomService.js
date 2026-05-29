import api from './api'

export const fetchRooms = (hotelId) => api.get('/api/rooms', { params: { hotelId } })
