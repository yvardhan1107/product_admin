import { Star, MessageSquare, CheckCircle, User } from 'lucide-react'

export default function ProductReviews({ reviews = [] }) {
  if (!reviews.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center">
        <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-slate-700">No reviews yet</h4>
        <p className="text-xs text-slate-400 mt-0.5">
          This product hasn't received any customer reviews yet.
        </p>
      </div>
    )
  }

  // Calculate average rating
  const avgRating = (
    reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
  ).toFixed(1)

  return (
    <div className="space-y-4">
      {/* Reviews Summary Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-bold text-slate-900">Customer Reviews</h3>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
            {reviews.length}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{avgRating} out of 5 stars</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.map((rev, index) => {
          const formattedDate = rev.date
            ? new Date(rev.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : 'Recent review'

          return (
            <div
              key={index}
              className="p-4 bg-slate-50/70 border border-slate-200/70 rounded-xl space-y-2 hover:bg-slate-50 transition-colors"
            >
              {/* Reviewer Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    {rev.reviewerName ? rev.reviewerName[0].toUpperCase() : <User className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 leading-tight">
                      {rev.reviewerName || 'Anonymous Customer'}
                    </p>
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 font-medium">
                      <CheckCircle className="w-2.5 h-2.5" />
                      Verified Purchase
                    </span>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400">{formattedDate}</span>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rev.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>

              {/* Review Comment */}
              <p className="text-xs text-slate-600 leading-relaxed">
                "{rev.comment}"
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
