'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

const PREDEFINED_TAGS = [
  'AI', 'Fintech', 'Health', 'EdTech', 'SaaS', 'E-commerce', 'IoT', 'Blockchain',
  'CleanTech', 'Social', 'Gaming', 'Cybersecurity', 'AgriTech', 'MarTech', 'LegalTech',
];

interface FilterSidebarProps {
  filters: Record<string, string>;
  setFilters: (filters: Record<string, string>) => void;
}

export default function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>(PREDEFINED_TAGS);

  useEffect(() => {
    // Fetch dynamic tags from backend
    api.get('/startups/tags/list').then(({ data }) => {
      if (data.length > 0) {
        const merged = Array.from(new Set([...PREDEFINED_TAGS, ...data])).sort();
        setAvailableTags(merged);
      }
    }).catch(() => {});
  }, []);

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    if (!value) delete newFilters[key];
    setFilters(newFilters);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    if (newTags.length > 0) {
      handleChange('tags', newTags.join(','));
    } else {
      const newFilters = { ...filters };
      delete newFilters.tags;
      setFilters(newFilters);
    }
  };

  const clearAll = () => {
    setFilters({});
    setSelectedTags([]);
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="glass p-6 sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-white">Filters</h3>
          {(Object.keys(filters).length > 0 || selectedTags.length > 0) && (
            <button onClick={clearAll} className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-5">
          {/* Search */}
          <div>
            <label className="label">Search</label>
            <input
              type="text"
              placeholder="Company name, description..."
              value={filters.search || ''}
              onChange={e => handleChange('search', e.target.value)}
              className="input-field text-sm"
              id="filter-search"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="label">Tags / Categories</label>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/40'
                      : 'bg-white/5 text-surface-400 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="label">Location</label>
            <input
              type="text"
              placeholder="City, country..."
              value={filters.location || ''}
              onChange={e => handleChange('location', e.target.value)}
              className="input-field text-sm"
              id="filter-location"
            />
          </div>

          {/* Funding Range */}
          <div>
            <label className="label">Min Funding Needed ($)</label>
            <input
              type="number"
              placeholder="0"
              value={filters.fundingMin || ''}
              onChange={e => handleChange('fundingMin', e.target.value)}
              className="input-field text-sm"
              id="filter-funding-min"
            />
          </div>
          <div>
            <label className="label">Max Funding Needed ($)</label>
            <input
              type="number"
              placeholder="Any"
              value={filters.fundingMax || ''}
              onChange={e => handleChange('fundingMax', e.target.value)}
              className="input-field text-sm"
              id="filter-funding-max"
            />
          </div>

          {/* Technical Help */}
          <div>
            <label className="label">Technical Help</label>
            <input
              type="text"
              placeholder="e.g., React, Machine Learning"
              value={filters.technicalHelp || ''}
              onChange={e => handleChange('technicalHelp', e.target.value)}
              className="input-field text-sm"
              id="filter-tech-help"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
