'use client';

import { useState } from 'react';
import api from '@/lib/api';

interface ReviewFormProps {
  connectionId: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ connectionId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.post('/reviews', { connectionId, rating, comment });
      setSubmitted(true);
      onReviewSubmitted?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center animate-scale-in">
        ✅ Review submitted! Thank you for your feedback.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-scale-in">
          {error}
        </div>
      )}

      {/* Star Rating */}
      <div>
        <label className="label">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <svg
                className={`w-7 h-7 transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-surface-600 fill-surface-600'
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="label">Comment (optional)</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="input-field text-sm h-24 resize-none"
          placeholder="Share your experience..."
          id="review-comment"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full" id="review-submit">
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
