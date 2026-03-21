'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [startups, setStartups] = useState([]);
  const [supporters, setSupporters] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish loading

    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [usersRes, startupsRes, supportersRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/startups'),
          api.get('/admin/supporters'),
        ]);
        setUsers(usersRes.data);
        setStartups(startupsRes.data);
        setSupporters(supportersRes.data);
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, authLoading, router]);

  const toggleUserActive = async (id, isActive) => {
    try {
      await api.put(`/admin/users/${id}`, { isActive: !isActive });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: !isActive } : u));
    } catch (err) {
      console.error('Failed to update user');
    }
  };

  const toggleStartup = async (id) => {
    try {
      const { data } = await api.put(`/admin/startups/${id}/toggle`);
      setStartups(prev => prev.map(s => s._id === id ? data : s));
    } catch (err) {
      console.error('Failed to toggle startup');
    }
  };

  const toggleSupporter = async (id) => {
    try {
      const { data } = await api.put(`/admin/supporters/${id}/toggle`);
      setSupporters(prev => prev.map(s => s._id === id ? data : s));
    } catch (err) {
      console.error('Failed to toggle supporter');
    }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'users', label: 'Users', count: users.length },
    { id: 'startups', label: 'Startups', count: startups.length },
    { id: 'supporters', label: 'Supporters', count: supporters.length },
  ];

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-surface-400">Manage users and listings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {tabs.map((tab, i) => (
            <div key={tab.id} className="card text-center animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <p className="text-3xl font-bold text-primary-400">{tab.count}</p>
              <p className="text-sm text-surface-400 mt-1">{tab.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/5 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-surface-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Users Table */}
        {activeTab === 'users' && (
          <div className="card overflow-x-auto animate-fade-in">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-surface-400 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-surface-400 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-surface-400 font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-surface-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className="status-badge bg-primary-500/10 text-primary-400 border border-primary-500/20">{u.role}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={u.isActive ? 'status-accepted' : 'status-rejected'}>
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleUserActive(u._id, u.isActive)}
                        className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                          u.isActive ? 'text-red-400 hover:bg-red-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        {u.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Startups Table */}
        {activeTab === 'startups' && (
          <div className="card overflow-x-auto animate-fade-in">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-surface-400 font-medium">Company</th>
                  <th className="text-left py-3 px-4 text-surface-400 font-medium">Owner</th>
                  <th className="text-left py-3 px-4 text-surface-400 font-medium">Funding</th>
                  <th className="text-left py-3 px-4 text-surface-400 font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-surface-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {startups.map(s => (
                  <tr key={s._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-medium">{s.companyName}</td>
                    <td className="py-3 px-4 text-surface-400">{s.user?.email}</td>
                    <td className="py-3 px-4">${s.fundingNeeded?.toLocaleString() || 0}</td>
                    <td className="py-3 px-4">
                      <span className={s.isActive ? 'status-accepted' : 'status-rejected'}>
                        {s.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => toggleStartup(s._id)} className="text-xs px-3 py-1.5 rounded-lg text-primary-400 hover:bg-primary-500/10 transition-colors">
                        Toggle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Supporters Table */}
        {activeTab === 'supporters' && (
          <div className="card overflow-x-auto animate-fade-in">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-surface-400 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-surface-400 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-surface-400 font-medium">Owner</th>
                  <th className="text-left py-3 px-4 text-surface-400 font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-surface-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {supporters.map(s => (
                  <tr key={s._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-medium">{s.fullName}</td>
                    <td className="py-3 px-4 capitalize text-surface-300">{s.type?.replace('_', ' ')}</td>
                    <td className="py-3 px-4 text-surface-400">{s.user?.email}</td>
                    <td className="py-3 px-4">
                      <span className={s.isActive ? 'status-accepted' : 'status-rejected'}>
                        {s.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => toggleSupporter(s._id)} className="text-xs px-3 py-1.5 rounded-lg text-primary-400 hover:bg-primary-500/10 transition-colors">
                        Toggle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
