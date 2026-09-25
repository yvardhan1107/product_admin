import { AlertCircle, RefreshCw } from 'lucide-react'

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load the data from the server. Please check your connection and try again.',
  onRetry,
  isRetrying = false,
  className = '',
}) {
  return (
    <div
      className={`bg-white rounded-3xl border border-rose-200/80 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs my-6 animate-in fade-in duration-200 ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-4 shadow-xs">
        <AlertCircle className="w-8 h-8" />
      </div>

      <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/60">
        Connection Error
      </span>

      <h3 className="text-xl font-black text-slate-900 mt-3 mb-1.5">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-rose-500/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Retrying...' : 'Retry Connection'}</span>
        </button>
      )}
    </div>
  )
}
