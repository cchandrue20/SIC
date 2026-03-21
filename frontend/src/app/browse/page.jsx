'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ProfileCard from '@/components/ProfileCard';
import FilterSidebar from '@/components/FilterSidebar';

export default function BrowsePage() {
  const [startups, setStartups] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartups = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(filters).toString();
        const { data } = await api.get(`/startups?${params}`);
        setStartups(data);
      } catch (err) {
        console.error('Failed to fetch startups');
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchStartups, 300);
    return () => clearTimeout(debounce);
  }, [filters]);

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">
            Discover <span className="gradient-text">Startups</span>
          </h1>
          <p className="text-surface-400">Find innovative startups looking for support</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar filters={filters} setFilters={setFilters} />

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass p-6 animate-pulse">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-white/5" />
                      <div className="flex-1">
                        <div className="h-5 bg-white/5 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-white/5 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-3 bg-white/5 rounded mb-2" />
                    <div className="h-3 bg-white/5 rounded w-5/6 mb-4" />
                    <div className="flex gap-2">
                      <div className="h-5 bg-white/5 rounded-full w-20" />
                      <div className="h-5 bg-white/5 rounded-full w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : startups.length === 0 ? (
              <div className="glass p-12 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold mb-2">No startups found</h3>
                <p className="text-surface-400 text-sm">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {startups.map(s => (
                  <ProfileCard key={s._id} profile={s} type="startup" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
