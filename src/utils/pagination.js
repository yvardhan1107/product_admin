/**
 * Helper utilities for custom pagination logic without 3rd party libraries.
 */

export const calculateSkip = (page, limit) => {
  const safePage = Math.max(1, parseInt(page, 10) || 1)
  const safeLimit = Math.max(1, parseInt(limit, 10) || 10)
  return (safePage - 1) * safeLimit
}

export const calculateTotalPages = (total, limit) => {
  const safeTotal = Math.max(0, parseInt(total, 10) || 0)
  const safeLimit = Math.max(1, parseInt(limit, 10) || 10)
  return Math.max(1, Math.ceil(safeTotal / safeLimit))
}

export const getShowingRange = (page, limit, total) => {
  if (total === 0) return { start: 0, end: 0, total: 0 }
  const safePage = Math.max(1, parseInt(page, 10) || 1)
  const safeLimit = Math.max(1, parseInt(limit, 10) || 10)
  const start = (safePage - 1) * safeLimit + 1
  const end = Math.min(safePage * safeLimit, total)
  return { start, end, total }
}

/**
 * Generates an array of page numbers with ellipsis for large page counts.
 * E.g., [1, 2, 3, 4, 5, '...', 20] or [1, '...', 4, 5, 6, '...', 20]
 */
export const getPaginationPages = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = []
  const delta = 1 // Number of pages to show around current page

  // Always show first page
  pages.push(1)

  const left = currentPage - delta
  const right = currentPage + delta

  if (left > 2) {
    pages.push('...')
  }

  for (let i = Math.max(2, left); i <= Math.min(totalPages - 1, right); i++) {
    pages.push(i)
  }

  if (right < totalPages - 1) {
    pages.push('...')
  }

  // Always show last page
  pages.push(totalPages)

  return pages
}
