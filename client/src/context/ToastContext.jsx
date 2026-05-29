import { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)
let toastId = 0

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const notify = (message, type = 'success') => {
    const id = toastId += 1
    setToasts((prev) => [...prev, { id, message, type }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 4200)
  }

  const value = useMemo(
    () => ({
      success: (message) => notify(message, 'success'),
      error: (message) => notify(message, 'error'),
      warning: (message) => notify(message, 'warning'),
      info: (message) => notify(message, 'info'),
    }),
    []
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-2xl border px-4 py-3 shadow-sm transition-all duration-200 ${
              toast.type === 'success'
                ? 'border-emerald-100 bg-emerald-50 text-emerald-800'
                : toast.type === 'error'
                ? 'border-rose-100 bg-rose-50 text-rose-800'
                : toast.type === 'warning'
                ? 'border-amber-100 bg-amber-50 text-amber-800'
                : 'border-sky-100 bg-sky-50 text-sky-800'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
