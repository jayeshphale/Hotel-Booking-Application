import { useEffect, useMemo, useState } from 'react'
import { HiOfficeBuilding, HiCalendar, HiChartBar, HiUsers, HiCurrencyDollar, HiSparkles } from 'react-icons/hi'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import StatCard from '../../components/admin/StatCard.jsx'
import ChartCard from '../../components/admin/ChartCard.jsx'
import Badge from '../../components/admin/Badge.jsx'
import EmptyState from '../../components/admin/EmptyState.jsx'
import LoadingSkeleton from '../../components/admin/LoadingSkeleton.jsx'
import { fetchAdminDashboard } from '../../services/adminService.js'
import { formatINRFromPaise } from '../../utils/currency.js'
import { useToast } from '../../context/ToastContext.jsx'

const statusColors = {
  confirmed: '#10b981',
  pending: '#f59e0b',
  cancelled: '#ef4444',
  completed: '#0ea5e9',
}

const formatCurrency = (value) => formatINRFromPaise(value)

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { error } = useToast()

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await fetchAdminDashboard()
        setStats(data)
      } catch (err) {
        error('Unable to load dashboard metrics')
        console.error(err)
      }
    }

    loadStats()
  }, [error])

  const recentBookings = useMemo(() => {
    if (!stats) return []
    return (stats.recentBookings || []).filter((booking) => {
      const searchValue = search.toLowerCase()
      const matchesSearch =
        booking._id?.toLowerCase().includes(searchValue) ||
        booking.userId?.name?.toLowerCase().includes(searchValue) ||
        booking.hotelId?.name?.toLowerCase().includes(searchValue) ||
        booking.roomId?.roomType?.toLowerCase().includes(searchValue)
      const matchesStatus = statusFilter === 'all' || booking.bookingStatus === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [stats, search, statusFilter])

  const monthlyTrend = useMemo(() => {
    if (!stats?.monthlyData?.length) return { revenue: 'Stable', bookings: 'Stable' }

    const months = stats.monthlyData
    const current = months[months.length - 1]
    const previous = months[months.length - 2]

    const computeChange = (currentValue = 0, previousValue = 0) => {
      if (!previousValue) return 'Stable'
      const change = ((currentValue - previousValue) / previousValue) * 100
      const prefix = change >= 0 ? '▲' : '▼'
      return `${prefix} ${Math.abs(change).toFixed(0)}%`
    }

    return {
      revenue: computeChange(current.totalRevenue, previous?.totalRevenue),
      bookings: computeChange(current.totalBookings, previous?.totalBookings),
    }
  }, [stats])

  const statusSeries = useMemo(() => {
    if (!stats) return []
    return Object.entries(stats.statusBreakdown).map(([name, value]) => ({ name, value }))
  }, [stats])

  const monthlyData = useMemo(() => {
    return stats?.monthlyData?.map((item) => {
      const [year, month] = item._id.split('-')
      return {
        ...item,
        label: new Date(Number(year), Number(month) - 1).toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        }),
      }
    })
  }, [stats])

  if (!stats) {
    return (
      <AdminLayout title="Hotel operations" subtitle="Executive analytics, bookings, and property performance in one view.">
        <LoadingSkeleton rows={3} />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Hotel operations" subtitle="Executive analytics, bookings, and property performance in one view.">
      <div className="space-y-6">
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={<HiUsers />}
            label="Total users"
            value={stats.totalUsers}
            trend={stats.totalUsers ? 'Live' : 'None'}
            accentClass="bg-emerald-100 text-emerald-700"
          />
          <StatCard
            icon={<HiOfficeBuilding />}
            label="Total hotels"
            value={stats.totalHotels}
            trend={stats.totalHotels ? 'Live' : 'None'}
            accentClass="bg-sky-100 text-sky-700"
          />
          <StatCard
            icon={<HiCalendar />}
            label="Total bookings"
            value={stats.totalBookings}
            trend={monthlyTrend.bookings}
            accentClass="bg-brand-100 text-brand-700"
          />
          <StatCard
            icon={<HiCurrencyDollar />}
            label="Revenue"
            value={formatCurrency(stats.totalRevenue)}
            trend={monthlyTrend.revenue}
            accentClass="bg-emerald-100 text-emerald-700"
          />
          <StatCard
            icon={<HiSparkles />}
            label="Active bookings"
            value={stats.activeBookings}
            trend="Confirmed"
            accentClass="bg-sky-100 text-sky-700"
          />
          <StatCard
            icon={<HiChartBar />}
            label="Cancelled"
            value={stats.cancelledBookings}
            trend="Tracked"
            accentClass="bg-rose-100 text-rose-700"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.95fr]">
          <ChartCard title="Monthly revenue" description="Track booked revenue movement month by month.">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData || []} margin={{ top: 0, right: 24, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} stroke="#cbd5e1" />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} stroke="#cbd5e1" />
                <Tooltip
                  formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{ borderRadius: '16px', borderColor: '#e2e8f0' }}
                />
                <Line type="monotone" dataKey="totalRevenue" stroke="#4338ca" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="grid gap-6">
            <ChartCard title="Booking volume" description="New bookings per month.">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData || []} margin={{ top: 0, right: 16, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} stroke="#cbd5e1" />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} stroke="#cbd5e1" />
                  <Tooltip formatter={(value) => `${value} bookings`} contentStyle={{ borderRadius: '16px', borderColor: '#e2e8f0' }} />
                  <Bar dataKey="totalBookings" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Booking status" description="Live status breakdown of reservations.">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusSeries}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={54}
                    outerRadius={90}
                    paddingAngle={4}
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.8
                      const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
                      const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))
                      return (
                        <text x={x} y={y} fill="#0f172a" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-semibold">
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      )
                    }}
                  >
                    {statusSeries.map((entry) => (
                      <Cell key={entry.name} fill={statusColors[entry.name] || '#64748b'} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Recent bookings</h2>
              <p className="mt-2 text-slate-600">Search, filter, and review the latest reservations.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bookings"
                className="w-full min-w-[220px] rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none"
              >
                <option value="all">All statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {recentBookings.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title="No recent bookings"
                description="No recent reservations match this filter. Try another status or search term."
              />
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 bg-slate-50 text-sm uppercase tracking-[0.25em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Booking</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Hotel</th>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.slice(0, 8).map((booking) => (
                    <tr key={booking._id} className="border-t border-slate-200 bg-white hover:bg-slate-50 odd:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{booking._id.slice(-8).toUpperCase()}</td>
                      <td className="px-6 py-4 text-slate-600">{booking.userId.name}</td>
                      <td className="px-6 py-4 text-slate-600">{booking.hotelId.name}</td>
                      <td className="px-6 py-4 text-slate-600">{booking.roomId.roomType}</td>
                      <td className="px-6 py-4 text-slate-600">{new Date(booking.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{formatCurrency(booking.totalAmount)}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
