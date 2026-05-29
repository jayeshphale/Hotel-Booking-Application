import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import EmptyState from '../components/EmptyState.jsx'
import Button from '../components/Button.jsx'
import { fetchBookingInvoice } from '../services/bookingService.js'

const Confirmation = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [downloading, setDownloading] = useState(false)
  const bookingId = state?.bookingId || 'HB-2026-0001'
  const hotel = state?.hotel
  const room = state?.room
  const dates = state?.dates
  const guests = state?.guests
  const total = state?.total

  const bookingExists = Boolean(state?.bookingId && state?.hotel && state?.room)

  const handleDownloadInvoice = async () => {
    if (!state?.bookingId) return
    setDownloading(true)
    try {
      const response = await fetchBookingInvoice(state.bookingId)
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `booking-invoice-${state.bookingId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
    } finally {
      setDownloading(false)
    }
  }

  if (!bookingExists) {
    return (
      <EmptyState
        icon="✅"
        title="Booking summary unavailable"
        description="Your confirmation details are missing. Please start a new booking to continue."
      >
        <Button variant="primary" onClick={() => navigate('/hotels')}>Browse hotels</Button>
      </EmptyState>
    )
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Booking confirmed</h1>
            <p className="mt-2 text-slate-600">Your reservation is complete. Thank you for booking with us.</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-5 py-3 text-emerald-700">Payment successful</span>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm uppercase text-slate-500">Booking ID</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{bookingId}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm uppercase text-slate-500">Hotel</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{hotel?.name || 'Selected hotel'}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Guest details</h2>
          <div className="mt-4 space-y-3 text-slate-600">
            <p>Name: {state?.customer?.firstName || 'Guest'} {state?.customer?.lastName || ''}</p>
            <p>Email: {state?.customer?.email || 'Not provided'}</p>
            <p>Phone: {state?.customer?.phone || 'Not provided'}</p>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Reservation details</h2>
          <div className="mt-4 space-y-3 text-slate-600">
            <p>Room: {room?.name || room?.roomType || 'Selected room'}</p>
            <p>Check-in: {dates?.checkIn || 'TBD'}</p>
            <p>Check-out: {dates?.checkOut || 'TBD'}</p>
            <p>Guests: {guests || '1'}</p>
            <p>Total amount: ${total || '—'}</p>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/my-bookings" className="rounded-full bg-brand-600 px-6 py-3 text-white hover:bg-brand-700 transition-all duration-200 ease-in-out">
          View My Bookings
        </Link>
        <button
          onClick={handleDownloadInvoice}
          disabled={downloading}
          className="rounded-full border border-slate-200 bg-white px-6 py-3 text-slate-900 transition-all duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-60"
        >
          {downloading ? 'Downloading...' : 'Download invoice'}
        </button>
      </div>
    </div>
  )
}

export default Confirmation
