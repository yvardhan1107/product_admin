import { Loader2 } from 'lucide-react'

export default function Loader({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  className = '',
}) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  }

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
        <Loader2 className={`${sizes[size] || sizes.md} animate-spin`} />
      </div>
      {text && (
        <p className="text-xs font-semibold text-slate-500 tracking-wide">
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        {spinner}
      </div>
    )
  }

  return spinner
}
