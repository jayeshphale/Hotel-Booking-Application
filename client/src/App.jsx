import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { BookingProvider } from './context/BookingContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Hotels from './pages/Hotels.jsx'
import HotelDetails from './pages/HotelDetails.jsx'
import Checkout from './pages/Checkout.jsx'
import Confirmation from './pages/Confirmation.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import MyBookings from './pages/MyBookings.jsx'
import Wallet from './pages/Wallet.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminHotels from './pages/admin/AdminHotels.jsx'
import AdminRooms from './pages/admin/AdminRooms.jsx'
import AdminBookings from './pages/admin/AdminBookings.jsx'
import AdminCustomers from './pages/admin/AdminCustomers.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-50 text-slate-900">
            <Navbar />
            <main className="px-4 py-6 md:px-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/:id" element={<HotelDetails />} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/confirmation" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
              <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
              <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/hotels" element={<ProtectedRoute adminOnly><AdminHotels /></ProtectedRoute>} />
              <Route path="/admin/rooms" element={<ProtectedRoute adminOnly><AdminRooms /></ProtectedRoute>} />
              <Route path="/admin/bookings" element={<ProtectedRoute adminOnly><AdminBookings /></ProtectedRoute>} />
              <Route path="/admin/customers" element={<ProtectedRoute adminOnly><AdminCustomers /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
      </BookingProvider>
    </AuthProvider>
  )
}

export default App
