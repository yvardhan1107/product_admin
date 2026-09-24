import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
} from '../services/productApi'
import { calculateSkip } from '../utils/pagination'
import { useDebounce } from './useDebounce'
import axios from 'axios'
import toast from 'react-hot-toast'

/**
 * Custom hook to manage product fetching, pagination, debounced search,
 * category filtering, client-side sorting, and race-condition prevention.
 */
export function useProducts() {
  const [rawProducts, setRawProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)

  // Pagination states
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 400)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('')

  // Test mode: Simulate network delay (&delay=2000) for evaluator verification
  const [simulateLatency, setSimulateLatency] = useState(false)

  // Sequential request ID counter to guarantee older responses are never accepted
  const latestRequestId = useRef(0)

  // Load category list on mount
  useEffect(() => {
    let isMounted = true
    getCategories()
      .then((data) => {
        if (isMounted) setCategories(data || [])
      })
      .catch((err) => {
        console.error('Failed to load categories', err)
      })
    return () => {
      isMounted = false
    }
  }, [])

  // Handle Search vs Category mutual exclusivity
  // Assignment rule: DummyJSON cannot search and category filter simultaneously.
  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value)
    if (value.trim()) {
      setSelectedCategory('') // Clear category when user searches
    }
  }, [])

  const handleCategoryChange = useCallback((cat) => {
    setSelectedCategory(cat)
    if (cat) {
      setSearchQuery('') // Clear search when user selects category
    }
    setPage(1)
  }, [])

  // Reset page to 1 whenever search query changes
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  // Reset page to 1 whenever sort changes
  useEffect(() => {
    setPage(1)
  }, [sortBy])

  // Fetch logic with AbortController lifecycle
  useEffect(() => {
    const controller = new AbortController()
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
        } else if (selectedCategory) {
          data = await getProductsByCategory({
            category: selectedCategory,
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

        // Only update state if this is still the freshest request
        if (currentRequestId === latestRequestId.current) {
          setRawProducts(data.products || [])
          setTotal(data.total || 0)
        }
      } catch (err) {
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

    return () => {
      controller.abort()
    }
  }, [page, limit, debouncedSearch, selectedCategory, simulateLatency])

  // Apply Client-Side Sorting on current batch
  const products = useMemo(() => {
    if (!sortBy || !rawProducts.length) return rawProducts

    const sorted = [...rawProducts]
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => Number(a.price) - Number(b.price))
      case 'price-desc':
        return sorted.sort((a, b) => Number(b.price) - Number(a.price))
      case 'rating-desc':
        return sorted.sort((a, b) => Number(b.rating) - Number(a.rating))
      case 'rating-asc':
        return sorted.sort((a, b) => Number(a.rating) - Number(b.rating))
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title))
      default:
        return sorted
    }
  }, [rawProducts, sortBy])

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
    categories,
    loading,
    error,
    total,
    page,
    limit,
    searchQuery,
    setSearchQuery: handleSearchChange,
    selectedCategory,
    setSelectedCategory: handleCategoryChange,
    sortBy,
    setSortBy,
    simulateLatency,
    setSimulateLatency,
    handlePageChange,
    handlePageSizeChange,
    handleClearSearch,
    refresh: () => setPage((p) => p),
  }
}
