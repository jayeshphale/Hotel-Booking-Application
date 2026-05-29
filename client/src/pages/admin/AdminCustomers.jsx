import { useEffect, useMemo, useState } from 'react'
import { HiSearch, HiChevronDown, HiChevronUp } from 'react-icons/hi'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import Modal from '../../components/admin/Modal.jsx'
import Badge from '../../components/admin/Badge.jsx'
import Button from '../../components/admin/Button.jsx'
import EmptyState from '../../components/admin/EmptyState.jsx'
import LoadingSkeleton from '../../components/admin/LoadingSkeleton.jsx'
import useDebouncedValue from '../../hooks/useDebouncedValue.js'
import { fetchAdminCustomers, fetchAdminBookings } from '../../services/adminService.js'
import { useToast } from '../../context/ToastContext.jsx'

const AdminCustomers = () => {
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [expandedUser, setExpandedUser] = useState(null)
  const [detailUser, setDetailUser] = useState(null)

  const debouncedSearch = useDebouncedValue(search, 300)
  const { error } = useToast()

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true)
      try {
        const [usersRes, bookingsRes] = await Promise.all([
          fetchAdminCustomers(),
          fetchAdminBookings({ all: true }),
        ])
        setUsers(usersRes.data || [])
        setBookings(bookingsRes.data?.bookings || bookingsRes.data || [])
      } catch (err) {
        error('Unable to load customers')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadCustomers()
  }, [error])

  const customerList = useMemo(() => {
    return users
      .map((user) => {
        const userBookings = bookings
          .filter((booking) => booking.userId._id === user._id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        return {
          ...user,
          bookings: userBookings,
          totalBookings: userBookings.length,
          totalSpent: userBookings.reduce((sum, booking) => sum + booking.totalAmount, 0),
          lastActive: userBookings.length ? new Date(userBookings[0].createdAt).toLocaleDateString() : 'N/A',
        }
      })
      .filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(debouncedSearch.toLowerCase()))
  }, [users, bookings, debouncedSearch])

  const selectedCustomer = customerList.find((user) => user._id === detailUser)

  return (
    <AdminLayout title="Customer management" subtitle="Customer insights, booking counts, and user activity.">
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Users</h2>
              <p className="mt-2 text-slate-600">Search customers and review recent booking activity.</p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
              <HiSearch className="h-5 w-5 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users"
                className="w-64 bg-transparent text-sm text-slate-700 outline-none"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton rows={3} />
        ) : customerList.length === 0 ? (
          <EmptyState title="No customers found" description="Try broadening your search or wait for new bookings." />
        ) : (
          <div className="space-y-4">
            {customerList.map((user) => (
              <div key={user._id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setExpandedUser((prev) => (prev === user._id ? null : user._id))}
                  className="w-full px-6 py-5 text-left transition-all duration-200 hover:bg-slate-50"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-xl font-semibold text-slate-900">{user.name}</p>
                      <p className="mt-2 text-slate-600">{user.email}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge label={`${user.totalBookings} bookings`} variant={user.totalBookings ? 'success' : 'default'} />
                      <span className="text-sm text-slate-500">Last active: {user.lastActive}</span>
                      {expandedUser === user._id ? (
                        <HiChevronUp className="h-6 w-6 text-slate-500" />
                      ) : (
                        <HiChevronDown className="h-6 w-6 text-slate-500" />
                      )}
                    </div>
                  </div>
                </button>

                {expandedUser === user._id && (
                  <div className="border-t border-slate-200 bg-slate-50 px-6 py-5">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Total bookings</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{user.totalBookings}</p>
                      </div>
                      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Total spent</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">₹{user.totalSpent.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Last booking</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{user.lastActive}</p>
                      </div>
                    </div>
                    <div className="mt-6 space-y-3">
                      {user.bookings.length === 0 ? (
                        <p className="text-slate-600">No booking history available.</p>
                      ) : (
                        user.bookings.map((booking) => (
                          <div key={booking._id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div>
                                <p className="font-semibold text-slate-900">{booking.hotelId.name}</p>
                                <p className="text-sm text-slate-600">{booking.roomId.roomType}</p>
                              </div>
                              <div className="text-right text-sm text-slate-600">
                                <p>
                                  {new Date(booking.checkIn).toLocaleDateString()} – {new Date(booking.checkOut).toLocaleDateString()}
                                </p>
                                <p className="mt-1">₹{booking.totalAmount.toLocaleString('en-IN')}</p>
                              </div>
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
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button variant="secondary" onClick={() => setDetailUser(user._id)}>
                        View details
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={Boolean(detailUser)} title={selectedCustomer ? selectedCustomer.name : 'Customer details'} onClose={() => setDetailUser(null)}>
        {selectedCustomer ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Email</p>
                <p className="mt-2 text-slate-900">{selectedCustomer.email}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Bookings</p>
                <p className="mt-2 text-slate-900">{selectedCustomer.totalBookings}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Spend</p>
              <p className="mt-2 text-slate-900">₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Last booking</p>
              <p className="mt-2 text-slate-900">{selectedCustomer.lastActive}</p>
            </div>
            <div className="space-y-3">
              {selectedCustomer.bookings.map((booking) => (
                <div key={booking._id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{booking.hotelId.name}</p>
                      <p className="text-sm text-slate-600">{booking.roomId.roomType}</p>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      <p>
                        {new Date(booking.checkIn).toLocaleDateString()} – {new Date(booking.checkOut).toLocaleDateString()}
                      </p>
                      <p className="mt-1">₹{booking.totalAmount.toLocaleString('en-IN')}</p>
                    </div>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-slate-600">Loading details…</p>
        )}
      </Modal>
    </AdminLayout>
  )
}

export default AdminCustomers
