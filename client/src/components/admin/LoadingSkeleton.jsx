const LoadingSkeleton = ({ rows = 3, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 h-5 w-2/5 rounded-full bg-slate-200" />
          <div className="h-48 rounded-2xl bg-slate-200" />
        </div>
      ))}
    </div>
  )
}

export default LoadingSkeleton
