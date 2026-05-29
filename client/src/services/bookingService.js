import api from './api'

export const createBooking = (payload) => api.post('/api/bookings', payload)
export const fetchMyBookings = () => api.get('/api/bookings/my')
export const fetchAllBookings = () => api.get('/api/bookings')
export const fetchBookingInvoice = (id) => api.get(`/api/bookings/${id}/invoice`, { responseType: 'blob' })
