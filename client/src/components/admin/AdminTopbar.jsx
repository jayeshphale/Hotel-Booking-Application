import { HiOutlineBell, HiOutlineLogout, HiOutlineUserCircle } from 'react-icons/hi'

const AdminTopbar = ({ title, subtitle, actions }) => {
  return (
    <div className="flex flex-col gap-6 rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/70">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-brand-600">Admin dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {actions}
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 hover:bg-slate-100">
            <HiOutlineBell className="h-5 w-5" /> Alerts
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 hover:bg-slate-100">
            <HiOutlineUserCircle className="h-5 w-5" /> Admin
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-white hover:bg-brand-700">
            <HiOutlineLogout className="h-5 w-5" /> Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminTopbar
