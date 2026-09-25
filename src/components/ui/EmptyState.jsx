import { PackageOpen, RotateCcw } from 'lucide-react'

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'Try adjusting your search criteria, removing filters, or adding a new product.',
  actionLabel = 'Clear All Filters',
  onAction,
  className = '',
}) {
  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-14 text-center max-w-lg mx-auto shadow-xs my-4 animate-in fade-in duration-200 ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-400 flex items-center justify-center mx-auto mb-4 shadow-xs">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-1.5">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
        {description}
      </p>

      {onAction && actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-blue-500/20 active:scale-[0.99] transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  )
}
