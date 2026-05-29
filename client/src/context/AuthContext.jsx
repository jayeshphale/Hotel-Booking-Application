import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('hotel_token') || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      localStorage.setItem('hotel_token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      fetchProfile()
    } else {
      localStorage.removeItem('hotel_token')
      delete axios.defaults.headers.common.Authorization
    }
  }, [token])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile`)
      setUser(data)
    } catch (error) {
      setToken('')
    } finally {
      setLoading(false)
    }
  }

  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
  }

  const logout = () => {
    setUser(null)
    setToken('')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
