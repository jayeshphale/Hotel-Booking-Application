import { useEffect, useState } from 'react'
import { HiSearch } from 'react-icons/hi'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import Badge from '../../components/admin/Badge.jsx'
import Button from '../../components/admin/Button.jsx'
import EmptyState from '../../components/admin/EmptyState.jsx'
import LoadingSkeleton from '../../components/admin/LoadingSkeleton.jsx'
import useDebouncedValue from '../../hooks/useDebouncedValue.js'
import { fetchAdminBookings, updateBookingStatus } from '../../services/adminService.js'
import { useToast } from '../../context/ToastContext.jsx'

const statusOptions = ['all', 'pending', 'confirmed', 'completed', 'cancelled']
const rowsPerPage = 8

const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const debouncedSearch = useDebouncedValue(search, 300)
  const { success, error } = useToast()

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true)
      try {
        const { data } = await fetchAdminBookings({ search: debouncedSearch, status, page, limit: rowsPerPage })
        const bookingsData = data?.bookings || data || []
        setBookings(bookingsData)
        setTotalPages(data?.totalPages || 1)
        setTotalCount(data?.totalCount || bookingsData.length || 0)
      } catch (err) {
        error('Unable to fetch bookings')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [debouncedSearch, status, page, error])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, status])

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const { data } = await updateBookingStatus(bookingId, newStatus)
      setBookings((prev) => prev.map((booking) => (booking._id === data._id ? data : booking)))
      success('Booking status updated')
    } catch (err) {
      error('Unable to update booking status')
      console.error(err)
    }
  }

  return (
    <AdminLayout title="Booking management" subtitle="Monitor reservations, update status, and resolve requests quickly.">
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Bookings table</h2>
              <p className="mt-2 text-slate-600">Search bookings and manage reservation lifecycles in one place.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                <HiSearch className="h-5 w-5 text-slate-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search bookings"
                  className="w-64 bg-transparent text-sm text-slate-700 outline-none"
                />
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All statuses' : option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSkeleton rows={2} className="mt-6" />
          ) : bookings.length === 0 ? (
            <div className="mt-6">
              <EmptyState title="No bookings found" description="Try another search or adjust the status filter." />
            </div>
          ) : (
            <>
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full border-collapse text-left">
                  <thead className="sticky top-0 bg-slate-50 text-sm uppercase tracking-[0.25em] text-slate-500">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Guest</th>
                      <th className="px-6 py-4">Hotel</th>
                      <th className="px-6 py-4">Room</th>
                      <th className="px-6 py-4">Dates</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="border-t border-slate-200 bg-white hover:bg-slate-50 odd:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{booking._id?.slice(-8).toUpperCase() || 'N/A'}</td>
                        <td className="px-6 py-4 text-slate-600">{booking.userId?.name || 'Unknown'}</td>
                        <td className="px-6 py-4 text-slate-600">{booking.hotelId?.name || 'Unknown'}</td>
                        <td className="px-6 py-4 text-slate-600">{booking.roomId?.roomType || 'Unknown'}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {(booking.checkIn && new Date(booking.checkIn).toLocaleDateString()) || 'TBD'} – {(booking.checkOut && new Date(booking.checkOut).toLocaleDateString()) || 'TBD'}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900">₹{(booking.totalAmount ?? 0).toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4">
                          <Badge
                            label={booking.bookingStatus}
                            variant={
                              booking.bookingStatus === 'confirmed'
                                ? 'success'
                                : booking.bookingStatus === 'completed'
                                ? 'info'
                                : booking.bookingStatus === 'cancelled'
                                ? 'danger'
                                : 'warning'
                            }
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {booking.bookingStatus !== 'cancelled' && (
                              <Button variant="danger" className="px-3 py-2 text-xs" onClick={() => handleStatusChange(booking._id, 'cancelled')}>
                                Cancel
                              </Button>
                            )}
                            {booking.bookingStatus === 'confirmed' && (
                              <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => handleStatusChange(booking._id, 'completed')}>
                                Complete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500">Showing {bookings.length} of {totalCount} bookings</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setPage(index + 1)}
                      className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${
                        page === index + 1 ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminBookings
