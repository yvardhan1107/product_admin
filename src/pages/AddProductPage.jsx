import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useProductMutations } from '../context/ProductContext'
import ProductForm from '../components/products/ProductForm'
import { ChevronLeft, PlusCircle, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AddProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addProduct } = useProductMutations()
  const navigate = useNavigate()

  const handleCreateProduct = async (formData) => {
    setIsSubmitting(true)
    try {
      const created = await addProduct(formData)
      toast.success(`Product "${created.title}" added successfully!`)
      navigate('/products', { replace: true })
    } catch (err) {
      console.error('Failed to create product', err)
      toast.error('Failed to add product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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
          <span className="font-semibold text-slate-800">Add New Product</span>
        </div>

        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/80 transition-all shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Cancel & Back</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-xs">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Catalog Creation
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Create New Product
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Add a new item to the store catalog. Simulated mutations persist locally in your session.
            </p>
          </div>
        </div>
      </div>

      {/* Form Component */}
      <ProductForm
        onSubmit={handleCreateProduct}
        isSubmitting={isSubmitting}
        onCancel={() => navigate('/products')}
        submitLabel="Create Product"
      />
    </div>
  )
}
