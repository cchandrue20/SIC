'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api, { getExpensePlan, getFundingProgress, updateActualExpense } from '@/lib/api';
import Link from 'next/link';
import ReviewList from '@/components/ReviewList';
import FundingProgress from '@/components/FundingProgress';
import ExpensePlanTable from '@/components/ExpensePlanTable';

export default function StartupDashboard() {
  const { user, profile } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('connections');
  const [expensePlan, setExpensePlan] = useState([]);
  const [fundingStats, setFundingStats] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!profile?._id) return;
      try {
        const [connRes, planRes, statsRes] = await Promise.all([
          api.get('/connections'),
          getExpensePlan(profile._id),
          getFundingProgress(profile._id)
        ]);
        setConnections(connRes.data);
        setExpensePlan(planRes.data);
        setFundingStats(statsRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [profile]);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/connections/${id}`, { status });
      setConnections(prev => prev.map(c => c._id === id ? { ...c, status } : c));
      // Refresh funding progress if a connection was accepted
      if (status === 'accepted') {
        const { data } = await getFundingProgress(profile._id);
        setFundingStats(data);
      }
    } catch (err) {
      console.error('Failed to update connection');
    }
  };

  const handleUpdateActual = async (planId, actualAmount) => {
    try {
      await updateActualExpense(profile._id, planId, actualAmount);
      setExpensePlan(prev => prev.map(item => item._id === planId ? { ...item, actualAmount } : item));
    } catch (err) {
      console.error('Failed to update actual spend');
    }
  };

  const pending = connections.filter(c => c.status === 'pending');
  const accepted = connections.filter(c => c.status === 'accepted');

  const tabs = [
    { key: 'connections', label: 'Connections', icon: '🤝' },
    { key: 'investment', label: 'Investment & Funding', icon: '💰' },
    { key: 'reviews', label: 'Reviews', icon: '⭐' },
  ];

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Startup <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-surface-400">Manage your profile and connections</p>
          </div>
          <Link href="/profile/startup" className="btn-secondary mt-4 sm:mt-0">
            ✏️ Edit Profile
          </Link>
        </div>

        {/* Profile Summary */}
        {profile ? (
          <div className="card mb-8 animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                  {profile.companyName?.charAt(0)?.toUpperCase() || 'S'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{profile.companyName}</h2>
                  <p className="text-sm text-surface-400">{profile.location || 'No location set'}</p>
                  <div className="flex gap-2 mt-2">
                     <span className="px-2 py-0.5 rounded-lg bg-primary-500/10 text-primary-400 text-[10px] font-bold border border-primary-500/20">{profile.stage}</span>
                     <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">₹{profile.investmentNeeded?.toLocaleString('en-IN')} Target</span>
                  </div>
                </div>
              </div>
              
              {fundingStats && (
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-right">
                    <p className="text-[10px] text-surface-400 uppercase font-bold">Funding Progress</p>
                    <p className="text-lg font-bold text-emerald-400">{fundingStats.percentage.toFixed(1)}%</p>
                  </div>
                  <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${fundingStats.percentage}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="card mb-8 text-center p-8 animate-slide-up">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-lg font-semibold mb-2">No profile yet</h3>
            <p className="text-surface-400 text-sm mb-4">Create your startup profile to start receiving connection requests.</p>
            <Link href="/profile/startup" className="btn-primary">Create Profile</Link>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 p-1 bg-white/5 rounded-2xl border border-white/10 animate-slide-up overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 min-w-[150px] ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'text-surface-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Connections Tab */}
        {activeTab === 'connections' && (
          <div className="animate-fade-in">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Pending', value: pending.length, color: 'text-yellow-400' },
                { label: 'Connected', value: accepted.length, color: 'text-emerald-400' },
                { label: 'Total', value: connections.length, color: 'text-primary-400' },
              ].map((stat, i) => (
                <div key={i} className="card text-center animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-surface-400 mt-1">{stat.label} Connections</p>
                </div>
              ))}
            </div>

            {/* Pending Requests */}
            {pending.length > 0 && (
              <div className="mb-8 animate-slide-up">
                <h2 className="text-lg font-semibold mb-4 text-surface-200">Pending Requests</h2>
                <div className="space-y-3">
                  {pending.map(conn => (
                    <div key={conn._id} className="glass-hover p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-surface-100">{conn.supporter?.fullName || 'Supporter'}</p>
                        <p className="text-sm text-surface-400 capitalize">{conn.supporter?.type?.replace('_', ' ')}</p>
                        {conn.initialMessage && <p className="text-sm text-surface-300 mt-1 italic">&ldquo;{conn.initialMessage}&rdquo;</p>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleStatus(conn._id, 'accepted')} className="btn-primary text-xs px-4 py-2">Accept</button>
                        <button onClick={() => handleStatus(conn._id, 'rejected')} className="btn-danger text-xs px-4 py-2">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Connections */}
            {accepted.length > 0 && (
              <div className="animate-slide-up">
                <h2 className="text-lg font-semibold mb-4 text-surface-200">Active Connections</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accepted.map(conn => (
                    <Link key={conn._id} href={`/connections/${conn._id}`} className="block">
                      <div className="glass-hover p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center text-sm font-bold">
                             {conn.supporter?.fullName?.charAt(0) || 'S'}
                           </div>
                           <div>
                            <p className="font-medium text-surface-100">{conn.supporter?.fullName || 'Supporter'}</p>
                            <p className="text-[10px] text-surface-400 uppercase tracking-wider">{conn.supporter?.type?.replace('_', ' ')}</p>
                           </div>
                        </div>
                        <span className="status-badge bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Chat</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Investment Tab */}
        {activeTab === 'investment' && (
          <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                {fundingStats && (
                  <FundingProgress 
                    investmentNeeded={fundingStats.investmentNeeded}
                    totalInterested={fundingStats.totalInterested}
                    investors={fundingStats.investors}
                  />
                )}
              </div>
              <div className="lg:col-span-2">
                <div className="card">
                  <h2 className="text-lg font-semibold mb-4 text-surface-100">Investment Utilization Plan</h2>
                  <ExpensePlanTable 
                    plan={expensePlan} 
                    editable={true} 
                    onUpdateActual={handleUpdateActual} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && user && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-semibold mb-4 text-surface-200">⭐ Your Reviews</h2>
            <div className="card">
              <ReviewList userId={user.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

