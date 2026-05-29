import { useAuth } from '../context/AuthContext.jsx'

const Profile = () => {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold text-slate-900">My Profile</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Personal details</h2>
          <p className="mt-4 text-slate-600">Name: {user?.name}</p>
          <p className="text-slate-600">Email: {user?.email}</p>
          <p className="text-slate-600">Role: {user?.role}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Account</h2>
          <p className="mt-4 text-slate-600">Manage bookings, profile settings, and account details in one place.</p>
        </div>
      </div>
    </div>
  )
}

export default Profile
