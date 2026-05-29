import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchHotels } from '../services/hotelService.js'
import HotelCard from '../components/HotelCard.jsx'
import Button from '../components/Button.jsx'
import EmptyState from '../components/EmptyState.jsx'
import LoadingSkeleton from '../components/LoadingSkeleton.jsx'
import useDebouncedValue from '../hooks/useDebouncedValue.js'
import { HiClock, HiStar } from 'react-icons/hi'

const pageSize = 6

const Hotels = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [hotels, setHotels] = useState([])
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('')
  const [rating, setRating] = useState('')
  const [sortBy, setSortBy] = useState('recommended')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const debouncedSearch = useDebouncedValue(search, 350)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearch(params.get('search') ?? '')
    setCity(params.get('city') ?? '')
    setCheckIn(params.get('checkIn') ?? '')
    setCheckOut(params.get('checkOut') ?? '')
    setGuests(params.get('guests') ?? '')
  }, [location.search])

  useEffect(() => {
    const loadHotels = async () => {
      try {
        setLoading(true)
        const { data } = await fetchHotels({
          search: debouncedSearch,
          city,
          rating,
          guests,
        })
        setHotels(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadHotels()
  }, [debouncedSearch, city, rating, guests])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, city, rating, sortBy, guests])

  const handleApplyFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (city) params.set('city', city)
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    if (guests) params.set('guests', guests)
    if (rating) params.set('rating', rating)
    navigate(`/hotels?${params.toString()}`)
  }

  const filteredHotels = useMemo(() => {
    return hotels
      .filter((hotel) => {
        const searchMatch = hotel.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || hotel.city.toLowerCase().includes(debouncedSearch.toLowerCase())
        const cityMatch = city ? hotel.city.toLowerCase().includes(city.toLowerCase()) : true
        const ratingMatch = rating ? hotel.rating >= Number(rating) : true
        return searchMatch && cityMatch && ratingMatch
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.rating * 35 - b.rating * 35
        if (sortBy === 'priceDesc') return b.rating * 35 - a.rating * 35
        if (sortBy === 'rating') return b.rating - a.rating
        return b.featured - a.featured
      })
  }, [hotels, search, city, rating, sortBy])

  const pageCount = Math.max(1, Math.ceil(filteredHotels.length / pageSize))
  const paginatedHotels = filteredHotels.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Discover your next stay</h1>
            <p className="text-slate-600">Browse hotels with modern search, filters, and smart recommendations.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
              <HiClock /> Updated daily
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <HiStar /> Top rated
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Search & filter</h2>
            <p className="mt-2 text-slate-600">Refine hotel results by city, rating, and price.</p>
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm text-slate-600">Search</span>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Hotel or city" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-200 focus:border-brand-600" />
            </label>
            <label className="block">
              <span className="text-sm text-slate-600">City</span>
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City name" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-600">Check-in</span>
                <input value={checkIn} onChange={(e) => setCheckIn(e.target.value)} type="date" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
              </label>
              <label className="block">
                <span className="text-sm text-slate-600">Check-out</span>
                <input value={checkOut} onChange={(e) => setCheckOut(e.target.value)} type="date" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
              </label>
            </div>
            <label className="block">
              <span className="text-sm text-slate-600">Guests</span>
              <input value={guests} onChange={(e) => setGuests(e.target.value)} type="number" min="1" placeholder="2" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
            </label>
            <label className="block">
              <span className="text-sm text-slate-600">Rating</span>
              <select value={rating} onChange={(e) => setRating(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                <option value="">All Ratings</option>
                <option value="4">4.0+</option>
                <option value="4.5">4.5+</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-slate-600">Sort by</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                <option value="recommended">Recommended</option>
                <option value="priceAsc">Price: Low to high</option>
                <option value="priceDesc">Price: High to low</option>
                <option value="rating">Rating</option>
              </select>
            </label>
            <button onClick={handleApplyFilters} className="mt-4 w-full rounded-3xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
              Apply filters
            </button>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-slate-600">{filteredHotels.length} hotels available</p>
              <p className="text-sm text-slate-500">Showing page {page} of {pageCount}</p>
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              <LoadingSkeleton rows={3} />
            ) : paginatedHotels.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No hotels found"
                description="Try new filters or a different destination to find available hotels."
              />
            ) : (
              paginatedHotels.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${page === index + 1 ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Hotels
