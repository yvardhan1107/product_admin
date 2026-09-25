import { useState, useEffect } from 'react'
import { getCategories } from '../../services/productApi'
import {
  Package,
  DollarSign,
  Layers,
  Archive,
  FileText,
  Tag,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
} from 'lucide-react'

export default function ProductForm({
  initialData = null,
  onSubmit,
  isSubmitting = false,
  onCancel,
  submitLabel = 'Save Product',
}) {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    price: initialData?.price !== undefined ? String(initialData.price) : '',
    category: initialData?.category || '',
    stock: initialData?.stock !== undefined ? String(initialData.stock) : '10',
    description: initialData?.description || '',
    brand: initialData?.brand || '',
    thumbnail: initialData?.thumbnail || '',
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Fetch category list for the dropdown
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data || []))
      .catch((err) => console.error('Failed to load categories for form', err))
  }, [])

  // Sync if initialData arrives after mount (e.g. edit page loading)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        price: initialData.price !== undefined ? String(initialData.price) : '',
        category: initialData.category || '',
        stock: initialData.stock !== undefined ? String(initialData.stock) : '10',
        description: initialData.description || '',
        brand: initialData.brand || '',
        thumbnail: initialData.thumbnail || '',
      })
    }
  }, [initialData])

  // Field validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Product title is required'
        if (value.trim().length < 3) return 'Title must be at least 3 characters'
        return ''

      case 'price':
        if (!value || String(value).trim() === '') return 'Price is required'
        const numPrice = Number(value)
        if (isNaN(numPrice) || numPrice <= 0) return 'Price must be a positive number'
        return ''

      case 'category':
        if (!value || !value.trim()) return 'Please select a product category'
        return ''

      case 'stock':
        if (value === '' || value === undefined || value === null) return 'Stock count is required'
        const numStock = Number(value)
        if (isNaN(numStock) || numStock < 0 || !Number.isInteger(numStock)) {
          return 'Stock must be a non-negative whole number (0, 1, 2...)'
        }
        return ''

      case 'description':
        if (!value.trim()) return 'Product description is required'
        if (value.trim().length < 10) return 'Description must be at least 10 characters'
        return ''

      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const errorMsg = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: errorMsg }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const errorMsg = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: errorMsg }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Prevent duplicate submission if already processing
    if (isSubmitting) return

    // Run full validation across all fields
    const newErrors = {
      title: validateField('title', formData.title),
      price: validateField('price', formData.price),
      category: validateField('category', formData.category),
      stock: validateField('stock', formData.stock),
      description: validateField('description', formData.description),
    }

    setErrors(newErrors)
    setTouched({
      title: true,
      price: true,
      category: true,
      stock: true,
      description: true,
    })

    const hasErrors = Object.values(newErrors).some((err) => Boolean(err))
    if (hasErrors) return

    // Prepare payload
    const submissionPayload = {
      title: formData.title.trim(),
      price: parseFloat(formData.price),
      category: formData.category.trim(),
      stock: parseInt(formData.stock, 10),
      description: formData.description.trim(),
      brand: formData.brand.trim() || undefined,
      thumbnail: formData.thumbnail.trim() || 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
    }

    onSubmit(submissionPayload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Form Title & Context */}
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900">General Information</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill in the essential product specs, pricing, and category
          </p>
        </div>

        {/* Title Field */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Product Title <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Package className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              placeholder="e.g. Wireless Noise Canceling Headphones"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 transition-all ${
                errors.title && touched.title
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20'
                  : 'border-slate-200/90 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white'
              }`}
            />
          </div>
          {errors.title && touched.title && (
            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        {/* Brand & Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Layers className="w-4 h-4" />
              </div>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={`w-full pl-10 pr-8 py-2.5 rounded-xl border text-sm text-slate-900 transition-all capitalize cursor-pointer ${
                  errors.category && touched.category
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20'
                    : 'border-slate-200/90 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white'
                }`}
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => {
                  const slug = typeof cat === 'string' ? cat : cat.slug
                  const name = typeof cat === 'string' ? cat.replace('-', ' ') : cat.name
                  return (
                    <option key={slug} value={slug} className="capitalize">
                      {name}
                    </option>
                  )
                })}
              </select>
            </div>
            {errors.category && touched.category && (
              <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.category}</span>
              </p>
            )}
          </div>

          {/* Brand (Optional) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Brand <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="e.g. Sony, Apple, Nike"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/90 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Price & Stock Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Price (USD) <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="0.01"
                min="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                placeholder="29.99"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 transition-all ${
                  errors.price && touched.price
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20'
                    : 'border-slate-200/90 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white'
                }`}
              />
            </div>
            {errors.price && touched.price && (
              <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.price}</span>
              </p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Stock Quantity <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Archive className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="1"
                min="0"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                placeholder="10"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 transition-all ${
                  errors.stock && touched.stock
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20'
                    : 'border-slate-200/90 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white'
                }`}
              />
            </div>
            {errors.stock && touched.stock && (
              <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.stock}</span>
              </p>
            )}
          </div>
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Description <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-xl shadow-xs">
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              placeholder="Describe the product features, quality, specifications..."
              className={`w-full p-3.5 rounded-xl border text-sm text-slate-900 transition-all ${
                errors.description && touched.description
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20'
                  : 'border-slate-200/90 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white'
              }`}
            />
          </div>
          {errors.description && touched.description && (
            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.description}</span>
            </p>
          )}
        </div>

        {/* Image Thumbnail URL & Preview */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Image URL <span className="text-slate-400 font-normal lowercase">(optional thumbnail)</span>
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 w-full rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <ImageIcon className="w-4 h-4" />
              </div>
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="https://example.com/product.jpg"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/90 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {formData.thumbnail && (
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={formData.thumbnail}
                  alt="Thumbnail preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{submitLabel}</span>
          )}
        </button>
      </div>
    </form>
  )
}
