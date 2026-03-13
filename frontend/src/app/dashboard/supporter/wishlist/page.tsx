'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import ProfileCard from '@/components/ProfileCard';

export default function WishlistPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const { data } = await api.get('/saved');
        setSaved(data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  const handleRemove = async (startupId: string) => {
    try {
      await api.delete(`/saved/${startupId}`);
      setSaved(prev => prev.filter(s => s.startup?._id !== startupId));
    } catch {
      // silent
    }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              My <span className="gradient-text">Wishlist</span>
            </h1>
            <p className="text-surface-400">Startups you&apos;ve saved for later</p>
          </div>
          <Link href="/browse" className="btn-primary">🔍 Browse More</Link>
        </div>

        {saved.length === 0 ? (
          <div className="card text-center p-12 animate-slide-up">
            <div className="text-4xl mb-4">💜</div>
            <h3 className="text-lg font-semibold mb-2">No saved startups</h3>
            <p className="text-surface-400 text-sm mb-4">
              Browse startups and click the heart icon to save them here.
            </p>
            <Link href="/browse" className="btn-primary">Browse Startups</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {saved.map((item, i) => (
              <div key={item._id} className="relative animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                {item.startup && <ProfileCard profile={item.startup} type="startup" />}
                <button
                  onClick={() => handleRemove(item.startup?._id)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors z-10"
                  title="Remove from wishlist"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
