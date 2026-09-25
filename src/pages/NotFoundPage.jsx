import { Link } from 'react-router-dom'
import { PackageX, Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
        <PackageX className="w-10 h-10" />
      </div>

      <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
        404 Page Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-4 mb-2">
        Looking for something?
      </h1>

      <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
        We couldn't find the page you were looking for. It might have been moved, deleted, or never existed.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all cursor-pointer shadow-sm shadow-blue-500/20"
        >
          <Home className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    </div>
  )
}
