import apiClient from '../lib/axios'

/**
 * Product API Services
 * Separated from UI components with signal support for AbortController
 * and delay parameter support for race condition testing.
 */

export const getProducts = async ({ limit = 10, skip = 0, delay, signal } = {}) => {
  const params = { limit, skip }
  if (delay) params.delay = delay

  const { data } = await apiClient.get('/products', {
    params,
    signal,
  })
  return data
}

export const searchProducts = async ({ q, limit = 10, skip = 0, delay, signal } = {}) => {
  const params = { q, limit, skip }
  if (delay) params.delay = delay

  const { data } = await apiClient.get('/products/search', {
    params,
    signal,
  })
  return data
}

export const getCategories = async ({ signal } = {}) => {
  const { data } = await apiClient.get('/products/categories', { signal })
  return data
}

export const getProductsByCategory = async ({ category, limit = 10, skip = 0, delay, signal } = {}) => {
  const params = { limit, skip }
  if (delay) params.delay = delay

  const { data } = await apiClient.get(`/products/category/${category}`, {
    params,
    signal,
  })
  return data
}

export const getProductById = async (id, { signal } = {}) => {
  const { data } = await apiClient.get(`/products/${id}`, { signal })
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
