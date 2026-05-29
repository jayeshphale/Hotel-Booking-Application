import { useEffect, useMemo, useState } from 'react'
import { HiPlus, HiChevronDown, HiChevronUp } from 'react-icons/hi'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import Modal from '../../components/admin/Modal.jsx'
import Badge from '../../components/admin/Badge.jsx'
import Button from '../../components/admin/Button.jsx'
import EmptyState from '../../components/admin/EmptyState.jsx'
import LoadingSkeleton from '../../components/admin/LoadingSkeleton.jsx'
import { fetchAdminHotels, fetchAdminRooms, createAdminRoom, updateAdminRoom, deleteAdminRoom } from '../../services/adminService.js'
import { useToast } from '../../context/ToastContext.jsx'

const defaultRoomForm = {
  hotelId: '',
  roomType: '',
  price: 0,
  capacity: 2,
  availableRooms: 1,
  amenities: '',
  images: '',
  description: '',
}

const AdminRooms = () => {
  const [hotels, setHotels] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [collapsedHotels, setCollapsedHotels] = useState({})
  const [createOpen, setCreateOpen] = useState(false)
  const [formDetails, setFormDetails] = useState(defaultRoomForm)
  const [editingRoom, setEditingRoom] = useState(null)
  const [editingValues, setEditingValues] = useState({ price: '', availableRooms: '' })
  const { success, error: toastError } = useToast()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [hotelsRes, roomsRes] = await Promise.all([fetchAdminHotels(), fetchAdminRooms()])
        setHotels(hotelsRes.data || [])
        setRooms(roomsRes.data || [])
      } catch (err) {
        toastError('Unable to load rooms')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [toastError])

  const groupedRooms = useMemo(() => {
    return hotels.map((hotel) => ({
      hotel,
      rooms: rooms.filter((room) => room.hotelId === hotel._id || room.hotelId?._id === hotel._id),
    }))
  }, [hotels, rooms])

  const openCreateRoom = () => {
    setEditingRoom(null)
    setFormDetails(defaultRoomForm)
    setCreateOpen(true)
  }

  const handleSaveRoom = async () => {
    const payload = {
      ...formDetails,
      amenities: formDetails.amenities.split(',').map((item) => item.trim()).filter(Boolean),
      images: formDetails.images.split(',').map((item) => item.trim()).filter(Boolean),
    }

    try {
      const { data } = await createAdminRoom(payload)
      setRooms((prev) => [data, ...prev])
      setCreateOpen(false)
      success('Room created successfully')
    } catch (err) {
      toastError('Unable to create room')
      console.error(err)
    }
  }

  const handleEditRoom = (room) => {
    setEditingRoom(room)
    setEditingValues({ price: room.price, availableRooms: room.availableRooms })
  }

  const handleSaveRoomChanges = async () => {
    if (!editingRoom) return

    try {
      const { data } = await updateAdminRoom(editingRoom._id, editingValues)
      setRooms((prev) => prev.map((room) => (room._id === data._id ? data : room)))
      setEditingRoom(null)
      success('Room inventory updated')
    } catch (err) {
      toastError('Unable to update room')
      console.error(err)
    }
  }

  const toggleRoomAvailability = async (room) => {
    try {
      const availableRooms = room.availableRooms > 0 ? 0 : 1
      const { data } = await updateAdminRoom(room._id, { availableRooms })
      setRooms((prev) => prev.map((item) => (item._id === data._id ? data : item)))
      success('Availability updated')
    } catch (err) {
      toastError('Unable to update availability')
      console.error(err)
    }
  }

  const handleDeleteRoom = async (roomId) => {
    try {
      await deleteAdminRoom(roomId)
      setRooms((prev) => prev.filter((room) => room._id !== roomId))
      success('Room deleted successfully')
    } catch (err) {
      toastError('Unable to delete room')
      console.error(err)
    }
  }

  return (
    <AdminLayout
      title="Room management"
      subtitle="Manage room inventory, pricing, and availability."
      actions={
        <Button variant="primary" className="inline-flex items-center gap-2" onClick={openCreateRoom}>
          <HiPlus className="h-5 w-5" /> Add room
        </Button>
      }
    >
      <div className="space-y-6">
        {loading ? (
          <LoadingSkeleton rows={3} />
        ) : groupedRooms.length === 0 ? (
          <EmptyState
            icon="🛏️"
            title="No room inventory found"
            description="Add hotels and room types to publish your room inventory."
          >
            <Button onClick={openCreateRoom}>Add room</Button>
          </EmptyState>
        ) : (
          <div className="space-y-6">
            {groupedRooms.map(({ hotel, rooms: hotelRooms }) => (
              <div key={hotel._id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setCollapsedHotels((prev) => ({ ...prev, [hotel._id]: !prev[hotel._id] }))}
                  className="flex w-full items-center justify-between gap-4 border-b border-gray-100 px-6 py-5 text-left transition-all duration-200 hover:bg-slate-50"
                >
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-brand-600">{hotel.city}</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">{hotel.name}</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge label={`${hotelRooms.length} rooms`} variant="info" />
                    {collapsedHotels[hotel._id] ? <HiChevronUp className="h-6 w-6 text-slate-500" /> : <HiChevronDown className="h-6 w-6 text-slate-500" />}
                  </div>
                </button>
                {!collapsedHotels[hotel._id] && (
                  <div className="space-y-4 p-6">
                    {hotelRooms.length === 0 ? (
                      <div className="rounded-3xl bg-slate-50 p-6 text-slate-600">No rooms created for this hotel yet.</div>
                    ) : (
                      hotelRooms.map((room) => (
                        <div key={room._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-slate-900">{room.roomType}</h3>
                              <p className="mt-2 text-slate-600">{room.description || 'No room description yet.'}</p>
                              <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                                <Badge label={`Capacity ${room.capacity}`} />
                                <Badge label={`Available ${room.availableRooms}`} variant={room.availableRooms > 0 ? 'success' : 'danger'} />
                              </div>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                              <div className="flex items-center gap-3">
                                <label className="text-sm text-slate-600">Price</label>
                                <input
                                  type="number"
                                  value={editingRoom?._id === room._id ? editingValues.price : room.price}
                                  onChange={(e) => editingRoom?._id === room._id && setEditingValues((prev) => ({ ...prev, price: Number(e.target.value) }))}
                                  className="w-24 rounded-3xl border border-slate-200 bg-white px-3 py-2 text-slate-700"
                                />
                              </div>
                              <div className="flex items-center gap-3">
                                <label className="text-sm text-slate-600">Availability</label>
                                <input
                                  type="number"
                                  value={editingRoom?._id === room._id ? editingValues.availableRooms : room.availableRooms}
                                  onChange={(e) => editingRoom?._id === room._id && setEditingValues((prev) => ({ ...prev, availableRooms: Number(e.target.value) }))}
                                  className="w-24 rounded-3xl border border-slate-200 bg-white px-3 py-2 text-slate-700"
                                />
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button variant="secondary" className="px-4 py-2 text-sm" onClick={() => toggleRoomAvailability(room)}>
                                  {room.availableRooms > 0 ? 'Mark sold out' : 'Mark available'}
                                </Button>
                                {editingRoom?._id === room._id ? (
                                  <Button className="px-4 py-2 text-sm" onClick={handleSaveRoomChanges}>
                                    Save
                                  </Button>
                                ) : (
                                  <Button variant="secondary" className="px-4 py-2 text-sm" onClick={() => handleEditRoom(room)}>
                                    Edit
                                  </Button>
                                )}
                                <Button variant="danger" className="px-4 py-2 text-sm" onClick={() => handleDeleteRoom(room._id)}>
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={createOpen} title="Create room" onClose={() => setCreateOpen(false)}>
        <div className="grid gap-4">
          <label className="block">
            <span className="text-sm text-slate-600">Hotel</span>
            <select
              value={formDetails.hotelId}
              onChange={(e) => setFormDetails((prev) => ({ ...prev, hotelId: e.target.value }))}
              className="mt-2 w-full rounded-2xl border border-gray-100 bg-slate-50 px-4 py-3"
            >
              <option value="">Select hotel</option>
              {hotels.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </label>

          {['roomType', 'price', 'capacity', 'availableRooms'].map((name) => (
            <label key={name} className="block">
              <span className="text-sm text-slate-600">{name === 'roomType' ? 'Room type' : name.charAt(0).toUpperCase() + name.slice(1)}</span>
              <input
                type={name === 'price' || name === 'capacity' || name === 'availableRooms' ? 'number' : 'text'}
                value={formDetails[name]}
                onChange={(e) =>
                  setFormDetails((prev) => ({
                    ...prev,
                    [name]: name === 'price' || name === 'capacity' || name === 'availableRooms' ? Number(e.target.value) : e.target.value,
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-gray-100 bg-slate-50 px-4 py-3"
              />
            </label>
          ))}

          <label className="block">
            <span className="text-sm text-slate-600">Amenities (comma separated)</span>
            <input
              value={formDetails.amenities}
              onChange={(e) => setFormDetails((prev) => ({ ...prev, amenities: e.target.value }))}
              className="mt-2 w-full rounded-2xl border border-gray-100 bg-slate-50 px-4 py-3"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-600">Image URLs (comma separated)</span>
            <input
              value={formDetails.images}
              onChange={(e) => setFormDetails((prev) => ({ ...prev, images: e.target.value }))}
              className="mt-2 w-full rounded-2xl border border-gray-100 bg-slate-50 px-4 py-3"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-600">Description</span>
            <textarea
              value={formDetails.description}
              onChange={(e) => setFormDetails((prev) => ({ ...prev, description: e.target.value }))}
              className="mt-2 w-full rounded-2xl border border-gray-100 bg-slate-50 px-4 py-3"
              rows={4}
            />
          </label>

          <Button onClick={handleSaveRoom}>Create room</Button>
        </div>
      </Modal>
    </AdminLayout>
  )
}

export default AdminRooms
