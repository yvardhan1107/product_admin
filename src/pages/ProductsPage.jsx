import { useAuth } from '../context/AuthContext'
import { Package, ShieldCheck, KeyRound, Sparkles } from 'lucide-react'

export default function ProductsPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 sm:p-8 text-white shadow-lg shadow-blue-500/15">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold tracking-wide uppercase text-blue-100 mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              Protected Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Products Overview
            </h1>
            <p className="mt-1 text-sm text-blue-100 max-w-xl">
              Manage your catalog, inventory levels, pricing, and live customer reviews with DummyJSON API.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur px-4 py-3 rounded-xl border border-white/15">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="text-left text-xs">
              <p className="font-semibold text-white">Authenticated Session</p>
              <p className="text-blue-200">User: {user?.username || 'emilys'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info card previewing next step */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Route Protection Confirmed
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Unauthenticated visitors cannot access this page. Requests have the JWT access token attached through Axios interceptors.
        </p>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 overflow-x-auto text-left">
          <code>Authorization: Bearer {localStorage.getItem('accessToken')?.substring(0, 36)}...</code>
        </div>
      </div>
    </div>
  )
}
