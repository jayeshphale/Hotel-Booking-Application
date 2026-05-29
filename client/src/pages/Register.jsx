import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/authService.js'
import { useAuth } from '../context/AuthContext.jsx'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await registerUser({ name, email, password, phone })
      login({ name: data.name, email: data.email, role: data.role }, data.token)
      navigate('/')
    } catch (err) {
      setError(err?.message || 'Unable to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold text-slate-900">Register</h1>
      <p className="mt-2 text-slate-600">Create a secure account for reservations and booking history.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <div className="rounded-3xl bg-rose-100 p-4 text-sm text-rose-700">{error}</div>}
        <label className="block">
          <span className="text-sm text-slate-600">Full name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-600">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-600">Password</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-600">Phone</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
        </label>
        <button type="submit" disabled={loading} className="w-full rounded-full bg-brand-600 px-5 py-3 text-white hover:bg-brand-700 disabled:opacity-60">
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already have an account? <Link to="/login" className="text-brand-600">Login</Link>
      </p>
    </div>
  )
}

export default Register
