import { Filter, ArrowUpDown, X, Sparkles } from 'lucide-react'
import SearchBar from './SearchBar'

export default function ProductFilters({
  searchQuery,
  onSearchChange,
  onClearSearch,
  categories = [],
  selectedCategory = '',
  onCategoryChange,
  sortBy = '',
  onSortChange,
  disabled = false,
}) {
  const hasActiveFilters = Boolean(searchQuery.trim() || selectedCategory || sortBy)

  const handleResetAll = () => {
    onClearSearch()
    onCategoryChange('')
    onSortChange('')
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Controls Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1 max-w-lg">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            onClear={onClearSearch}
            disabled={disabled}
            placeholder={
              selectedCategory
                ? `Search clears '${selectedCategory}' filter...`
                : 'Search products by title, brand...'
            }
          />
        </div>

        {/* Filters Group (Category + Sort) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="relative flex-1 sm:flex-initial min-w-[170px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Filter className="w-4 h-4" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              disabled={disabled}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200/90 bg-white text-slate-800 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer disabled:opacity-50 disabled:bg-slate-50 capitalize"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => {
                const slug = typeof cat === 'string' ? cat : cat.slug
                const name = typeof cat === 'string' ? cat.replace('-', ' ') : cat.name
                return (
                  <option key={slug} value={slug} className="capitalize">
                    {name}
                  </option>
                )
              })}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex-1 sm:flex-initial min-w-[170px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown className="w-4 h-4" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              disabled={disabled}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200/90 bg-white text-slate-800 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer disabled:opacity-50 disabled:bg-slate-50"
            >
              <option value="">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetAll}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all cursor-pointer whitespace-nowrap active:scale-95"
              title="Reset all search, category, and sort filters"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Active filters:</span>

          {searchQuery.trim() && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
              Search: "{searchQuery}"
              <button
                onClick={onClearSearch}
                className="hover:text-blue-900 cursor-pointer ml-1"
                title="Remove search filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCategory && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/60 capitalize">
              Category: {selectedCategory}
              <button
                onClick={() => onCategoryChange('')}
                className="hover:text-indigo-900 cursor-pointer ml-1"
                title="Remove category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {sortBy && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-semibold border border-amber-200/60">
              Sorted: {sortBy.replace('-', ' ')}
              <button
                onClick={() => onSortChange('')}
                className="hover:text-amber-900 cursor-pointer ml-1"
                title="Clear sorting"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
