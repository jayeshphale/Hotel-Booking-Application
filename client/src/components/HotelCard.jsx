import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiChevronRight, HiStar } from 'react-icons/hi'

const HotelCard = ({ hotel }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition"
    >
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="h-52 overflow-hidden rounded-3xl bg-slate-100">
          <img
            src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'}
            alt={hotel.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">{hotel.name}</h3>
              <p className="text-slate-500">{hotel.city}, {hotel.address}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
              <HiStar /> {hotel.rating}
            </span>
          </div>
          <p className="text-slate-600 line-clamp-2">{hotel.description}</p>
          <div className="flex flex-wrap gap-2 text-sm text-slate-600">
            {hotel.amenities?.slice(0, 4).map((item) => (
              <span key={item} className="rounded-full bg-slate-100 px-3 py-1">{item}</span>
            ))}
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-lg font-semibold text-slate-900">From <span className="text-brand-600">${hotel.startingPrice || Math.max(99, Math.round(hotel.rating * 35))}</span>/night</p>
            <Link to={`/hotels/${hotel._id}`} className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-white hover:bg-brand-700">
              View Details <HiChevronRight />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default HotelCard
