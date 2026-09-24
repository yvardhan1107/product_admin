import ProductTable from './ProductTable'
import ProductCard from './ProductCard'
import { PackageOpen } from 'lucide-react'

export default function ProductList({
  products = [],
  onDelete,
}) {
  if (!products.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
        <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <PackageOpen className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No products found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          There are currently no products matching your criteria.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Desktop View: Full-featured Data Table */}
      <div className="hidden md:block">
        <ProductTable
          products={products}
          onDelete={onDelete}
        />
      </div>

      {/* Mobile & Small Tablet View: Responsive Cards Grid */}
      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}
