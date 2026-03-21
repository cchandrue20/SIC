'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import ReviewList from '@/components/ReviewList';

export default function PublicStartupProfile() {
  const params = useParams();
  const { user } = useAuth();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const { data } = await api.get(`/startups/${params.id}`);
        setStartup(data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchStartup();
  }, [params.id]);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="card text-center p-12">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-semibold mb-2">Startup not found</h2>
          <Link href="/browse" className="btn-primary mt-4">Browse Startups</Link>
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
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
              {startup.companyName?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">{startup.companyName}</h1>
              {startup.location && (
                <p className="text-surface-400 flex items-center gap-1 text-sm">📍 {startup.location}</p>
              )}
              {startup.website && (
                <a href={startup.website} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 text-sm mt-1 inline-block">
                  🌐 {startup.website}
                </a>
              )}
              {startup.tags && startup.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {startup.tags.map(tag => (
                    <span key={tag} className="status-badge bg-primary-500/10 text-primary-400 border border-primary-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {startup.description && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-lg font-semibold mb-3">About</h2>
                <p className="text-surface-300 leading-relaxed whitespace-pre-wrap">{startup.description}</p>
              </div>
            )}
            {startup.pitch && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <h2 className="text-lg font-semibold mb-3">Pitch</h2>
                <p className="text-surface-300 leading-relaxed whitespace-pre-wrap">{startup.pitch}</p>
              </div>
            )}
            {startup.technicalHelp && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-lg font-semibold mb-3">Technical Help Needed</h2>
                <p className="text-surface-300 leading-relaxed whitespace-pre-wrap">{startup.technicalHelp}</p>
              </div>
            )}
            {startup.user && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.25s' }}>
                <h2 className="text-lg font-semibold mb-4">Reviews</h2>
                <ReviewList userId={startup.user._id} />
              </div>
            )}
          </div>

          <div className="space-y-6">
            {startup.fundingNeeded > 0 && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-sm font-semibold text-surface-300 mb-2">Funding Needed</h3>
                <p className="text-3xl font-bold gradient-text">${startup.fundingNeeded.toLocaleString()}</p>
              </div>
            )}
            {startup.user?.averageRating > 0 && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.12s' }}>
                <h3 className="text-sm font-semibold text-surface-300 mb-2">Rating</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-yellow-400">⭐ {startup.user.averageRating.toFixed(1)}</span>
                  <span className="text-sm text-surface-400">({startup.user.reviewCount} reviews)</span>
                </div>
              </div>
            )}
            {!user && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <p className="text-sm text-surface-400 mb-3">Log in to connect with this startup.</p>
                <Link href="/login" className="btn-primary w-full text-center">Log In to Connect</Link>
              </div>
            )}
            {user && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <Link href={`/browse/${params.id}`} className="btn-primary w-full text-center">
                  View Full Details
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
