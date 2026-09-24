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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group">
      {/* Product Image Section */}
      <div className="relative aspect-4/3 bg-slate-100 flex items-center justify-center p-4 overflow-hidden border-b border-slate-100">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-200"
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
          <Badge variant="primary" className="capitalize text-[11px] shadow-xs">
            {product.category}
          </Badge>
        </div>

        {/* Floating Rating Badge */}
        <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur text-amber-700 text-xs font-semibold shadow-xs border border-slate-200/60">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{Number(product.rating).toFixed(2)}</span>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <button
            onClick={() => navigate(`/products/${product.id}`)}
            className="text-left font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm cursor-pointer"
          >
            {product.title}
          </button>
          <p className="text-xs text-slate-400 mt-1">
            {product.brand ? `${product.brand} • ` : ''}ID: #{product.id}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">Price</span>
            <span className="text-lg font-bold text-slate-900">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <div>
            {isOutOfStock ? (
              <Badge variant="danger" className="text-[11px]">
                Out of stock
              </Badge>
            ) : isLowStock ? (
              <Badge variant="warning" className="text-[11px]">
                Low stock ({product.stock})
              </Badge>
            ) : (
              <Badge variant="success" className="text-[11px]">
                In stock ({product.stock})
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100">
          <button
            onClick={() => navigate(`/products/${product.id}`)}
            className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>
          <button
            onClick={() => navigate(`/products/${product.id}/edit`)}
            className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-medium text-slate-700 hover:text-amber-600 hover:bg-amber-50 border border-slate-200 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete?.(product)}
            className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-medium text-slate-700 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}
