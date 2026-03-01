'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function SupporterProfilePage() {
  const { user, profile, checkUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    bio: '',
    type: 'investor',
    investmentMin: '',
    investmentMax: '',
    expertiseAreas: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'supporter') {
      router.push('/profile/startup');
      return;
    }
    if (profile) {
      setIsEditing(true);
      setForm({
        fullName: profile.fullName || '',
        bio: profile.bio || '',
        type: profile.type || 'investor',
        investmentMin: profile.investmentMin?.toString() || '',
        investmentMax: profile.investmentMax?.toString() || '',
        expertiseAreas: profile.expertiseAreas || '',
        location: profile.location || '',
      });
    }
  }, [user, profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        investmentMin: Number(form.investmentMin) || 0,
        investmentMax: Number(form.investmentMax) || 0,
      };
      if (isEditing && profile) {
        await api.put(`/supporters/${profile._id}`, payload);
      } else {
        await api.post('/supporters', payload);
      }
      await checkUser();
      router.push('/dashboard/supporter');
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
            {isEditing ? 'Edit' : 'Create'} <span className="gradient-text">Supporter Profile</span>
          </h1>
          <p className="text-surface-400">Tell startups how you can help</p>
        </div>

        <div className="card animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}

            <div>
              <label className="label">Full Name *</label>
              <input type="text" value={form.fullName} onChange={e => handleChange('fullName', e.target.value)} className="input-field" required id="supporter-fullname" />
            </div>

            <div>
              <label className="label">Bio</label>
              <textarea value={form.bio} onChange={e => handleChange('bio', e.target.value)} className="input-field h-28 resize-none" placeholder="Your background and experience..." id="supporter-bio" />
            </div>

            <div>
              <label className="label">Type</label>
              <select value={form.type} onChange={e => handleChange('type', e.target.value)} className="input-field" id="supporter-type">
                <option value="investor">Investor</option>
                <option value="technical_expert">Technical Expert</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label">Min Investment ($)</label>
                <input type="number" value={form.investmentMin} onChange={e => handleChange('investmentMin', e.target.value)} className="input-field" placeholder="10000" id="supporter-invest-min" />
              </div>
              <div>
                <label className="label">Max Investment ($)</label>
                <input type="number" value={form.investmentMax} onChange={e => handleChange('investmentMax', e.target.value)} className="input-field" placeholder="500000" id="supporter-invest-max" />
              </div>
            </div>

            <div>
              <label className="label">Expertise Areas</label>
              <input type="text" value={form.expertiseAreas} onChange={e => handleChange('expertiseAreas', e.target.value)} className="input-field" placeholder="React, AI/ML, FinTech..." id="supporter-expertise" />
            </div>

            <div>
              <label className="label">Location</label>
              <input type="text" value={form.location} onChange={e => handleChange('location', e.target.value)} className="input-field" placeholder="New York, NY" id="supporter-location" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full" id="supporter-profile-submit">
              {loading ? 'Saving...' : isEditing ? 'Update Profile' : 'Create Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
