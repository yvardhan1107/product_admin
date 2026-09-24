import apiClient from '../lib/axios'

export const getProducts = async ({ limit = 10, skip = 0, signal } = {}) => {
  const { data } = await apiClient.get('/products', {
    params: { limit, skip },
    signal,
  })
  return data
}

export const searchProducts = async ({ q, limit = 10, skip = 0, signal }) => {
  const { data } = await apiClient.get('/products/search', {
    params: { q, limit, skip },
    signal,
  })
  return data
}

export const getCategories = async () => {
  const { data } = await apiClient.get('/products/categories')
  return data
}

export const getProductsByCategory = async ({ category, limit = 10, skip = 0, signal }) => {
  const { data } = await apiClient.get(`/products/category/${category}`, {
    params: { limit, skip },
    signal,
  })
  return data
}

export const getProductById = async (id) => {
  const { data } = await apiClient.get(`/products/${id}`)
  return data
}

export const addProduct = async (product) => {
  const { data } = await apiClient.post('/products/add', product)
  return data
}

export const updateProduct = async (id, product) => {
  const { data } = await apiClient.put(`/products/${id}`, product)
  return data
}

export const deleteProduct = async (id) => {
  const { data } = await apiClient.delete(`/products/${id}`)
  return data
}
