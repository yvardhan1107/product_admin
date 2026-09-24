import { useState, useEffect } from 'react'
import { getProducts } from '../services/productApi'
import ProductList from '../components/products/ProductList'
import { ProductTableSkeleton, ProductCardSkeleton } from '../components/ui/Skeleton'
import { Package, Plus, Sparkles, RefreshCw, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)

  const navigate = useNavigate()

  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProducts({ limit: 10, skip: 0 })
      setProducts(data.products || [])
      setTotal(data.total || 0)
    } catch (err) {
      console.error('Failed to load products', err)
      setError('Could not fetch products from the server. Please try again.')
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Live Catalog ({total} products)
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
            onClick={loadProducts}
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

      {/* Content Area */}
      {loading ? (
        <div>
          <div className="hidden md:block">
            <ProductTableSkeleton count={8} />
          </div>
          <div className="md:hidden">
            <ProductCardSkeleton count={4} />
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
            onClick={loadProducts}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : (
        <ProductList
          products={products}
          onDelete={(product) => {
            toast(`Delete clicked for: ${product.title}`)
          }}
        />
      )}
    </div>
  )
}
