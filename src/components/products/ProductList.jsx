import ProductTable from './ProductTable'
import ProductCard from './ProductCard'
import EmptyState from '../ui/EmptyState'

export default function ProductList({
  products = [],
  onDelete,
  onClearFilters,
}) {
  if (!products.length) {
    return (
      <EmptyState
        title="No products found"
        description="We couldn't find any products matching your search or active filters. Try searching for something else or clear all filters."
        actionLabel={onClearFilters ? "Clear All Filters" : undefined}
        onAction={onClearFilters}
      />
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
