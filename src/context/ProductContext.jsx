import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  addProduct as apiAddProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
} from '../services/productApi'

const ProductContext = createContext(null)

const STORAGE_KEYS = {
  ADDED: 'local_added_products',
  UPDATED: 'local_updated_products',
  DELETED: 'local_deleted_ids',
}

export function ProductProvider({ children }) {
  // 1. Initialize local mutation layers from localStorage
  const [localAdded, setLocalAdded] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADDED)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [localUpdated, setLocalUpdated] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UPDATED)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  const [localDeleted, setLocalDeleted] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DELETED)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Sync to localStorage whenever mutation state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADDED, JSON.stringify(localAdded))
  }, [localAdded])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.UPDATED, JSON.stringify(localUpdated))
  }, [localUpdated])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DELETED, JSON.stringify(localDeleted))
  }, [localDeleted])

  /**
   * Applies local mutations (additions, modifications, deletions) onto raw API products.
   */
  const applyLocalMutations = useCallback(
    (apiProducts = [], categoryFilter = '', searchQuery = '') => {
      // 1. Filter out deleted products
      let combined = apiProducts.filter((p) => !localDeleted.includes(Number(p.id)))

      // 2. Overlay updated fields onto existing products
      combined = combined.map((p) => {
        const update = localUpdated[p.id]
        return update ? { ...p, ...update } : p
      })

      // 3. Prepend newly added products that match current filters
      const matchingAdded = localAdded.filter((p) => {
        // Skip if deleted
        if (localDeleted.includes(Number(p.id))) return false

        // Check category match if category filter active
        if (categoryFilter && p.category?.toLowerCase() !== categoryFilter.toLowerCase()) {
          return false
        }

        // Check search match if search active
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchTitle = p.title?.toLowerCase().includes(q)
          const matchCategory = p.category?.toLowerCase().includes(q)
          const matchBrand = p.brand?.toLowerCase().includes(q)
          if (!matchTitle && !matchCategory && !matchBrand) return false
        }

        return true
      })

      return [...matchingAdded, ...combined]
    },
    [localAdded, localUpdated, localDeleted]
  )

  /**
   * ADD Product:
   * Calls DummyJSON POST /products/add, then saves into localAdded overlay.
   */
  const addProduct = async (productData) => {
    const apiResult = await apiAddProduct(productData)

    // Assign a unique client ID if needed, ensuring no conflict
    const newProduct = {
      ...productData,
      id: apiResult.id || Date.now(),
      rating: 5.0,
      reviews: [],
      images: productData.thumbnail ? [productData.thumbnail] : [],
      isLocal: true,
      createdAt: new Date().toISOString(),
    }

    setLocalAdded((prev) => [newProduct, ...prev])
    return newProduct
  }

  /**
   * UPDATE Product:
   * Calls DummyJSON PUT /products/:id, then updates local overlay.
   */
  const updateProduct = async (id, updatedFields) => {
    const numericId = Number(id)

    // Call API (will succeed on DummyJSON for existing IDs)
    try {
      await apiUpdateProduct(numericId, updatedFields)
    } catch (err) {
      console.warn('API update failed or simulated ID, applying local state update', err)
    }

    // Check if this was a locally created product
    setLocalAdded((prev) =>
      prev.map((p) => (Number(p.id) === numericId ? { ...p, ...updatedFields } : p))
    )

    // Store in update map for API-originating products
    setLocalUpdated((prev) => ({
      ...prev,
      [numericId]: {
        ...(prev[numericId] || {}),
        ...updatedFields,
      },
    }))

    return { id: numericId, ...updatedFields }
  }

  /**
   * DELETE Product:
   * Calls DummyJSON DELETE /products/:id, then marks as deleted in local overlay.
   */
  const deleteProduct = async (id) => {
    const numericId = Number(id)

    try {
      await apiDeleteProduct(numericId)
    } catch (err) {
      console.warn('API delete call failed or simulated ID, applying local state removal', err)
    }

    // Mark as deleted
    setLocalDeleted((prev) => [...new Set([...prev, numericId])])
    // Also remove from added list if it was a local addition
    setLocalAdded((prev) => prev.filter((p) => Number(p.id) !== numericId))

    return true
  }

  /**
   * Get single product with local mutations applied
   */
  const getProductWithMutations = useCallback(
    (product) => {
      if (!product) return null
      const numericId = Number(product.id)

      if (localDeleted.includes(numericId)) return null

      // Check if this product was locally added
      const localItem = localAdded.find((p) => Number(p.id) === numericId)
      if (localItem) return localItem

      // Apply updates if any
      const updates = localUpdated[numericId]
      return updates ? { ...product, ...updates } : product
    },
    [localAdded, localUpdated, localDeleted]
  )

  const isProductDeleted = useCallback(
    (id) => localDeleted.includes(Number(id)),
    [localDeleted]
  )

  return (
    <ProductContext.Provider
      value={{
        applyLocalMutations,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductWithMutations,
        isProductDeleted,
        localAdded,
        localUpdated,
        localDeleted,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProductMutations() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProductMutations must be used within a ProductProvider')
  }
  return context
}
