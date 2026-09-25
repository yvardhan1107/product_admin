import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProductById } from '../services/productApi'
import { useProductMutations } from '../context/ProductContext'
import ProductImages from '../components/products/ProductImages'
import ProductReviews from '../components/products/ProductReviews'
import DeleteConfirmModal from '../components/products/DeleteConfirmModal'
import ErrorState from '../components/ui/ErrorState'
import Badge from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import {
  ChevronLeft,
  Star,
  Package,
  ShieldCheck,
  Truck,
  RotateCcw,
  Edit3,
  Trash2,
  AlertCircle,
  Home,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProductWithMutations, isProductDeleted, deleteProduct } = useProductMutations()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let isMounted = true

    // If marked as deleted, immediately show 404 Not Found
    if (isProductDeleted(id)) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const controller = new AbortController()

    const fetchDetail = async () => {
      setLoading(true)
      setNotFound(false)
      setError(null)

      try {
        // First check if product is in local additions
        const localCheck = getProductWithMutations({ id: Number(id) })
        if (localCheck && localCheck.title && localCheck.isLocal) {
          if (isMounted) {
            setProduct(localCheck)
            setLoading(false)
          }
          return
        }

        const data = await getProductById(id, { signal: controller.signal })
        if (isMounted) {
          // Overlay any local edits made to this product
          const mutated = getProductWithMutations(data)
          setProduct(mutated)
        }
      } catch (err) {
        if (!isMounted) return
        console.error('Failed to load product details', err)
        if (err.response?.status === 404 || !err.response) {
          setNotFound(true)
        } else {
          setError('Failed to load product details. Please try again.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchDetail()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [id])

  // 404 Not Found Page for Invalid Product ID
  if (notFound) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-14 text-center max-w-xl mx-auto shadow-xs my-8 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-widest font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/60">
          Error 404
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900 mt-4 mb-2">
          Product Not Found
        </h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
          The product with ID <span className="font-semibold text-slate-800">#{id}</span> could not be found or may have been removed.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-sm transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    )
  }

  // Generic Error State
  if (error) {
    return (
      <ErrorState
        title="Unable to load product details"
        message={error}
        onRetry={() => window.location.reload()}
      />
    )
  }

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="lg:col-span-5 space-y-4">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="flex gap-3">
              <Skeleton className="w-16 h-16 rounded-xl" />
              <Skeleton className="w-16 h-16 rounded-xl" />
              <Skeleton className="w-16 h-16 rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    )
  }

  const isLowStock = (product?.stock || 0) <= 10
  const isOutOfStock = product?.stock === 0

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link
            to="/products"
            className="hover:text-blue-600 transition-colors inline-flex items-center gap-1 font-medium"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Products</span>
          </Link>
          <span>/</span>
          <span className="capitalize">{product?.category}</span>
          <span>/</span>
          <span className="font-semibold text-slate-800 line-clamp-1 max-w-[200px] sm:max-w-xs">
            {product?.title}
          </span>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/80 transition-all shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Main Product Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-5">
            <ProductImages
              images={product?.images || []}
              thumbnail={product?.thumbnail || ''}
              title={product?.title || ''}
            />
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Rating Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" className="capitalize text-xs">
                  {product?.category}
                </Badge>
                {product?.brand && (
                  <Badge variant="default" className="text-xs">
                    Brand: {product.brand}
                  </Badge>
                )}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200/60">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{Number(product?.rating || 0).toFixed(2)} Rating</span>
                </div>
              </div>

              {/* Title & SKU */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {product?.title}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  SKU: {product?.sku || `PROD-${product?.id}`} &bull; Product ID: #{product?.id}
                </p>
              </div>

              {/* Price & Stock Display */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 block font-medium">Price</span>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-black text-slate-900">
                      ${Number(product?.price || 0).toFixed(2)}
                    </span>
                    {product?.discountPercentage > 0 && (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {product.discountPercentage}% OFF
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block font-medium">Inventory</span>
                  {isOutOfStock ? (
                    <Badge variant="danger" className="text-xs font-semibold mt-0.5">
                      Out of Stock (0)
                    </Badge>
                  ) : isLowStock ? (
                    <Badge variant="warning" className="text-xs font-semibold mt-0.5">
                      Low Stock ({product?.stock} remaining)
                    </Badge>
                  ) : (
                    <Badge variant="success" className="text-xs font-semibold mt-0.5">
                      In Stock ({product?.stock} available)
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1.5">
                  Description
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {product?.description}
                </p>
              </div>

              {/* Meta Perks / Info Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800">Warranty</p>
                    <p className="text-slate-500 text-[11px]">{product?.warrantyInformation || '1 Year Standard'}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800">Shipping</p>
                    <p className="text-slate-500 text-[11px]">{product?.shippingInformation || 'Free Delivery'}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-2.5">
                  <RotateCcw className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800">Return Policy</p>
                    <p className="text-slate-500 text-[11px]">{product?.returnPolicy || '30 Days Return'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => navigate(`/products/${product.id}/edit`)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 active:scale-[0.99] transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Product</span>
              </button>

              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 transition-all cursor-pointer active:scale-[0.99]"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <ProductReviews reviews={product?.reviews || []} />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        product={product}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async (productId) => {
          setIsDeleting(true)
          try {
            await deleteProduct(productId)
            toast.success(`Product "${product.title}" deleted successfully`)
            navigate('/products', { replace: true })
          } catch (err) {
            console.error('Failed to delete product', err)
            toast.error('Failed to delete product')
          } finally {
            setIsDeleting(false)
          }
        }}
        isDeleting={isDeleting}
      />
    </div>
  )
}
