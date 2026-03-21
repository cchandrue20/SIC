'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const PREDEFINED_TAGS = [
  'AI', 'Fintech', 'Health', 'EdTech', 'SaaS', 'E-commerce', 'IoT', 'Blockchain',
  'CleanTech', 'Social', 'Gaming', 'Cybersecurity', 'AgriTech', 'MarTech', 'LegalTech',
];

export default function StartupProfilePage() {
  const { user, profile, checkUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: '',
    description: '',
    pitch: '',
    fundingNeeded: '',
    technicalHelp: '',
    website: '',
    location: '',
  });
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
        fundingNeeded: profile.fundingNeeded?.toString() || '',
        technicalHelp: profile.technicalHelp || '',
        website: profile.website || '',
        location: profile.location || '',
      });
      setSelectedTags(profile.tags || []);
    }
  }, [user, profile, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        fundingNeeded: Number(form.fundingNeeded) || 0,
        tags: selectedTags,
      };
      if (isEditing && profile) {
        await api.put(`/startups/${profile._id}`, payload);
      } else {
        await api.post('/startups', payload);
      }
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
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">
            {isEditing ? 'Edit' : 'Create'} <span className="gradient-text">Startup Profile</span>
          </h1>
          <p className="text-surface-400">Tell supporters about your startup</p>
        </div>

        <div className="card animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}

            <div>
              <label className="label">Company Name *</label>
              <input type="text" value={form.companyName} onChange={e => handleChange('companyName', e.target.value)} className="input-field" required id="startup-company-name" />
            </div>

            <div>
              <label className="label">Description</label>
              <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} className="input-field h-28 resize-none" placeholder="What does your company do?" id="startup-description" />
            </div>

            <div>
              <label className="label">Pitch</label>
              <textarea value={form.pitch} onChange={e => handleChange('pitch', e.target.value)} className="input-field h-28 resize-none" placeholder="Your elevator pitch..." id="startup-pitch" />
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
                  id="custom-tag-input"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label">Funding Needed ($)</label>
                <input type="number" value={form.fundingNeeded} onChange={e => handleChange('fundingNeeded', e.target.value)} className="input-field" placeholder="50000" id="startup-funding" />
              </div>
              <div>
                <label className="label">Location</label>
                <input type="text" value={form.location} onChange={e => handleChange('location', e.target.value)} className="input-field" placeholder="San Francisco, CA" id="startup-location" />
              </div>
            </div>

            <div>
              <label className="label">Technical Help Needed</label>
              <textarea value={form.technicalHelp} onChange={e => handleChange('technicalHelp', e.target.value)} className="input-field h-24 resize-none" placeholder="e.g., Full-stack developer, ML engineer..." id="startup-tech-help" />
            </div>

            <div>
              <label className="label">Website</label>
              <input type="url" value={form.website} onChange={e => handleChange('website', e.target.value)} className="input-field" placeholder="https://yourcompany.com" id="startup-website" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full" id="startup-profile-submit">
              {loading ? 'Saving...' : isEditing ? 'Update Profile' : 'Create Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
