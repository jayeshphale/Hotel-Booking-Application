import { useEffect, useState } from 'react'
import api from '../services/api.js'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/api/bookings/my')
        setBookings(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadBookings()
  }, [])

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">My Bookings</h1>
        <p className="mt-2 text-slate-600">Review your reservation history and upcoming stays.</p>
      </div>
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-3xl bg-white p-8 shadow-sm">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-sm text-slate-600">No bookings found yet.</div>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{booking.hotelId.name}</p>
                  <p className="text-slate-600">Room: {booking.roomId?.roomType || 'Standard'}</p>
                </div>
                <div className="space-y-1 text-right text-slate-600">
                  <p>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                  <p>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
                <span>Status: {booking.bookingStatus}</span>
                <span className="font-semibold text-slate-900">${booking.totalAmount}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyBookings
