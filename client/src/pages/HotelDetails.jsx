import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchHotelById } from '../services/hotelService.js'
import { fetchRooms } from '../services/roomService.js'
import RoomCard from '../components/RoomCard.jsx'
import Button from '../components/Button.jsx'
import EmptyState from '../components/EmptyState.jsx'
import LoadingSkeleton from '../components/LoadingSkeleton.jsx'
import { useBooking } from '../context/BookingContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { HiStar, HiSparkles } from 'react-icons/hi'

const defaultDates = () => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  return { checkIn: today.toISOString().split('T')[0], checkOut: tomorrow.toISOString().split('T')[0] }
}

const HotelDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { selectRoom, booking } = useBooking()
  const [hotel, setHotel] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [dates, setDates] = useState(defaultDates())
  const [guests, setGuests] = useState(2)
  const [selectedRoomId, setSelectedRoomId] = useState(booking.room?._id || null)

  useEffect(() => {
    if (booking.room?._id) {
      setSelectedRoomId(booking.room._id)
    }
  }, [booking.room])

  const { error: toastError } = useToast()

  useEffect(() => {
    const loadHotel = async () => {
      try {
        setLoading(true)
        const [{ data: hotelData }, { data: roomData }] = await Promise.all([
          fetchHotelById(id),
          fetchRooms(id),
        ])
        setHotel(hotelData || null)
        setRooms(Array.isArray(roomData) ? roomData : [])
      } catch (error) {
        console.error(error)
        toastError(error?.message || 'Unable to load hotel details')
        setHotel(null)
        setRooms([])
      } finally {
        setLoading(false)
      }
    }
    loadHotel()
  }, [id, toastError])

  const nights = useMemo(() => {
    if (!dates.checkIn || !dates.checkOut) return 1
    const start = new Date(dates.checkIn)
    const end = new Date(dates.checkOut)
    const diff = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
    return diff
  }, [dates])

  const handleSelectRoom = (room) => {
    if (room.availableRooms <= 0) return
    setSelectedRoomId(room._id)
    selectRoom(hotel, room, dates, guests)
    navigate('/checkout')
  }

  if (loading) {
    return <LoadingSkeleton rows={4} className="max-w-7xl mx-auto" />
  }

  if (!hotel) {
    return (
      <EmptyState
        icon="🏨"
        title="Hotel not found"
        description="We could not find the hotel you are looking for. Please go back and select another property."
      >
        <Button variant="secondary" onClick={() => navigate('/hotels')}>Browse hotels</Button>
      </EmptyState>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="space-y-10"
    >
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_420px]">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Hotel details</p>
                <h1 className="mt-3 text-4xl font-semibold text-slate-900">{hotel.name}</h1>
                <p className="mt-2 text-slate-600">{hotel.city} · {hotel.address}</p>
              </div>
              <div className="inline-flex items-center gap-3 rounded-full bg-emerald-100 px-4 py-3 text-emerald-700">
                <HiStar className="h-5 w-5" /> {hotel.rating}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {hotel.images?.slice(0, 3).map((image, index) => (
                <img key={index} src={image} alt={`${hotel.name} ${index + 1}`} className="h-60 w-full rounded-3xl object-cover" />
              ))}
            </div>
            <div className="space-y-4 rounded-3xl bg-slate-50 p-6">
              <h2 className="text-2xl font-semibold text-slate-900">About this property</h2>
              <p className="text-slate-600">{hotel.description}</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900">Amenities</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {hotel.amenities?.map((item) => (
                    <span key={item} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-slate-700 shadow-sm">{item}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <h3 className="text-xl font-semibold text-slate-900">Reviews</h3>
                <div className="mt-4 space-y-4 text-slate-600">
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="font-semibold text-slate-900">Excellent stay</p>
                    <p className="mt-2 text-sm">Clean rooms, great staff service, and a relaxing pool.</p>
                  </div>
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="font-semibold text-slate-900">Very comfortable</p>
                    <p className="mt-2 text-sm">The location is perfect for business travelers and tourists.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <aside className="space-y-6">
            <div className="rounded-2xl bg-brand-600/10 p-6 text-slate-900 shadow-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Booking widget</p>
              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm text-slate-600">Check-in</span>
                  <input value={dates.checkIn} onChange={(e) => setDates((prev) => ({ ...prev, checkIn: e.target.value }))} type="date" className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-600">Check-out</span>
                  <input value={dates.checkOut} onChange={(e) => setDates((prev) => ({ ...prev, checkOut: e.target.value }))} type="date" className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-600">Guests</span>
                  <input value={guests} onChange={(e) => setGuests(Number(e.target.value))} type="number" min="1" className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" />
                </label>
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Summary</p>
                  <div className="mt-4 space-y-2 text-slate-700">
                    <p>Stay: {nights} night{nights > 1 ? 's' : ''}</p>
                    <p>Guests: {guests}</p>
                    <p className="font-semibold">Average from ${Math.round(hotel.rating * 35)} / night</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Need help?</h3>
              <p className="mt-3 text-slate-600">Our support team is available around the clock to help with your booking.</p>
              <button onClick={() => window.alert('Contact support at support@example.com')} className="mt-5 w-full rounded-full bg-brand-600 px-5 py-3 text-white hover:bg-brand-700">
                Contact support
              </button>
            </div>
          </aside>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Rooms</p>
            <h2 className="text-3xl font-semibold text-slate-900">Choose a room</h2>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">{rooms.length} options available</div>
        </div>
        <div className="grid gap-6">
          {rooms.length === 0 ? (
            <EmptyState
              icon="🛌"
              title="No rooms currently available"
              description="This hotel has no rooms available at the moment. Please check back later or choose a different property."
            />
          ) : (
            rooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                guests={guests}
                selected={room._id === selectedRoomId}
                disabled={room.availableRooms <= 0}
                onSelect={handleSelectRoom}
              />
            ))
          )}
        </div>
      </section>
    </motion.div>
  )
}

export default HotelDetails
