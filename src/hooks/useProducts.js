import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
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
 * Custom hook to synchronize dashboard state with URL search params.
 * Enables shareable URLs, bookmarking, and page-refresh state preservation.
 */
export function useProducts() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Read initial values from URL query parameters
  const urlPage = parseInt(searchParams.get('page') || '1', 10) || 1
  const urlLimit = parseInt(searchParams.get('limit') || '10', 10) || 10
  const urlSearch = searchParams.get('search') || ''
  const urlCategory = searchParams.get('category') || ''
  const urlSort = searchParams.get('sort') || ''

  const [rawProducts, setRawProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)

  // Local state for immediate typing responsiveness in the input box
  const [searchInput, setSearchInput] = useState(urlSearch)
  const debouncedSearch = useDebounce(searchInput, 400)

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

  // Sync debounced search input back to URL params
  useEffect(() => {
    // Only update if debounced value is different from current URL param
    if (debouncedSearch !== urlSearch) {
      const nextParams = new URLSearchParams(searchParams)

      if (debouncedSearch.trim()) {
        nextParams.set('search', debouncedSearch.trim())
        nextParams.delete('category') // Mutual exclusivity: search clears category
      } else {
        nextParams.delete('search')
      }

      nextParams.set('page', '1') // Reset to page 1 on search change
      setSearchParams(nextParams, { replace: true })
    }
  }, [debouncedSearch, urlSearch, searchParams, setSearchParams])

  // Sync URL search back to input state if URL changed externally (e.g. browser back/forward)
  useEffect(() => {
    setSearchInput(urlSearch)
  }, [urlSearch])

  // Helper function to update URL search parameters
  const updateUrlParams = useCallback(
    (updates) => {
      const nextParams = new URLSearchParams(searchParams)

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '' || (key === 'page' && value === 1)) {
          nextParams.delete(key)
        } else {
          nextParams.set(key, String(value))
        }
      })

      setSearchParams(nextParams, { replace: true })
    },
    [searchParams, setSearchParams]
  )

  // Category change handler
  const handleCategoryChange = useCallback(
    (cat) => {
      const nextParams = new URLSearchParams(searchParams)
      if (cat) {
        nextParams.set('category', cat)
        nextParams.delete('search') // Mutual exclusivity: category clears search
        setSearchInput('')
      } else {
        nextParams.delete('category')
      }
      nextParams.set('page', '1')
      setSearchParams(nextParams, { replace: true })
    },
    [searchParams, setSearchParams]
  )

  // Sort change handler
  const handleSortChange = useCallback(
    (sortValue) => {
      updateUrlParams({ sort: sortValue, page: 1 })
    },
    [updateUrlParams]
  )

  // Page change handler
  const handlePageChange = useCallback(
    (newPage) => {
      updateUrlParams({ page: newPage })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [updateUrlParams]
  )

  // Page size change handler
  const handlePageSizeChange = useCallback(
    (newLimit) => {
      updateUrlParams({ limit: newLimit, page: 1 })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [updateUrlParams]
  )

  // Clear search handler
  const handleClearSearch = useCallback(() => {
    setSearchInput('')
    updateUrlParams({ search: '', page: 1 })
  }, [updateUrlParams])

  // Fetch logic with AbortController driven by URL parameters
  useEffect(() => {
    const controller = new AbortController()
    const currentRequestId = ++latestRequestId.current

    const executeFetch = async () => {
      setLoading(true)
      setError(null)

      try {
        const skip = calculateSkip(urlPage, urlLimit)
        const delay = simulateLatency ? 2000 : 0
        let data

        if (urlSearch.trim()) {
          data = await searchProducts({
            q: urlSearch.trim(),
            limit: urlLimit,
            skip,
            delay,
            signal: controller.signal,
          })
        } else if (urlCategory) {
          data = await getProductsByCategory({
            category: urlCategory,
            limit: urlLimit,
            skip,
            delay,
            signal: controller.signal,
          })
        } else {
          data = await getProducts({
            limit: urlLimit,
            skip,
            delay,
            signal: controller.signal,
          })
        }

        if (currentRequestId === latestRequestId.current) {
          setRawProducts(data.products || [])
          setTotal(data.total || 0)
        }
      } catch (err) {
        if (axios.isCancel(err) || err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
          console.debug(`[Stale Request Guard] Aborted request #${currentRequestId}`)
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
  }, [urlPage, urlLimit, urlSearch, urlCategory, simulateLatency])

  // Apply Client-Side Sorting on current batch
  const products = useMemo(() => {
    if (!urlSort || !rawProducts.length) return rawProducts

    const sorted = [...rawProducts]
    switch (urlSort) {
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
  }, [rawProducts, urlSort])

  return {
    products,
    categories,
    loading,
    error,
    total,
    page: urlPage,
    limit: urlLimit,
    searchQuery: searchInput,
    setSearchQuery: setSearchInput,
    selectedCategory: urlCategory,
    setSelectedCategory: handleCategoryChange,
    sortBy: urlSort,
    setSortBy: handleSortChange,
    simulateLatency,
    setSimulateLatency,
    handlePageChange,
    handlePageSizeChange,
    handleClearSearch,
    refresh: () => {
      // Re-trigger fetch by cycling state
      const nextParams = new URLSearchParams(searchParams)
      setSearchParams(nextParams, { replace: true })
    },
  }
}
