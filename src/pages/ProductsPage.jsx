import { useAuth } from '../context/AuthContext'
import { LogOut, Package, CheckCircle2 } from 'lucide-react'

export default function ProductsPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Product Dashboard
              </h1>
              <p className="text-xs text-slate-500">Welcome, {user?.firstName || user?.username || 'Admin'}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200 hover:border-rose-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center max-w-xl mx-auto">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Authentication Succeeded!
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Signed in as <span className="font-semibold text-slate-900">{user?.username}</span> ({user?.email}).
            Token is stored and ready for authenticated requests.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 overflow-x-auto text-left">
            <code>localStorage.accessToken = {localStorage.getItem('accessToken')?.substring(0, 32)}...</code>
          </div>
        </div>
      </main>
    </div>
  )
}
