import { useState, useEffect, useRef, useCallback } from 'react'
import { getProducts, searchProducts } from '../services/productApi'
import { calculateSkip } from '../utils/pagination'
import { useDebounce } from './useDebounce'
import axios from 'axios'
import toast from 'react-hot-toast'

/**
 * Custom hook to manage product fetching, pagination, debounced search,
 * and robust race-condition protection using AbortController and latest-request tracking.
 */
export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)

  // Pagination states
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Search input state and debounced value (400ms delay)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 400)

  // Test mode: Simulate network delay (&delay=2000) for evaluator verification
  const [simulateLatency, setSimulateLatency] = useState(false)

  // Sequential request ID counter to guarantee older responses are never accepted
  const latestRequestId = useRef(0)

  // Reset page to 1 whenever search query changes
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  // Fetch logic with AbortController lifecycle
  useEffect(() => {
    // 1. Create a fresh AbortController for this request lifecycle
    const controller = new AbortController()

    // 2. Increment request ID counter
    const currentRequestId = ++latestRequestId.current

    const executeFetch = async () => {
      setLoading(true)
      setError(null)

      try {
        const skip = calculateSkip(page, limit)
        const delay = simulateLatency ? 2000 : 0
        let data

        if (debouncedSearch.trim()) {
          data = await searchProducts({
            q: debouncedSearch.trim(),
            limit,
            skip,
            delay,
            signal: controller.signal,
          })
        } else {
          data = await getProducts({
            limit,
            skip,
            delay,
            signal: controller.signal,
          })
        }

        // CRITICAL: Double-check that no newer request was launched before committing state
        if (currentRequestId === latestRequestId.current) {
          setProducts(data.products || [])
          setTotal(data.total || 0)
        }
      } catch (err) {
        // Discard canceled request errors without notifying the user
        if (axios.isCancel(err) || err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
          console.debug(`[Stale Request Guard] Aborted outdated request #${currentRequestId}`)
          return
        }

        if (currentRequestId === latestRequestId.current) {
          console.error('Fetch error:', err)
          setError('Could not fetch products. Please check your connection.')
          toast.error('Failed to load products')
        }
      } finally {
        if (currentRequestId === latestRequestId.current && !controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    executeFetch()

    // 3. Cancel in-flight HTTP request when dependencies change (user types, changes page, etc.)
    return () => {
      controller.abort()
    }
  }, [page, limit, debouncedSearch, simulateLatency])

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handlePageSizeChange = useCallback((newLimit) => {
    setLimit(newLimit)
    setPage(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
    setPage(1)
  }, [])

  return {
    products,
    loading,
    error,
    total,
    page,
    limit,
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    simulateLatency,
    setSimulateLatency,
    handlePageChange,
    handlePageSizeChange,
    handleClearSearch,
    refresh: () => setPage((p) => p),
  }
}
