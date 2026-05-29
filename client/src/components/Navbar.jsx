import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { HiOutlineMenu } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import { getWalletBalance } from '../services/paymentService.js'
import { formatINRFromPaise } from '../utils/currency.js'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [wallet, setWallet] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const { data } = await getWalletBalance()
        if (mounted) setWallet(data.balance)
      } catch (e) {
        // ignore
      }
    }
    if (user) load()
    return () => { mounted = false }
  }, [user])

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 shadow-sm shadow-slate-900/5 backdrop-blur-lg backdrop-saturate-150">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="text-xl font-semibold text-brand-600 tracking-[0.08em]">
          HotelBook
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition ${isActive ? 'text-slate-900 underline underline-offset-8 decoration-brand-500 decoration-2' : 'text-slate-600 hover:text-slate-900'}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/hotels"
            className={({ isActive }) =>
              `text-sm font-medium transition ${isActive ? 'text-slate-900 underline underline-offset-8 decoration-brand-500 decoration-2' : 'text-slate-600 hover:text-slate-900'}`
            }
          >
            Hotels
          </NavLink>
          {user && (
            <NavLink
              to="/my-bookings"
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-slate-900 underline underline-offset-8 decoration-brand-500 decoration-2' : 'text-slate-600 hover:text-slate-900'}`
              }
            >
              My Bookings
            </NavLink>
          )}
          {user && (
            <NavLink
              to="/wallet"
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-slate-900 underline underline-offset-8 decoration-brand-500 decoration-2' : 'text-slate-600 hover:text-slate-900'}`
              }
            >
              Wallet
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-slate-900 underline underline-offset-8 decoration-brand-500 decoration-2' : 'text-slate-600 hover:text-slate-900'}`
              }
            >
              Admin
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
                    <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 md:inline-block">
                      {user.name} {wallet != null && <span className="ml-2 text-sm text-slate-500">({formatINRFromPaise(wallet)})</span>}
                    </span>
              <button onClick={handleLogout} className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
