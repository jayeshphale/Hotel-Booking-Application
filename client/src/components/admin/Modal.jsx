import { AnimatePresence, motion } from 'framer-motion'

const Modal = ({ open, title, children, onClose }) => {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-slate-900/40 px-4 py-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
            <div className="mt-6">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default Modal
