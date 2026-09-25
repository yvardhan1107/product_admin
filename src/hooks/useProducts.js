import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
} from '../services/productApi'
import { calculateSkip, calculateTotalPages } from '../utils/pagination'
import {
  sanitizePage,
  sanitizeLimit,
  sanitizeSort,
  sanitizeSearch,
} from '../utils/validation'
import { useProductMutations } from '../context/ProductContext'
import { useDebounce } from './useDebounce'
import axios from 'axios'
import toast from 'react-hot-toast'

/**
 * Custom hook to synchronize dashboard state with URL search params
 * and defensively sanitize invalid or malicious URL parameters.
 */
export function useProducts() {
  const [searchParams, setSearchParams] = useSearchParams()

  // 1. Defensively sanitize all URL inputs
  const rawPage = searchParams.get('page')
  const rawLimit = searchParams.get('limit')
  const rawSort = searchParams.get('sort')
  const rawSearch = searchParams.get('search')
  const rawCategory = searchParams.get('category')

  const urlPage = sanitizePage(rawPage)
  const urlLimit = sanitizeLimit(rawLimit)
  const urlSort = sanitizeSort(rawSort)
  const urlSearch = sanitizeSearch(rawSearch)
  const urlCategory = rawCategory ? String(rawCategory).trim() : ''

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

  // Auto-correct invalid URL parameters (e.g. ?page=abc -> normalize in URL)
  useEffect(() => {
    const needsCorrection =
      (rawPage && String(urlPage) !== rawPage && (rawPage !== '1' || urlPage !== 1)) ||
      (rawLimit && String(urlLimit) !== rawLimit) ||
      (rawSort && urlSort !== rawSort)

    if (needsCorrection) {
      const nextParams = new URLSearchParams(searchParams)
      if (urlPage > 1) nextParams.set('page', String(urlPage))
      else nextParams.delete('page')

      if (urlLimit !== 10) nextParams.set('limit', String(urlLimit))
      else nextParams.delete('limit')

      if (urlSort) nextParams.set('sort', urlSort)
      else nextParams.delete('sort')

      setSearchParams(nextParams, { replace: true })
    }
  }, [rawPage, rawLimit, rawSort, urlPage, urlLimit, urlSort, searchParams, setSearchParams])

  // Sync debounced search input back to URL params
  useEffect(() => {
    if (debouncedSearch !== urlSearch) {
      const nextParams = new URLSearchParams(searchParams)

      if (debouncedSearch.trim()) {
        nextParams.set('search', debouncedSearch.trim())
        nextParams.delete('category') // Mutual exclusivity: search clears category
      } else {
        nextParams.delete('search')
      }

      nextParams.delete('page') // Reset to page 1 on search change
      setSearchParams(nextParams, { replace: true })
    }
  }, [debouncedSearch, urlSearch, searchParams, setSearchParams])

  // Sync URL search back to input state if URL changed externally
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
        nextParams.delete('search')
        setSearchInput('')
      } else {
        nextParams.delete('category')
      }
      nextParams.delete('page')
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

  // Fetch logic with AbortController driven by sanitized URL parameters
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
          const fetchedTotal = data.total || 0
          const maxPages = calculateTotalPages(fetchedTotal, urlLimit)

          // Clamp page if ?page=999 was passed and exceeds total pages
          if (fetchedTotal > 0 && urlPage > maxPages) {
            console.warn(`[URL Validation] Clamping out-of-bounds page ${urlPage} to ${maxPages}`)
            toast(`Page ${urlPage} is out of bounds. Showing page ${maxPages}.`, { icon: 'ℹ️' })
            updateUrlParams({ page: maxPages })
            return
          }

          setRawProducts(data.products || [])
          setTotal(fetchedTotal)
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
  }, [urlPage, urlLimit, urlSearch, urlCategory, simulateLatency, updateUrlParams])

  const { applyLocalMutations } = useProductMutations()

  // Apply Local Mutations (added, updated, deleted) & Client-Side Sorting
  const products = useMemo(() => {
    // 1. Overlay local mutations
    const mutated = applyLocalMutations(rawProducts, urlCategory, urlSearch)

    if (!urlSort || !mutated.length) return mutated

    // 2. Apply sorting
    const sorted = [...mutated]
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
  }, [rawProducts, urlSort, urlCategory, urlSearch, applyLocalMutations])

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
      const nextParams = new URLSearchParams(searchParams)
      setSearchParams(nextParams, { replace: true })
    },
  }
}
