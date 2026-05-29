import { createContext, useContext, useEffect, useState } from 'react'

const BookingContext = createContext()

export const BookingProvider = ({ children }) => {
  const [booking, setBooking] = useState(() => {
    if (typeof window === 'undefined') return { hotel: null, room: null, dates: null, guests: 2 }
    try {
      const stored = localStorage.getItem('hotel_booking')
      return stored ? JSON.parse(stored) : { hotel: null, room: null, dates: null, guests: 2 }
    } catch {
      localStorage.removeItem('hotel_booking')
      return { hotel: null, room: null, dates: null, guests: 2 }
    }
  })

  useEffect(() => {
    localStorage.setItem('hotel_booking', JSON.stringify(booking))
  }, [booking])

  const selectRoom = (hotel, room, dates, guests = 2) => {
    setBooking({ hotel, room, dates, guests })
  }

  const updateBooking = (updates) => {
    setBooking((prev) => ({ ...prev, ...updates }))
  }

  const resetBooking = () => {
    setBooking({ hotel: null, room: null, dates: null, guests: 2 })
  }

  return (
    <BookingContext.Provider value={{ booking, selectRoom, updateBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => useContext(BookingContext)
