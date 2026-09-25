import { Star, Eye, Edit3, Trash2, Package } from 'lucide-react'
import Badge from '../ui/Badge'
import { useNavigate } from 'react-router-dom'

export default function ProductTable({
  products,
  onDelete,
}) {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-4 px-4 sm:px-6">Product Item</th>
              <th className="py-4 px-4">Category</th>
              <th className="py-4 px-4">Price</th>
              <th className="py-4 px-4">Rating</th>
              <th className="py-4 px-4">Inventory</th>
              <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {products.map((product) => {
              const isLowStock = product.stock <= 10
              const isOutOfStock = product.stock === 0

              return (
                <tr
                  key={product.id}
                  className="group hover:bg-slate-50/80 transition-colors"
                >
                  {/* Image & Title */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden group-hover:border-slate-300 group-hover:shadow-xs transition-all">
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
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
                          <Package className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="min-w-0 max-w-xs sm:max-w-sm">
                        <button
                          onClick={() => navigate(`/products/${product.id}`)}
                          className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-left line-clamp-1 cursor-pointer block"
                          title={product.title}
                        >
                          {product.title}
                        </button>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {product.brand ? `${product.brand} • ` : ''}ID: #{product.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <Badge variant="primary" className="capitalize text-[11px] font-semibold">
                      {product.category}
                    </Badge>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-900 text-sm">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-700 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{Number(product.rating).toFixed(2)}</span>
                    </div>
                  </td>

                  {/* Stock Status with Visual Pulse Dots */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Out of stock
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Low stock ({product.stock})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        In stock ({product.stock})
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/products/${product.id}/edit`)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete?.(product)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
