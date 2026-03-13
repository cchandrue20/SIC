'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import ReviewList from '@/components/ReviewList';

export default function PublicSupporterProfile() {
  const params = useParams();
  const { user } = useAuth();
  const [supporter, setSupporter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupporter = async () => {
      try {
        const { data } = await api.get(`/supporters/${params.id}`);
        setSupporter(data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchSupporter();
  }, [params.id]);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!supporter) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="card text-center p-12">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-semibold mb-2">Supporter not found</h2>
          <Link href="/" className="btn-primary mt-4">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="card mb-6 animate-slide-up">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-600 to-primary-600 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
              {supporter.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">{supporter.fullName}</h1>
              <p className="text-surface-400 capitalize text-sm">{supporter.type?.replace('_', ' ')}</p>
              {supporter.location && (
                <p className="text-surface-400 flex items-center gap-1 text-sm mt-1">📍 {supporter.location}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {supporter.bio && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-lg font-semibold mb-3">About</h2>
                <p className="text-surface-300 leading-relaxed whitespace-pre-wrap">{supporter.bio}</p>
              </div>
            )}

            {supporter.expertiseAreas && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <h2 className="text-lg font-semibold mb-3">Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {supporter.expertiseAreas.split(',').map((area: string) => (
                    <span key={area.trim()} className="status-badge bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {area.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {supporter.user && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-lg font-semibold mb-4">Reviews</h2>
                <ReviewList userId={supporter.user._id} />
              </div>
            )}
          </div>

          <div className="space-y-6">
            {(supporter.investmentMin > 0 || supporter.investmentMax > 0) && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-sm font-semibold text-surface-300 mb-2">Investment Range</h3>
                <p className="text-xl font-bold gradient-text">
                  ${supporter.investmentMin?.toLocaleString() || '0'} – ${supporter.investmentMax?.toLocaleString() || '0'}
                </p>
              </div>
            )}

            {!user && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <p className="text-sm text-surface-400 mb-3">Log in to view more details.</p>
                <Link href="/login" className="btn-primary w-full text-center">Log In</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
