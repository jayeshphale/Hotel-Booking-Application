const variants = {
  primary: 'bg-brand-600 text-white border border-brand-600 hover:bg-brand-700',
  secondary: 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100',
  danger: 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 border border-transparent',
}

const Button = ({ variant = 'primary', className = '', children, ...props }) => {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-all duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
