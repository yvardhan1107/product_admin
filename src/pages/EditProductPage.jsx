import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProductById } from '../services/productApi'
import { useProductMutations } from '../context/ProductContext'
import ProductForm from '../components/products/ProductForm'
import { Skeleton } from '../components/ui/Skeleton'
import { ChevronLeft, Edit3, Sparkles, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EditProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateProduct, getProductWithMutations, isProductDeleted } = useProductMutations()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isMounted = true

    // If marked as deleted locally, it doesn't exist
    if (isProductDeleted(id)) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const fetchProductToEdit = async () => {
      setLoading(true)
      try {
        // First check if it's already in local mutation state
        const localCheck = getProductWithMutations({ id: Number(id) })
        if (localCheck && localCheck.title) {
          if (isMounted) {
            setProduct(localCheck)
            setLoading(false)
          }
          return
        }

        // Otherwise fetch from DummyJSON API
        const data = await getProductById(id)
        if (isMounted) {
          // Overlay any partial local updates
          const fullProduct = getProductWithMutations(data)
          setProduct(fullProduct)
        }
      } catch (err) {
        if (!isMounted) return
        console.error('Failed to load product for editing', err)
        if (err.response?.status === 404 || !err.response) {
          setNotFound(true)
        } else {
          toast.error('Could not load product details')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchProductToEdit()

    return () => {
      isMounted = false
    }
  }, [id, getProductWithMutations, isProductDeleted])

  const handleUpdateProduct = async (formData) => {
    setIsSubmitting(true)
    try {
      await updateProduct(id, formData)
      toast.success(`Product "${formData.title}" updated successfully!`)
      // Redirect back to product details to see changes
      navigate(`/products/${id}`, { replace: true })
    } catch (err) {
      console.error('Failed to update product', err)
      toast.error('Failed to save changes. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 404 Not Found if product ID doesn't exist
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
          Cannot edit product with ID <span className="font-semibold text-slate-800">#{id}</span> because it does not exist or has been deleted.
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

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-28 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/products" className="hover:text-blue-600 transition-colors font-medium">
            Products
          </Link>
          <span>/</span>
          <Link to={`/products/${id}`} className="hover:text-blue-600 transition-colors font-medium">
            #{id}
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">Edit</span>
        </div>

        <button
          onClick={() => navigate(`/products/${id}`)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/80 transition-all shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Cancel & Back</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 shadow-xs">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Editing Item #{id}
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Edit Product Details
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Modify the product specifications. Updates are merged into your local state overlay.
            </p>
          </div>
        </div>
      </div>

      {/* Reusable Product Form Pre-Filled with Existing Data */}
      <ProductForm
        initialData={product}
        onSubmit={handleUpdateProduct}
        isSubmitting={isSubmitting}
        onCancel={() => navigate(`/products/${id}`)}
        submitLabel="Save Changes"
      />
    </div>
  )
}
