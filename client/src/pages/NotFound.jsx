import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">
      <p className="text-sm uppercase tracking-[0.2em] text-brand-600">404 Error</p>
      <h1 className="mt-4 text-4xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-4 text-slate-600">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-brand-600 px-6 py-3 text-white hover:bg-brand-700">
        Return home
      </Link>
    </div>
  )
}

export default NotFound
