import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useProductMutations } from '../context/ProductContext'
import ProductList from '../components/products/ProductList'
import Pagination from '../components/products/Pagination'
import ProductFilters from '../components/products/ProductFilters'
import DeleteConfirmModal from '../components/products/DeleteConfirmModal'
import ErrorState from '../components/ui/ErrorState'
import { ProductTableSkeleton, ProductCardSkeleton } from '../components/ui/Skeleton'
import { Plus, Sparkles, RefreshCw, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ProductsPage() {
  const {
    products,
    categories,
    loading,
    error,
    total,
    page,
    limit,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    simulateLatency,
    setSimulateLatency,
    handlePageChange,
    handlePageSizeChange,
    handleClearSearch,
    refresh,
  } = useProducts()

  const { deleteProduct } = useProductMutations()
  const navigate = useNavigate()

  // Delete modal state
  const [productToDelete, setProductToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = async (productId) => {
    setIsDeleting(true)
    try {
      await deleteProduct(productId)
      toast.success(`Product "${productToDelete?.title}" deleted successfully`)
      setProductToDelete(null)
    } catch (err) {
      console.error('Failed to delete product', err)
      toast.error('Failed to delete product. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            {searchQuery
              ? `Search: "${searchQuery}" (${total})`
              : selectedCategory
              ? `Category: ${selectedCategory} (${total})`
              : `Live Catalog (${total} products)`}
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
            onClick={refresh}
            disabled={loading}
            className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh Products"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => navigate('/products/new')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Unified Filters Bar (Search + Category + Sort + Reset) */}
      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={handleClearSearch}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        disabled={loading}
      />

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
        <ErrorState
          title="Failed to load catalog products"
          message={error}
          onRetry={refresh}
          isRetrying={loading}
        />
      ) : (
        <div className="space-y-4">
          <ProductList
            products={products}
            onDelete={(product) => setProductToDelete(product)}
            onClearFilters={handleClearSearch}
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

      {/* Delete Confirmation Popup Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(productToDelete)}
        product={productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}
