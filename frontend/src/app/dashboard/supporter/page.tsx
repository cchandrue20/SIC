'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function SupporterDashboard() {
  const { user, profile } = useAuth();
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const { data } = await api.get('/connections');
        setConnections(data);
      } catch (err) {
        console.error('Failed to fetch connections');
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, []);

  const pending = connections.filter(c => c.status === 'pending');
  const accepted = connections.filter(c => c.status === 'accepted');

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Supporter <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-surface-400">Manage your profile and find startups</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Link href="/dashboard/supporter/wishlist" className="btn-secondary">💜 My Wishlist</Link>
            <Link href="/profile/supporter" className="btn-secondary">✏️ Edit Profile</Link>
            <Link href="/browse" className="btn-primary">🔍 Browse Startups</Link>
          </div>
        </div>

        {/* Profile Summary */}
        {profile ? (
          <div className="card mb-8 animate-slide-up">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-600 to-primary-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                {profile.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{profile.fullName}</h2>
                <p className="text-sm text-surface-400 capitalize">{profile.type?.replace('_', ' ')}</p>
                {profile.location && <p className="text-sm text-surface-400">📍 {profile.location}</p>}
              </div>
            </div>
          </div>
        ) : (
          <div className="card mb-8 text-center p-8 animate-slide-up">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="text-lg font-semibold mb-2">No profile yet</h3>
            <p className="text-surface-400 text-sm mb-4">Create your supporter profile to connect with startups.</p>
            <Link href="/profile/supporter" className="btn-primary">Create Profile</Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Pending', value: pending.length, color: 'text-yellow-400' },
            { label: 'Connected', value: accepted.length, color: 'text-emerald-400' },
            { label: 'Total', value: connections.length, color: 'text-primary-400' },
          ].map((stat, i) => (
            <div key={i} className="card text-center animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-surface-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Connections */}
        <div className="animate-slide-up">
          <h2 className="text-lg font-semibold mb-4">Your Connections</h2>
          {connections.length === 0 ? (
            <div className="card text-center p-8">
              <p className="text-surface-400">No connections yet. Browse startups and express interest!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {connections.map(conn => (
                <div key={conn._id} className={`glass-hover p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${conn.status === 'accepted' ? 'cursor-pointer' : ''}`}>
                  <div>
                    <p className="font-medium">{conn.startup?.companyName || 'Startup'}</p>
                    <p className="text-sm text-surface-400">{conn.startup?.location}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={
                      conn.status === 'pending' ? 'status-pending' :
                      conn.status === 'accepted' ? 'status-accepted' :
                      'status-rejected'
                    }>
                      {conn.status}
                    </span>
                    {conn.status === 'accepted' && (
                      <Link href={`/connections/${conn._id}`} className="btn-primary text-xs px-3 py-1.5">
                        💬 Chat
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
