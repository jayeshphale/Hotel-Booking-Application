import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../services/authService.js'
import { useAuth } from '../context/AuthContext.jsx'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await loginUser({ email, password })
      login({ name: data.name, email: data.email, role: data.role }, data.token)
      navigate('/')
    } catch (err) {
      setError(err?.message || 'Unable to login. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold text-slate-900">Login</h1>
      <p className="mt-2 text-slate-600">Access your account and manage bookings.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <div className="rounded-3xl bg-rose-100 p-4 text-sm text-rose-700">{error}</div>}
        <label className="block">
          <span className="text-sm text-slate-600">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-600">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
        </label>
        <button type="submit" disabled={loading} className="w-full rounded-full bg-brand-600 px-5 py-3 text-white hover:bg-brand-700 disabled:opacity-60">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Don't have an account? <Link to="/register" className="text-brand-600">Register</Link>
      </p>
    </div>
  )
}

export default Login
