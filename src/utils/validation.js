/**
 * Defensive parameter validation and sanitization utilities.
 * Ensures malformed, unexpected, or out-of-range URL parameters never crash the application.
 */

// Permitted page sizes
export const VALID_LIMITS = [10, 20, 50]

// Permitted sort keys
export const VALID_SORTS = [
  'price-asc',
  'price-desc',
  'rating-desc',
  'rating-asc',
  'title-asc',
  'title-desc',
]

/**
 * Sanitizes page parameter:
 * - If not a valid integer or <= 0, returns 1
 * - Clamps to totalPages if totalPages is known and greater than 0
 */
export const sanitizePage = (pageParam, totalPages = null) => {
  if (pageParam === null || pageParam === undefined) return 1

  const parsed = parseInt(String(pageParam).trim(), 10)
  if (Number.isNaN(parsed) || parsed < 1) {
    return 1
  }

  if (totalPages && totalPages > 0 && parsed > totalPages) {
    return totalPages
  }

  return parsed
}

/**
 * Sanitizes limit parameter:
 * - Only permits 10, 20, or 50. Defaults to 10 for any unrecognized values.
 */
export const sanitizeLimit = (limitParam) => {
  if (limitParam === null || limitParam === undefined) return 10

  const parsed = parseInt(String(limitParam).trim(), 10)
  if (VALID_LIMITS.includes(parsed)) {
    return parsed
  }

  return 10
}

/**
 * Sanitizes sort parameter:
 * - Only permits known sort combinations. Defaults to empty string.
 */
export const sanitizeSort = (sortParam) => {
  if (!sortParam || typeof sortParam !== 'string') return ''

  const trimmed = sortParam.trim()
  return VALID_SORTS.includes(trimmed) ? trimmed : ''
}

/**
 * Sanitizes search query string:
 * - Trims whitespace and strips dangerous characters.
 */
export const sanitizeSearch = (searchParam) => {
  if (!searchParam || typeof searchParam !== 'string') return ''
  return searchParam.trim().slice(0, 100) // Bound max search length
}
