import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  calculateTotalPages,
  getShowingRange,
  getPaginationPages,
} from '../../utils/pagination'

export default function Pagination({
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  disabled = false,
}) {
  const totalPages = calculateTotalPages(totalItems, pageSize)
  const { start, end, total } = getShowingRange(currentPage, pageSize, totalItems)
  const pages = getPaginationPages(currentPage, totalPages)

  if (totalItems === 0) return null

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 transition-all">
      {/* Left: Showing Range Indicator */}
      <div className="text-xs sm:text-sm text-slate-500 font-medium text-center md:text-left">
        Showing <span className="font-bold text-slate-800">{start}</span>–
        <span className="font-bold text-slate-800">{end}</span> of{' '}
        <span className="font-bold text-slate-800">{total}</span> products
      </div>

      {/* Center: Page Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1 || disabled}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Mobile View: Compact Page Counter */}
        <div className="sm:hidden px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
          {currentPage} / {totalPages}
        </div>

        {/* Desktop/Tablet View: Numeric Page Buttons with Ellipsis */}
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((pageNum, idx) => {
            if (pageNum === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-slate-400 font-bold select-none"
                >
                  &hellip;
                </span>
              )
            }

            const isActive = pageNum === currentPage

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                disabled={disabled}
                className={`min-w-9 h-9 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/30 border border-blue-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                } disabled:opacity-50`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages || disabled}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
          title="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Page Size Selector Dropdown */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="pageSize"
          className="text-xs text-slate-500 font-semibold whitespace-nowrap"
        >
          Show per page:
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => {
            const newSize = parseInt(e.target.value, 10)
            onPageSizeChange(newSize)
          }}
          disabled={disabled}
          className="py-1.5 pl-3 pr-8 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
        >
          <option value={10}>10 items</option>
          <option value={20}>20 items</option>
          <option value={50}>50 items</option>
        </select>
      </div>
    </div>
  )
}
