'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function StartupDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectMsg, setConnectMsg] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const { data } = await api.get(`/startups/${params.id}`);
        setStartup(data);
      } catch (err) {
        console.error('Failed to fetch startup');
      } finally {
        setLoading(false);
      }
    };
    fetchStartup();
  }, [params.id]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await api.post('/connections', { startupId: params.id, initialMessage: connectMsg });
      setConnected(true);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to connect');
    } finally {
      setConnecting(false);
    }
  };

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
                <p className="text-surface-400 flex items-center gap-1 text-sm">
                  📍 {startup.location}
                </p>
              )}
              {startup.website && (
                <a href={startup.website} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 text-sm mt-1 inline-block">
                  🌐 {startup.website}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {startup.fundingNeeded > 0 && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-sm font-semibold text-surface-300 mb-2">Funding Needed</h3>
                <p className="text-3xl font-bold gradient-text">
                  ${startup.fundingNeeded.toLocaleString()}
                </p>
              </div>
            )}

            {/* Connect button for supporters */}
            {user?.role === 'supporter' && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <h3 className="text-sm font-semibold text-surface-300 mb-3">Interested?</h3>
                {connected ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
                    ✅ Connection request sent!
                  </div>
                ) : (
                  <>
                    <textarea
                      value={connectMsg}
                      onChange={e => setConnectMsg(e.target.value)}
                      placeholder="Introduce yourself..."
                      className="input-field text-sm mb-3 h-24 resize-none"
                      id="connect-message"
                    />
                    <button
                      onClick={handleConnect}
                      disabled={connecting}
                      className="btn-primary w-full"
                      id="connect-button"
                    >
                      {connecting ? 'Sending...' : 'Express Interest'}
                    </button>
                  </>
                )}
              </div>
            )}

            {!user && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <p className="text-sm text-surface-400 mb-3">Sign in as a supporter to connect with this startup.</p>
                <Link href="/register?role=supporter" className="btn-primary w-full text-center">
                  Join as Supporter
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
