import api from './api.js'

export const fetchAdminDashboard = () => api.get('/api/admin/dashboard')
export const fetchAdminCustomers = () => api.get('/api/admin/customers')
export const fetchAdminBookings = (params = {}) => api.get('/api/bookings', { params })
export const updateBookingStatus = (id, status) => api.put(`/api/bookings/${id}`, { bookingStatus: status })

export const fetchAdminHotels = () => api.get('/api/hotels')
export const createAdminHotel = (payload) => api.post('/api/hotels', payload)
export const updateAdminHotel = (id, payload) => api.put(`/api/hotels/${id}`, payload)
export const deleteAdminHotel = (id) => api.delete(`/api/hotels/${id}`)

export const fetchAdminRooms = (hotelId) => api.get('/api/rooms', { params: { hotelId } })
export const createAdminRoom = (payload) => api.post('/api/rooms', payload)
export const updateAdminRoom = (id, payload) => api.put(`/api/rooms/${id}`, payload)
export const deleteAdminRoom = (id) => api.delete(`/api/rooms/${id}`)
