import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginForm from '../components/auth/LoginForm'
import { Package } from 'lucide-react'

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/products', { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between relative overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Background modern ambient blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/50 via-indigo-50/30 to-transparent pointer-events-none -z-10 blur-3xl" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar branding */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Package className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800 text-lg tracking-tight">
            InventoryPro
          </span>
        </div>
        <div className="text-xs font-medium text-slate-500 bg-white/70 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200">
          DummyJSON Admin API
        </div>
      </header>

      {/* Main Content Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <LoginForm />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200/50">
        Product Admin Dashboard &bull; Secured with Axios Interceptor Tokens
      </footer>
    </div>
  )
}
