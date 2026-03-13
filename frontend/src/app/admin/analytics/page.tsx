'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = ['#6366f1', '#d946ef', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [userStats, setUserStats] = useState<any>(null);
  const [connectionStats, setConnectionStats] = useState<any>(null);
  const [tagStats, setTagStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const [usersRes, connsRes, tagsRes] = await Promise.all([
          api.get(`/admin/stats/users?days=${days}`),
          api.get(`/admin/stats/connections?days=${days}`),
          api.get('/admin/stats/tags'),
        ]);
        setUserStats(usersRes.data);
        setConnectionStats(connsRes.data);
        setTagStats(tagsRes.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user, router, days]);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              <span className="gradient-text">Analytics</span> Dashboard
            </h1>
            <p className="text-surface-400">Platform insights and trends</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Link href="/admin" className="btn-secondary">← Admin Panel</Link>
            <select
              value={days}
              onChange={e => setDays(Number(e.target.value))}
              className="input-field w-auto text-sm"
              id="analytics-days"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Users', value: userStats?.totals?.users || 0, color: 'text-primary-400' },
            { label: 'Startups', value: userStats?.totals?.startups || 0, color: 'text-emerald-400' },
            { label: 'Supporters', value: userStats?.totals?.supporters || 0, color: 'text-accent-400' },
            { label: 'Connections', value: connectionStats?.totals?.total || 0, color: 'text-blue-400' },
            { label: 'Accepted', value: connectionStats?.totals?.accepted || 0, color: 'text-yellow-400' },
          ].map((stat, i) => (
            <div key={i} className="card text-center animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-surface-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-lg font-semibold mb-4">User Growth</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userStats?.daily || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }}
                    tickFormatter={(v: string) => v.slice(5)} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12 }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5}
                    dot={{ fill: '#6366f1', r: 4 }} name="New Users" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Connection Activity Chart */}
          <div className="card animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <h2 className="text-lg font-semibold mb-4">Connection Activity</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={connectionStats?.daily || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }}
                    tickFormatter={(v: string) => v.slice(5)} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12 }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Legend />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="accepted" fill="#10b981" name="Accepted" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rejected" fill="#ef4444" name="Rejected" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-semibold mb-4">Popular Tags</h2>
          {tagStats.length === 0 ? (
            <p className="text-surface-400 text-sm">No tag data available yet.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tagStats}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={100}
                      paddingAngle={3}
                      dataKey="count"
                      nameKey="tag"
                    >
                      {tagStats.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {tagStats.map((tag, i) => (
                  <div key={tag.tag} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-sm text-surface-200">{tag.tag}</span>
                    </div>
                    <span className="text-sm font-semibold text-surface-300">{tag.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
