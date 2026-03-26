'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api, { createExpensePlan, getExpensePlan } from '@/lib/api';

const PREDEFINED_TAGS = [
  'AI', 'Fintech', 'Health', 'EdTech', 'SaaS', 'E-commerce', 'IoT', 'Blockchain',
  'CleanTech', 'Social', 'Gaming', 'Cybersecurity', 'AgriTech', 'MarTech', 'LegalTech',
];

const CATEGORIES = ['Product Development', 'Marketing', 'Infrastructure', 'Salaries', 'Legal & Misc', 'Other'];

const formatINR = (n) => '₹' + (Number(n) || 0).toLocaleString('en-IN');

export default function StartupProfilePage() {
  const { user, profile, checkUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: '',
    description: '',
    pitch: '',
    investmentNeeded: '',
    technicalHelp: '',
    website: '',
    location: '',
    stage: 'Idea',
    equity: '',
    traction: '',
  });
  const [expensePlan, setExpensePlan] = useState([{ category: 'Product Development', plannedAmount: '' }]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'startup') {
      router.push('/profile/supporter');
      return;
    }
    if (profile) {
      setIsEditing(true);
      setForm({
        companyName: profile.companyName || '',
        description: profile.description || '',
        pitch: profile.pitch || '',
        investmentNeeded: profile.investmentNeeded?.toString() || profile.fundingNeeded?.toString() || '',
        technicalHelp: profile.technicalHelp || '',
        website: profile.website || '',
        location: profile.location || '',
        stage: profile.stage || 'Idea',
        equity: profile.equity?.toString() || '',
        traction: profile.traction || '',
      });
      setSelectedTags(profile.tags || []);
      
      // Fetch existing expense plan
      getExpensePlan(profile._id).then(({ data }) => {
        if (data && data.length > 0) {
          setExpensePlan(data.map(d => ({ category: d.category, plannedAmount: d.plannedAmount.toString() })));
        }
      }).catch(console.error);
    }
  }, [user, profile, router]);

  const totalPlanned = expensePlan.reduce((sum, row) => sum + (Number(row.plannedAmount) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const needed = (Number(form.investmentNeeded) || 0);
    if (totalPlanned !== needed) {
      setError(`Total planned utilization (${formatINR(totalPlanned)}) must equal investment needed (${formatINR(needed)})`);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        investmentNeeded: needed,
        fundingNeeded: needed,
        equity: Number(form.equity) || 0,
        tags: selectedTags,
      };

      let startupId = profile?._id;
      if (isEditing && profile) {
        await api.put(`/startups/${profile._id}`, payload);
      } else {
        const { data } = await api.post('/startups', payload);
        startupId = data._id;
      }

      // Save expense plan
      await createExpensePlan(startupId, expensePlan.map(row => ({
        category: row.category,
        plannedAmount: Number(row.plannedAmount) || 0
      })));

      await checkUser();
      router.push('/dashboard/startup');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleExpenseChange = (index, key, value) => {
    const newPlan = [...expensePlan];
    newPlan[index][key] = value;
    setExpensePlan(newPlan);
  };

  const addExpenseRow = () => {
    setExpensePlan([...expensePlan, { category: 'Other', plannedAmount: '' }]);
  };

  const removeExpenseRow = (index) => {
    if (expensePlan.length > 1) {
      setExpensePlan(expensePlan.filter((_, i) => i !== index));
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    const tag = customTag.trim();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag]);
      setCustomTag('');
    }
  };

  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">
            {isEditing ? 'Edit' : 'Create'} <span className="gradient-text">Startup Profile</span>
          </h1>
          <p className="text-surface-400">Tell supporters about your startup and investment needs</p>
        </div>

        <div className="card animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6" id="startup-profile-form">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Company Name *</label>
                <input type="text" value={form.companyName} onChange={e => handleChange('companyName', e.target.value)} className="input-field" required id="startup-company-name" />
              </div>
              <div>
                <label className="label">Location</label>
                <input type="text" value={form.location} onChange={e => handleChange('location', e.target.value)} className="input-field" placeholder="San Francisco, CA" id="startup-location" />
              </div>
            </div>

            <div>
              <label className="label">One-line Description</label>
              <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} className="input-field h-20 resize-none" placeholder="What does your company do?" id="startup-description" />
            </div>

            <div>
              <label className="label">Detailed Pitch</label>
              <textarea value={form.pitch} onChange={e => handleChange('pitch', e.target.value)} className="input-field h-32 resize-none" placeholder="Your elevator pitch..." id="startup-pitch" />
            </div>

            {/* Investment Details */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
              <h3 className="text-lg font-semibold text-primary-400">Investment & Progress</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="label">Investment Needed (₹)</label>
                  <input type="number" value={form.investmentNeeded} onChange={e => handleChange('investmentNeeded', e.target.value)} className="input-field" placeholder="10,00,000" id="startup-investment" required />
                </div>
                <div>
                  <label className="label">Stage</label>
                  <select value={form.stage} onChange={e => handleChange('stage', e.target.value)} className="input-field" id="startup-stage">
                    <option value="Idea">Idea</option>
                    <option value="MVP">MVP</option>
                    <option value="Revenue">Revenue</option>
                  </select>
                </div>
                <div>
                  <label className="label">Equity Offered (%)</label>
                  <input type="number" value={form.equity} onChange={e => handleChange('equity', e.target.value)} className="input-field" placeholder="5" id="startup-equity" />
                </div>
              </div>

              <div>
                <label className="label">Traction</label>
                <input type="text" value={form.traction} onChange={e => handleChange('traction', e.target.value)} className="input-field" placeholder="e.g. 200 farmers onboarded, ₹50k MRR" id="startup-traction" />
              </div>

              {/* Utilization Plan Table */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="label mb-0">Investment Utilization Plan</label>
                  <button type="button" onClick={addExpenseRow} className="text-xs text-primary-400 hover:text-primary-300 font-bold" id="add-expense-row">+ Add Row</button>
                </div>
                <div className="space-y-3">
                  {expensePlan.map((row, index) => (
                    <div key={index} className="flex gap-3 items-center animate-fade-in">
                      <select 
                        value={row.category} 
                        onChange={e => handleExpenseChange(index, 'category', e.target.value)}
                        className="input-field flex-1 text-sm py-2"
                      >
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      <input 
                        type="number" 
                        value={row.plannedAmount} 
                        onChange={e => handleExpenseChange(index, 'plannedAmount', e.target.value)}
                        className="input-field flex-1 text-sm py-2"
                        placeholder="Amount (₹)"
                      />
                      <button 
                        type="button" 
                        onClick={() => removeExpenseRow(index)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        disabled={expensePlan.length === 1}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-sm text-surface-400 font-medium">Total Planned: <span className={totalPlanned === (Number(form.investmentNeeded) || 0) ? 'text-emerald-400' : 'text-red-400'}>{formatINR(totalPlanned)}</span></span>
                  <span className="text-sm text-surface-400">Needed: {formatINR(form.investmentNeeded)}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="label">Tags / Categories</label>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {PREDEFINED_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
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
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTag}
                  onChange={e => setCustomTag(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomTag(); }}}
                  className="input-field text-sm flex-1"
                  placeholder="Add custom tag"
                />
                <button type="button" onClick={addCustomTag} className="btn-secondary text-xs px-4 py-2">
                  Add
                </button>
              </div>
              {selectedTags.filter(t => !PREDEFINED_TAGS.includes(t)).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedTags.filter(t => !PREDEFINED_TAGS.includes(t)).map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-accent-500/20 text-accent-400 border border-accent-500/40 flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => toggleTag(tag)} className="hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Technical Help Needed</label>
                <textarea value={form.technicalHelp} onChange={e => handleChange('technicalHelp', e.target.value)} className="input-field h-24 resize-none" placeholder="e.g., Full-stack developer, ML engineer..." id="startup-tech-help" />
              </div>
              <div>
                <label className="label">Website</label>
                <input type="url" value={form.website} onChange={e => handleChange('website', e.target.value)} className="input-field" placeholder="https://yourcompany.com" id="startup-website" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg" id="startup-profile-submit">
              {loading ? 'Saving Profile...' : isEditing ? 'Update Profile' : 'Launch Startup Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
