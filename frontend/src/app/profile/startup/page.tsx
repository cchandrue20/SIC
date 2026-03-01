'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

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
    }
  }, [user, profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = { ...form, fundingNeeded: Number(form.fundingNeeded) || 0 };
      if (isEditing && profile) {
        await api.put(`/startups/${profile._id}`, payload);
      } else {
        await api.post('/startups', payload);
      }
      await checkUser();
      router.push('/dashboard/startup');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
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
