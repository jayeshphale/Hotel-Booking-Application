import { motion } from 'framer-motion'

const StatCard = ({ icon, label, value, trend, accentClass }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-brand-600">
          {icon}
        </div>
        {trend && <span className={`rounded-full px-3 py-1 text-sm font-semibold ${accentClass}`}>{trend}</span>}
      </div>
      <p className="mt-6 text-sm uppercase tracking-[0.28em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
    </motion.div>
  )
}

export default StatCard
