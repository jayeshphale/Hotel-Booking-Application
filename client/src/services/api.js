import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
})

const getErrorMessage = (error) => {
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.message) return error.message
  return 'An unexpected server error occurred.'
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hotel_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => ({ success: true, data: response.data, status: response.status }),
  (error) => Promise.reject({ success: false, message: getErrorMessage(error), status: error?.response?.status })
)

export default api
