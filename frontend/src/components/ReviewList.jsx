'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function ReviewList({ userId }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get(`/reviews/user/${userId}`);
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setReviewCount(data.reviewCount);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [userId]);

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-surface-600 fill-surface-600'
          }`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );

  if (loading) {
    return <div className="text-surface-400 text-sm animate-pulse">Loading reviews...</div>;
  }

  return (
    <div>
      {/* Average Rating */}
      {reviewCount > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            {renderStars(Math.round(averageRating))}
            <span className="text-lg font-bold text-white">{averageRating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-surface-400">({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
        </div>
      )}

      {/* Reviews */}
      {reviews.length === 0 ? (
        <p className="text-sm text-surface-400">No reviews yet.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <div key={review._id} className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                </div>
                <span className="text-[10px] text-surface-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-surface-300">{review.comment}</p>
              )}
              <p className="text-xs text-surface-500 mt-2">by {review.fromUser.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
