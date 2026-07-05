import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: ReactNode
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, icon, error, className = '', id, ...props },
  ref,
) {
  const inputId = id || props.name
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-300"
        >
          {label}
        </label>
      )}
      <div
        className={[
          'flex items-center gap-2 rounded-2xl border bg-white/5 px-4 py-3 transition-colors focus-within:border-brand-400',
          error ? 'border-red-500/60' : 'border-white/10',
        ].join(' ')}
      >
        {icon && <span className="text-slate-400">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none',
            className,
          ].join(' ')}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  )
})

export default Input
