import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import Modal from '../../components/admin/Modal.jsx'
import Badge from '../../components/admin/Badge.jsx'
import Button from '../../components/admin/Button.jsx'
import EmptyState from '../../components/admin/EmptyState.jsx'
import LoadingSkeleton from '../../components/admin/LoadingSkeleton.jsx'
import { fetchAdminHotels, createAdminHotel, updateAdminHotel, deleteAdminHotel } from '../../services/adminService.js'
import { useToast } from '../../context/ToastContext.jsx'

const defaultHotelForm = {
  name: '',
  city: '',
  address: '',
  rating: 4.5,
  featured: false,
  description: '',
  amenities: '',
  images: '',
}

const AdminHotels = () => {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingHotel, setEditingHotel] = useState(null)
  const [formValues, setFormValues] = useState(defaultHotelForm)
  const [deleteHotelId, setDeleteHotelId] = useState(null)
  const [error, setError] = useState('')
  const { success, error: toastError } = useToast()

  useEffect(() => {
    const loadHotels = async () => {
      setLoading(true)
      try {
        const { data } = await fetchAdminHotels()
        setHotels(data || [])
      } catch (err) {
        toastError(err?.message || 'Unable to load hotels')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadHotels()
  }, [toastError])

  const openNewHotel = () => {
    setEditingHotel(null)
    setFormValues(defaultHotelForm)
    setError('')
    setModalOpen(true)
  }

  const openEditHotel = (hotel) => {
    setEditingHotel(hotel)
    setFormValues({
      name: hotel.name,
      city: hotel.city,
      address: hotel.address,
      rating: hotel.rating,
      featured: hotel.featured,
      description: hotel.description,
      amenities: hotel.amenities?.join(', ') || '',
      images: hotel.images?.join(', ') || '',
    })
    setError('')
    setModalOpen(true)
  }

  const imagePreview = useMemo(() => {
    return formValues.images.split(',').map((item) => item.trim()).find(Boolean)
  }, [formValues.images])

  const validateHotel = () => {
    if (!formValues.name.trim() || !formValues.city.trim() || !formValues.address.trim()) {
      setError('Name, city, and address are required.')
      return false
    }
    if (formValues.rating < 1 || formValues.rating > 5) {
      setError('Rating must be between 1 and 5.')
      return false
    }
    return true
  }

  const handleSaveHotel = async () => {
    if (!validateHotel()) return

    const payload = {
      ...formValues,
      amenities: formValues.amenities.split(',').map((item) => item.trim()).filter(Boolean),
      images: formValues.images.split(',').map((item) => item.trim()).filter(Boolean),
    }

    try {
      if (editingHotel) {
        const { data } = await updateAdminHotel(editingHotel._id, payload)
        setHotels((prev) => prev.map((hotel) => (hotel._id === data._id ? data : hotel)))
        success('Hotel updated successfully')
      } else {
        const { data } = await createAdminHotel(payload)
        setHotels((prev) => [data, ...prev])
        success('Hotel created successfully')
      }
      setModalOpen(false)
    } catch (err) {
      toastError('Unable to save hotel')
      console.error(err)
    }
  }

  const handleDeleteHotel = async () => {
    if (!deleteHotelId) return
    try {
      await deleteAdminHotel(deleteHotelId)
      setHotels((prev) => prev.filter((hotel) => hotel._id !== deleteHotelId))
      setDeleteHotelId(null)
      success('Hotel deleted successfully')
    } catch (err) {
      toastError('Unable to delete hotel')
      console.error(err)
    }
  }

  return (
    <AdminLayout title="Hotel management" subtitle="Manage your properties, features, and inventory." actions={<Button onClick={openNewHotel}>Add hotel</Button>}>
      <div className="space-y-6">
        {loading ? (
          <LoadingSkeleton rows={3} />
        ) : hotels.length === 0 ? (
          <EmptyState
            icon="🏨"
            title="No hotels available yet"
            description="Add a hotel to begin populating your property catalog."
          >
            <Button onClick={openNewHotel}>Add first hotel</Button>
          </EmptyState>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {hotels.map((hotel) => (
              <div key={hotel._id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">{hotel.name}</h2>
                    <p className="mt-2 text-slate-500">{hotel.city}</p>
                  </div>
                  <Badge label={hotel.featured ? 'Featured' : 'Standard'} variant={hotel.featured ? 'success' : 'default'} />
                </div>
                <p className="mt-4 text-slate-600 line-clamp-3">{hotel.description}</p>
                <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-500">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-2">Rating {hotel.rating}</span>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-2">{hotel.amenities?.length || 0} amenities</span>
                </div>
                {hotel.images?.[0] && (
                  <img src={hotel.images[0]} alt={hotel.name} className="mt-5 h-40 w-full rounded-2xl object-cover" />
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => openEditHotel(hotel)} className="px-4 py-2 text-sm">
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => setDeleteHotelId(hotel._id)} className="px-4 py-2 text-sm">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} title={editingHotel ? 'Edit hotel' : 'Add hotel'} onClose={() => setModalOpen(false)}>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { name: 'name', label: 'Hotel name' },
              { name: 'city', label: 'City' },
              { name: 'address', label: 'Address' },
              { name: 'rating', label: 'Rating', type: 'number' },
            ].map((field) => (
              <label key={field.name} className="block">
                <span className="text-sm text-slate-600">{field.label}</span>
                <input
                  type={field.type || 'text'}
                  value={formValues[field.name]}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-gray-100 bg-slate-50 px-4 py-3"
                />
              </label>
            ))}
          </div>

          <label className="block">
            <span className="text-sm text-slate-600">Description</span>
            <textarea
              value={formValues.description}
              onChange={(e) => setFormValues((prev) => ({ ...prev, description: e.target.value }))}
              className="mt-2 w-full rounded-2xl border border-gray-100 bg-slate-50 px-4 py-3"
              rows={4}
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-600">Amenities (comma separated)</span>
            <input
              value={formValues.amenities}
              onChange={(e) => setFormValues((prev) => ({ ...prev, amenities: e.target.value }))}
              className="mt-2 w-full rounded-2xl border border-gray-100 bg-slate-50 px-4 py-3"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-600">Image URLs (comma separated)</span>
            <input
              value={formValues.images}
              onChange={(e) => setFormValues((prev) => ({ ...prev, images: e.target.value }))}
              className="mt-2 w-full rounded-2xl border border-gray-100 bg-slate-50 px-4 py-3"
            />
          </label>
          {imagePreview && (
            <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Preview</p>
              <img src={imagePreview} alt="Preview" className="mt-3 h-40 w-full rounded-2xl object-cover" />
            </div>
          )}
          <label className="inline-flex items-center gap-3 text-slate-700">
            <input
              type="checkbox"
              checked={formValues.featured}
              onChange={(e) => setFormValues((prev) => ({ ...prev, featured: e.target.checked }))}
              className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm">Mark as featured</span>
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <Button onClick={handleSaveHotel}>Save hotel</Button>
        </div>
      </Modal>

      <Modal open={Boolean(deleteHotelId)} title="Confirm delete" onClose={() => setDeleteHotelId(null)}>
        <div className="space-y-4">
          <p className="text-slate-600">This hotel will be permanently removed from the catalog. Continue?</p>
          <div className="flex flex-wrap gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteHotelId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteHotel}>
              Delete hotel
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  )
}

export default AdminHotels
