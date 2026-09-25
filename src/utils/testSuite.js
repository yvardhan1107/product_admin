/**
 * Self-verifying sanity test suite for assignment edge cases.
 * Run in browser console or node to verify defensive logic integrity.
 */

import { calculateSkip, calculateTotalPages, getShowingRange } from './pagination'
import { sanitizePage, sanitizeLimit, sanitizeSort, sanitizeSearch } from './validation'

export function runEdgeCaseTests() {
  const results = []

  const test = (description, assertion) => {
    try {
      const passed = Boolean(assertion())
      results.push({ description, status: passed ? 'PASSED' : 'FAILED' })
      if (!passed) console.error(`[FAIL] ${description}`)
    } catch (err) {
      results.push({ description, status: 'ERROR', error: err.message })
      console.error(`[ERROR] ${description}`, err)
    }
  }

  // 1. Pagination Edge Cases
  test('Skip calculation for page 1 is 0', () => calculateSkip(1, 10) === 0)
  test('Skip calculation for page 2 is 10', () => calculateSkip(2, 10) === 10)
  test('Skip calculation with negative page falls back to 0', () => calculateSkip(-5, 10) === 0)
  test('Skip calculation with NaN page falls back to 0', () => calculateSkip('abc', 10) === 0)
  test('Total pages for 194 items with limit 10 is 20', () => calculateTotalPages(194, 10) === 20)
  test('Total pages for 0 items returns 1', () => calculateTotalPages(0, 10) === 1)
  test('Showing range text bounds correctly for partial last page', () => {
    const range = getShowingRange(20, 10, 194)
    return range.start === 191 && range.end === 194 && range.total === 194
  })

  // 2. URL Sanitization Edge Cases
  test('sanitizePage with "abc" returns 1', () => sanitizePage('abc') === 1)
  test('sanitizePage with "-10" returns 1', () => sanitizePage('-10') === 1)
  test('sanitizePage with "0" returns 1', () => sanitizePage('0') === 1)
  test('sanitizePage with "999" clamps to totalPages (20)', () => sanitizePage('999', 20) === 20)
  test('sanitizeLimit with invalid "9999" falls back to 10', () => sanitizeLimit('9999') === 10)
  test('sanitizeLimit with valid "50" returns 50', () => sanitizeLimit('50') === 50)
  test('sanitizeSort with malicious string returns empty default', () => sanitizeSort('<script>') === '')
  test('sanitizeSort with "price-asc" returns "price-asc"', () => sanitizeSort('price-asc') === 'price-asc')
  test('sanitizeSearch trims whitespace and bounds length', () => sanitizeSearch('  phone  ') === 'phone')

  console.table(results)
  return results
}
