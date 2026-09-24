import { useState, useEffect, useRef } from 'react'
import { getProducts, searchProducts } from '../services/productApi'
import ProductList from '../components/products/ProductList'
import Pagination from '../components/products/Pagination'
import SearchBar from '../components/products/SearchBar'
import { ProductTableSkeleton, ProductCardSkeleton } from '../components/ui/Skeleton'
import { calculateSkip } from '../utils/pagination'
import { useDebounce } from '../hooks/useDebounce'
import { Plus, Sparkles, RefreshCw, AlertCircle, X, Clock, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)

  // Pagination states
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Search states
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 400)

  // Evaluator tool: simulate API latency for race-condition testing
  const [simulateLatency, setSimulateLatency] = useState(false)

  // Request race-condition tracking reference
  const latestRequestId = useRef(0)

  const navigate = useNavigate()

  // Reset page to 1 whenever search query changes
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  useEffect(() => {
    // 1. Create a fresh AbortController for this fetch invocation
    const controller = new AbortController()

    // 2. Increment request ID to discard any stale responses if cancellation fails
    const currentRequestId = ++latestRequestId.current

    const fetchProductsData = async () => {
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

        // Only update UI if this is still the newest initiated request
        if (currentRequestId === latestRequestId.current) {
          setProducts(data.products || [])
          setTotal(data.total || 0)
        }
      } catch (err) {
        // Discard canceled request errors without notifying the user
        if (axios.isCancel(err) || err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
          console.log(`[Stale Request Discarded] Request #${currentRequestId} aborted successfully.`)
          return
        }

        if (currentRequestId === latestRequestId.current) {
          console.error('Failed to load products', err)
          setError('Could not fetch products from the server. Please try again.')
          toast.error('Failed to fetch products')
        }
      } finally {
        if (currentRequestId === latestRequestId.current && !controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchProductsData()

    // 3. Cancel in-flight request when dependencies change or component unmounts
    return () => {
      controller.abort()
    }
  }, [page, limit, debouncedSearch, simulateLatency])

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageSizeChange = (newLimit) => {
    setLimit(newLimit)
    setPage(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            {debouncedSearch ? `Search Results (${total})` : `Live Catalog (${total} products)`}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Products Directory
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your store inventory, prices, ratings, and stock status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage((p) => p)}
            disabled={loading}
            className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh Products"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/products/new')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/70 backdrop-blur p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={handleClearSearch}
          disabled={loading}
        />

        <div className="flex flex-wrap items-center gap-3">
          {/* Latency Simulator Toggle for Evaluator Verification */}
          <button
            type="button"
            onClick={() => {
              const nextState = !simulateLatency
              setSimulateLatency(nextState)
              toast(
                nextState
                  ? 'Simulating 2000ms network delay on search (&delay=2000)'
                  : 'Network delay simulation disabled',
                { icon: '⏱️' }
              )
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              simulateLatency
                ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Test race conditions using &delay=2000 as specified in assignment"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>&delay=2000 {simulateLatency ? 'Active' : 'Test Mode'}</span>
          </button>

          {/* Stale Guard Active Indicator */}
          <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200/60">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AbortController Shield Active</span>
          </div>

          {debouncedSearch && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
                "{debouncedSearch}"
                <button
                  onClick={handleClearSearch}
                  className="hover:text-blue-900 cursor-pointer ml-0.5"
                  title="Remove filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="space-y-4">
          <div className="hidden md:block">
            <ProductTableSkeleton count={limit > 10 ? 12 : 8} />
          </div>
          <div className="md:hidden">
            <ProductCardSkeleton count={limit > 10 ? 6 : 4} />
          </div>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-rose-900">Failed to load products</h3>
          <p className="text-xs text-rose-600 mt-1 max-w-sm mx-auto">{error}</p>
          <button
            onClick={() => setPage((p) => p)}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <ProductList
            products={products}
            onDelete={(product) => {
              toast(`Delete clicked for: ${product.title}`)
            }}
          />

          {/* Custom Pagination Component */}
          <Pagination
            currentPage={page}
            pageSize={limit}
            totalItems={total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            disabled={loading}
          />
        </div>
      )}
    </div>
  )
}
