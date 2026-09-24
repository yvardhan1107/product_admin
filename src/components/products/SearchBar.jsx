import { Search, X } from 'lucide-react'

export default function SearchBar({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search products by title, brand...',
  disabled = false,
}) {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200/90 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50 disabled:bg-slate-50"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
