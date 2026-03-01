'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function ConnectionsPage() {
  const { user } = useAuth();
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

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">
            Your <span className="gradient-text">Connections</span>
          </h1>
          <p className="text-surface-400">All your connection requests and active chats</p>
        </div>

        {connections.length === 0 ? (
          <div className="card text-center p-12 animate-slide-up">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-lg font-semibold mb-2">No connections yet</h3>
            <p className="text-surface-400 text-sm mb-4">
              {user?.role === 'supporter'
                ? 'Browse startups and express interest to create connections.'
                : 'Wait for supporters to express interest in your startup.'}
            </p>
            {user?.role === 'supporter' && (
              <Link href="/browse" className="btn-primary">Browse Startups</Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {connections.map((conn, i) => {
              const otherParty = user?.role === 'startup'
                ? { name: conn.supporter?.fullName || 'Supporter', sub: conn.supporter?.type?.replace('_', ' ') }
                : { name: conn.startup?.companyName || 'Startup', sub: conn.startup?.location };

              return (
                <div key={conn._id} className="glass-hover p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {otherParty.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{otherParty.name}</p>
                      <p className="text-sm text-surface-400 capitalize">{otherParty.sub}</p>
                      {conn.initialMessage && (
                        <p className="text-xs text-surface-500 mt-1 truncate max-w-xs">&ldquo;{conn.initialMessage}&rdquo;</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={
                      conn.status === 'pending' ? 'status-pending' :
                      conn.status === 'accepted' ? 'status-accepted' :
                      conn.status === 'rejected' ? 'status-rejected' :
                      'status-badge bg-surface-500/10 text-surface-400 border border-surface-500/20'
                    }>
                      {conn.status}
                    </span>
                    {conn.status === 'accepted' && (
                      <Link href={`/connections/${conn._id}`} className="btn-primary text-xs px-4 py-2">
                        💬 Chat
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
