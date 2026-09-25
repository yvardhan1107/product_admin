import { Star, Eye, Edit3, Trash2, Package } from 'lucide-react'
import Badge from '../ui/Badge'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({
  product,
  onDelete,
}) {
  const navigate = useNavigate()
  const isLowStock = product.stock <= 10
  const isOutOfStock = product.stock === 0

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Product Image Section */}
      <div className="relative aspect-4/3 bg-slate-50 flex items-center justify-center p-4 overflow-hidden border-b border-slate-100">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          style={{ display: product.thumbnail ? 'none' : 'flex' }}
          className="w-full h-full items-center justify-center text-slate-400"
        >
          <Package className="w-10 h-10" />
        </div>

        {/* Floating Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="primary" className="capitalize text-[11px] font-semibold shadow-xs">
            {product.category}
          </Badge>
        </div>

        {/* Floating Rating Badge */}
        <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur text-amber-700 text-xs font-bold shadow-xs border border-slate-200/60">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{Number(product.rating).toFixed(2)}</span>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <button
            onClick={() => navigate(`/products/${product.id}`)}
            className="text-left font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm cursor-pointer"
          >
            {product.title}
          </button>
          <p className="text-xs text-slate-400 mt-1">
            {product.brand ? `${product.brand} • ` : ''}ID: #{product.id}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-black text-slate-900">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <div>
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                Out of stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Low stock ({product.stock})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                In stock ({product.stock})
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100">
          <button
            onClick={() => navigate(`/products/${product.id}`)}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>
          <button
            onClick={() => navigate(`/products/${product.id}/edit`)}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-amber-600 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete?.(product)}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}
