import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { HiChartBar, HiOfficeBuilding, HiTable, HiCalendar, HiUsers, HiMenu } from 'react-icons/hi'

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <HiChartBar className="h-5 w-5" /> },
  { label: 'Hotels', path: '/admin/hotels', icon: <HiOfficeBuilding className="h-5 w-5" /> },
  { label: 'Rooms', path: '/admin/rooms', icon: <HiTable className="h-5 w-5" /> },
  { label: 'Bookings', path: '/admin/bookings', icon: <HiCalendar className="h-5 w-5" /> },
  { label: 'Customers', path: '/admin/customers', icon: <HiUsers className="h-5 w-5" /> },
]

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 ${collapsed ? 'w-24' : 'w-full'}`}>
      <div className="flex items-center justify-between gap-3 px-3 pb-4">
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Host console</p>
            <p className="text-slate-500">Manage hotels, rooms, and guests</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-200 hover:bg-slate-200"
        >
          <HiMenu className="h-5 w-5" />
        </button>
      </div>
      <nav className="space-y-2 px-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${
                isActive ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-50'
              }`
            }
          >
            <span>{item.icon}</span>
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      {!collapsed && (
        <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-slate-600">
          <p className="text-sm font-semibold text-slate-900">Admin tools</p>
          <p className="mt-2 text-sm">Keep your inventory updated and bookings optimized.</p>
        </div>
      )}
    </aside>
  )
}

export default AdminSidebar
