import api from './api'

export const fetchHotels = (params = {}) => api.get('/api/hotels', { params })
export const fetchHotelById = (id) => api.get(`/api/hotels/${id}`)
