const EmptyState = ({ icon, title, description, children }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
      {icon && <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl text-brand-600">{icon}</div>}
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-3 text-slate-600">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}

export default EmptyState
