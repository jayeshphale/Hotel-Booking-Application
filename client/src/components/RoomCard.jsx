import { motion } from 'framer-motion'
import { HiUserGroup, HiSparkles, HiWifi } from 'react-icons/hi'

const RoomCard = ({ room, onSelect, selected = false, disabled = false, guests = 1 }) => {
  const overCapacity = guests > room.capacity

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-3xl border p-6 shadow-sm transition-all duration-200 ${
        disabled ? 'border-rose-100 bg-rose-50/50 opacity-70' : selected ? 'border-brand-600 bg-brand-50 shadow-md' : 'border-slate-200 bg-white hover:-translate-y-1 hover:shadow-md'
      }`}
    >
      <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
        <div className="h-44 overflow-hidden rounded-3xl bg-slate-100">
          <img src={room.images?.[0] || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'} alt={room.roomType} className="h-full w-full object-cover" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">{room.roomType}</h3>
              <p className="text-slate-500">Capacity: {room.capacity} guests</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-brand-600">${room.price}</p>
              <p className="text-sm text-slate-500">per night</p>
            </div>
          </div>
          <p className="text-slate-600">{room.description || 'Comfortable room with premium amenities and a modern layout.'}</p>
          <div className="grid gap-2 sm:grid-cols-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2"><HiUserGroup /> {room.capacity} pax</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2"><HiSparkles /> {room.amenities?.[0] || 'Breakfast'}</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2"><HiWifi /> WiFi</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className={`rounded-full px-3 py-2 text-sm ${room.availableRooms > 0 ? 'bg-slate-100 text-slate-600' : 'bg-rose-100 text-rose-700'}`}>
              {room.availableRooms > 0 ? `${room.availableRooms} rooms left` : 'Sold out'}
            </span>
            {overCapacity && !disabled && (
              <span className="rounded-full bg-amber-100 px-3 py-2 text-sm text-amber-700">Too many guests for this room</span>
            )}
            <button
              onClick={() => onSelect(room)}
              disabled={disabled}
              className={`rounded-full px-5 py-3 text-white transition-all duration-200 ${disabled ? 'bg-slate-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'}`}
            >
              {selected ? 'Selected' : 'Select Room'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default RoomCard
