'use client';

interface FilterSidebarProps {
  filters: Record<string, string>;
  setFilters: (filters: Record<string, string>) => void;
}

export default function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    if (!value) delete newFilters[key];
    setFilters(newFilters);
  };

  const clearAll = () => setFilters({});

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="glass p-6 sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-white">Filters</h3>
          {Object.keys(filters).length > 0 && (
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
