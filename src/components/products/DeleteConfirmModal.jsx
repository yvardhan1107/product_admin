import Modal from '../ui/Modal'
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react'

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  product = null,
  isDeleting = false,
}) {
  if (!product) return null

  return (
    <Modal isOpen={isOpen} onClose={isDeleting ? () => {} : onClose}>
      <div className="space-y-5">
        {/* Warning Icon Banner */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              Delete Product
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm irreversible catalog deletion
            </p>
          </div>
        </div>

        {/* Product preview chip */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200 p-1 flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
              <Trash2 className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
              {product.title}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              ID: #{product.id} &bull; ${Number(product.price || 0).toFixed(2)} &bull;{' '}
              <span className="capitalize">{product.category}</span>
            </p>
          </div>
        </div>

        {/* Warning copy */}
        <p className="text-xs text-slate-600 leading-relaxed">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-slate-900">"{product.title}"</span>?{' '}
          This simulated deletion will remove the product from your dashboard catalog.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm(product.id)}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-semibold bg-rose-600 hover:bg-rose-700 shadow-sm shadow-rose-500/25 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Product</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
