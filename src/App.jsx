import { useEffect, useState } from 'react'
import { getProducts } from './services/productApi'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts({ limit: 5 })
      .then((data) => {
        setProducts(data.products)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        Product Admin Dashboard
      </h1>
      {loading ? (
        <p className="text-slate-500">Loading products...</p>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <span className="font-medium text-slate-800">{p.title}</span>
              <span className="text-slate-500 ml-2">— ${p.price}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
