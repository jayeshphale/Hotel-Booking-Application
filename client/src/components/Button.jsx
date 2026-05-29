const variantStyles = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  ghost: 'bg-transparent text-slate-900 hover:bg-slate-100 border border-transparent',
}

const Button = ({ variant = 'primary', className = '', children, ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 ease-in-out ${variantStyles[variant] || variantStyles.primary} ${props.disabled ? 'cursor-not-allowed opacity-80' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
