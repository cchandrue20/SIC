'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api, { getExpensePlan, getFundingProgress } from '@/lib/api';
import Link from 'next/link';
import ReviewList from '@/components/ReviewList';
import InvestmentOverview from '@/components/InvestmentOverview';
import ExpensePlanTable from '@/components/ExpensePlanTable';
import FundingProgress from '@/components/FundingProgress';

export default function StartupDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expensePlan, setExpensePlan] = useState([]);
  const [fundingStats, setFundingStats] = useState(null);
  const [connectMsg, setConnectMsg] = useState('');
  const [interestAmount, setInterestAmount] = useState('');
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingWishlist, setSavingWishlist] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [startupRes, planRes, statsRes] = await Promise.all([
          api.get(`/startups/${params.id}`),
          getExpensePlan(params.id),
          getFundingProgress(params.id)
        ]);
        setStartup(startupRes.data);
        setExpensePlan(planRes.data);
        setFundingStats(statsRes.data);
      } catch (err) {
        console.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  // Check if already saved (wishlist)
  useEffect(() => {
    if (user?.role === 'supporter') {
      api.get('/saved').then(({ data }) => {
        const found = data.some(s => s.startup?._id === params.id);
        setIsSaved(found);
      }).catch(() => {});
    }
  }, [user, params.id]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await api.post('/connections', { 
        startupId: params.id, 
        initialMessage: connectMsg,
        interestedAmount: Number(interestAmount) || 0
      });
      setConnected(true);
      setShowInterestModal(false);
      // Refresh stats
      const { data } = await getFundingProgress(params.id);
      setFundingStats(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to connect');
    } finally {
      setConnecting(false);
    }
  };

  const toggleWishlist = async () => {
    setSavingWishlist(true);
    try {
      if (isSaved) {
        await api.delete(`/saved/${params.id}`);
        setIsSaved(false);
      } else {
        await api.post('/saved', { startupId: params.id });
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err.response?.data?.message || 'Wishlist error');
    } finally {
      setSavingWishlist(false);
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="card mb-6 animate-slide-up">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
              {startup.companyName?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">{startup.companyName}</h1>
                {user?.role === 'supporter' && (
                  <button
                    onClick={toggleWishlist}
                    disabled={savingWishlist}
                    className={`p-2 rounded-lg transition-all ${
                      isSaved
                        ? 'bg-pink-500/20 text-pink-400'
                        : 'bg-white/5 text-surface-400 hover:text-pink-400 hover:bg-pink-500/10'
                    }`}
                    title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                    id="wishlist-toggle"
                  >
                    <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                )}
              </div>
              {startup.location && (
                <p className="text-surface-400 flex items-center gap-1 text-sm">📍 {startup.location}</p>
              )}
              {startup.website && (
                <a href={startup.website} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 text-sm mt-1 inline-block">
                  🌐 {startup.website}
                </a>
              )}
              {/* Tags */}
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Investment Overview (Section A) */}
            <h2 className="text-xl font-bold text-surface-100 flex items-center gap-2">
              📊 Investment Overview
            </h2>
            <InvestmentOverview 
              stage={startup.stage}
              equity={startup.equity}
              traction={startup.traction}
              investmentNeeded={startup.investmentNeeded || startup.fundingNeeded}
            />

            {/* Planned Expenditure (Section B) */}
            <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-lg font-semibold mb-4">Planned Expenditure</h2>
              <ExpensePlanTable plan={expensePlan} />
            </div>

            {startup.description && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <h2 className="text-lg font-semibold mb-3">About</h2>
                <p className="text-surface-300 leading-relaxed whitespace-pre-wrap">{startup.description}</p>
              </div>
            )}

            {startup.pitch && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-lg font-semibold mb-3">Pitch</h2>
                <p className="text-surface-300 leading-relaxed whitespace-pre-wrap">{startup.pitch}</p>
              </div>
            )}

            {/* Reviews Section */}
            {startup.user && (
              <div className="card animate-slide-up" style={{ animationDelay: '0.25s' }}>
                <h2 className="text-lg font-semibold mb-4">Reviews</h2>
                <ReviewList userId={startup.user._id} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Progress (Section C) */}
            {fundingStats && (
              <FundingProgress 
                investmentNeeded={fundingStats.investmentNeeded}
                totalInterested={fundingStats.totalInterested}
                investors={fundingStats.investors}
              />
            )}

            {/* Rating */}
            {startup.user?.averageRating > 0 && (
              <div className="card animate-slide-up">
                <h3 className="text-sm font-semibold text-surface-300 mb-2">Rating</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-yellow-400">⭐ {startup.user.averageRating.toFixed(1)}</span>
                  <span className="text-sm text-surface-400">({startup.user.reviewCount} reviews)</span>
                </div>
              </div>
            )}

            {/* Connect button for supporters */}
            {user?.role === 'supporter' && (
              <div className="card animate-slide-up border-primary-500/30">
                <h3 className="text-sm font-semibold text-surface-300 mb-3">Interested in Investing?</h3>
                {connected ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
                    ✅ Connection request sent!
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-surface-400 mb-4">Connect with the founders to discuss investment opportunities and see detailed spend updates.</p>
                    <button
                      onClick={() => setShowInterestModal(true)}
                      className="btn-primary w-full"
                      id="express-interest-btn"
                    >
                      Express Interest
                    </button>
                  </>
                )}
              </div>
            )}

            {!user && (
              <div className="card animate-slide-up">
                <p className="text-sm text-surface-400 mb-3">Sign in as a supporter to connect with this startup.</p>
                <Link href="/register?role=supporter" className="btn-primary w-full text-center">
                  Join as Supporter
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interest Modal */}
      {showInterestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="card max-w-md w-full animate-zoom-in">
            <h2 className="text-xl font-bold mb-4">Express Interest</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Investment Amount (₹)</label>
                <input 
                  type="number" 
                  value={interestAmount}
                  onChange={(e) => setInterestAmount(e.target.value)}
                  className="input-field"
                  placeholder="e.g. 5,00,000"
                  autoFocus
                />
                <p className="text-[10px] text-surface-500 mt-1">This amount is non-binding and helps founders gauge interest.</p>
              </div>
              <div>
                <label className="label">Message to Founders</label>
                <textarea
                  value={connectMsg}
                  onChange={e => setConnectMsg(e.target.value)}
                  placeholder="Briefly introduce yourself and your expertise..."
                  className="input-field text-sm h-32 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowInterestModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConnect}
                  disabled={connecting}
                  className="btn-primary flex-1"
                >
                  {connecting ? 'Sending...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

