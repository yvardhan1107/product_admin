import { useState } from 'react'
import { Package } from 'lucide-react'

export default function ProductImages({ images = [], thumbnail = '', title = '' }) {
  // Use images array or fallback to thumbnail
  const allImages = images.length > 0 ? images : thumbnail ? [thumbnail] : []
  const [selectedImage, setSelectedImage] = useState(allImages[0] || thumbnail || '')

  if (!allImages.length) {
    return (
      <div className="aspect-square bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200">
        <Package className="w-16 h-16" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Large Display Image */}
      <div className="aspect-square bg-white rounded-2xl border border-slate-200/80 p-6 flex items-center justify-center overflow-hidden shadow-xs relative group">
        <img
          src={selectedImage}
          alt={title}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        <div
          style={{ display: 'none' }}
          className="w-full h-full items-center justify-center text-slate-400"
        >
          <Package className="w-16 h-16" />
        </div>
      </div>

      {/* Thumbnail Strip (if multiple images exist) */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {allImages.map((img, idx) => {
            const isSelected = selectedImage === img
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 rounded-xl bg-white border p-1 flex-shrink-0 flex items-center justify-center overflow-hidden transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
