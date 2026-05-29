import AdminSidebar from '../AdminSidebar.jsx'

const AdminLayout = ({ title, subtitle, children, actions }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f5f7fb] px-4 py-6 md:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="sticky top-6 self-start">
          <AdminSidebar />
        </aside>
        <main className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.32em] text-brand-600">Admin workspace</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">{title}</h1>
              {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3">{actions}</div>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
