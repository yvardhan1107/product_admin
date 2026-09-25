import { useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Package, LogOut, Layers, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Signed out successfully')
    navigate('/login', { replace: true })
  }

  return (
    <header className="bg-white/85 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-40 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo & Navigation */}
          <div className="flex items-center gap-6 sm:gap-8">
            <NavLink
              to="/products"
              className="flex items-center gap-2.5 group transition-transform active:scale-95"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all">
                <Package className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 text-base leading-tight tracking-tight">
                  Inventory<span className="text-blue-600">Pro</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Admin Panel
                </span>
              </div>
            </NavLink>

            <nav className="hidden sm:flex items-center gap-1.5">
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-2xs border border-blue-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Catalog</span>
              </NavLink>
            </nav>
          </div>

          {/* Right: Profile & Logout */}
          <div className="flex items-center gap-2.5 sm:gap-3">

            {/* User Profile Chip */}
            <div className="flex items-center gap-2 sm:gap-2.5 px-2.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/80">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.firstName || user.username}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {(user?.firstName?.[0] || user?.username?.[0] || 'A').toUpperCase()}
                </div>
              )}
              <div className="hidden sm:flex flex-col text-left pr-1">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.username || 'Admin'}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  @{user?.username || 'emilys'}
                </span>
              </div>
            </div>

            {/* Logout Action Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all active:scale-95 cursor-pointer"
              title="Sign out of your session"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
