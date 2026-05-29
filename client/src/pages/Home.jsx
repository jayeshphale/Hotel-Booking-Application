import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowRight, HiSparkles, HiShieldCheck, HiOutlineSupport, HiChevronRight } from 'react-icons/hi'
import { fetchHotels } from '../services/hotelService.js'
import { useToast } from '../context/ToastContext.jsx'

const features = [
  {
    title: 'Secure booking',
    description: 'Protected reservations with transparent pricing and trusted hotel partners.',
    icon: HiShieldCheck,
  },
  {
    title: 'Premium hotels',
    description: 'Hand-picked luxury stays with exceptional design and service.',
    icon: HiSparkles,
  },
  {
    title: '24/7 support',
    description: 'Concierge-style assistance available anytime during your trip.',
    icon: HiOutlineSupport,
  },
]

const testimonials = [
  {
    name: 'Asha Patel',
    role: 'Frequent traveler',
    quote: 'Booking a luxury stay felt effortless, and everything from search to checkout was beautifully designed.',
  },
  {
    name: 'Daniel Roy',
    role: 'Executive guest',
    quote: 'The curated hotels exuded premium comfort, and the experience felt like a top-tier travel service.',
  },
]

const Home = () => {
  const [hotels, setHotels] = useState([])
  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { error: toastError } = useToast()

  useEffect(() => {
    const loadHotels = async () => {
      try {
        setLoading(true)
        const { data } = await fetchHotels()
        setHotels(data || [])
      } catch (error) {
        console.error(error)
        toastError(error?.message || 'Unable to load hotel previews')
        setHotels([])
      } finally {
        setLoading(false)
      }
    }
    loadHotels()
  }, [toastError])

  const featuredHotels = useMemo(() => hotels.slice(0, 3), [hotels])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (destination) params.set('search', destination)
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    if (guests) params.set('guests', guests.toString())
    navigate(`/hotels?${params.toString()}`)
  }

  return (
    <div className="space-y-24">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/70 to-slate-950/90" />
        <div className="relative mx-auto flex min-h-[720px] max-w-7xl flex-col justify-between px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
          <div className="space-y-6 max-w-3xl">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm uppercase tracking-[0.35em] text-slate-200 backdrop-blur-sm">
              Luxury travel experience
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl"
            >
              Discover luxury stays around the world.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl"
            >
              Book premium hotels with elegant design, seamless search, and curated travel recommendations.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <button
                onClick={handleSearch}
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-2xl shadow-amber-400/30 transition hover:bg-amber-300"
              >
                Start booking
              </button>
              <button
                onClick={() => navigate('/hotels')}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Browse stays
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto w-full max-w-4xl rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl backdrop-saturate-150 md:p-8"
          >
            <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="space-y-4">
                <label className="text-sm uppercase tracking-[0.24em] text-slate-200">Destination</label>
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where are you traveling?"
                  className="w-full rounded-3xl border border-white/20 bg-white/95 px-5 py-4 text-slate-900 shadow-sm outline-none transition focus:border-amber-300"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-4">
                  <label className="text-sm uppercase tracking-[0.24em] text-slate-200">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full rounded-3xl border border-white/20 bg-white/95 px-5 py-4 text-slate-900 shadow-sm outline-none transition focus:border-amber-300"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm uppercase tracking-[0.24em] text-slate-200">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full rounded-3xl border border-white/20 bg-white/95 px-5 py-4 text-slate-900 shadow-sm outline-none transition focus:border-amber-300"
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-4 rounded-3xl bg-slate-950/10 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Guests</p>
                <p className="mt-1 text-lg font-semibold text-white">{guests} guests</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="h-12 w-12 rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
                >
                  -
                </button>
                <span className="min-w-[2rem] text-center text-base font-semibold text-white">{guests}</span>
                <button
                  onClick={() => setGuests(guests + 1)}
                  className="h-12 w-12 rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleSearch}
                className="rounded-full bg-brand-600 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-xl shadow-brand-600/20 transition hover:bg-brand-700"
              >
                Search stays
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-10">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Featured stays</p>
          <h2 className="text-4xl font-semibold text-slate-900 sm:text-5xl">Curated premium hotels</h2>
          <p className="mx-auto max-w-2xl text-base leading-7 text-slate-600">
            Explore three premium hotel experiences designed for luxury travelers and unforgettable stays.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {featuredHotels.map((hotel) => (
            <motion.article
              key={hotel._id}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-900/5 transition"
            >
              <div className="relative h-72 overflow-hidden bg-slate-100">
                <img
                  src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?auto=format&fit=crop&w=1200&q=80'}
                  alt={hotel.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 to-transparent p-5 text-white">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-200/80">Starting at</p>
                  <p className="mt-1 text-3xl font-semibold">${Math.max(140, Math.round(hotel.rating * 42))}</p>
                </div>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{hotel.name}</h3>
                    <p className="text-sm text-slate-500">{hotel.city}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700">
                    ★ {hotel.rating?.toFixed(1) || '4.8'}
                  </span>
                </div>
                <p className="min-h-[3rem] text-sm leading-6 text-slate-600 line-clamp-2">{hotel.description}</p>
                <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                  {hotel.amenities?.slice(0, 3).map((item) => (
                    <span key={item} className="rounded-full bg-slate-100 px-3 py-2">{item}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-4 pt-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Luxury stay</span>
                  <button
                    onClick={() => navigate(`/hotels/${hotel._id}`)}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                  >
                    View stay <HiChevronRight />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-10">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Why choose us</p>
          <h2 className="text-4xl font-semibold text-slate-900 sm:text-5xl">A premium booking experience</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-600/10 text-3xl text-brand-600">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-10 pb-8">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Testimonials</p>
          <h2 className="text-4xl font-semibold text-slate-900 sm:text-5xl">Trusted by discerning travelers</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-slate-100" />
                <div>
                  <p className="text-lg font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-1 text-amber-400">★★★★★</div>
              <p className="mt-6 text-lg leading-8 text-slate-700">“{testimonial.quote}”</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
