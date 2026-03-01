'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function RegisterPage() {
  const { register } = useAuth();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(searchParams.get('role') || 'startup');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, role);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Join LaunchPad</h1>
          <p className="text-surface-400">Create your account and start connecting</p>
        </div>

        <div className="card animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-scale-in">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="label">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('startup')}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    role === 'startup'
                      ? 'bg-primary-500/10 border-primary-500/50 text-primary-400'
                      : 'bg-white/5 border-white/10 text-surface-400 hover:border-white/20'
                  }`}
                  id="role-startup"
                >
                  <span className="text-2xl block mb-1">🚀</span>
                  <span className="text-sm font-medium">Startup</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('supporter')}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    role === 'supporter'
                      ? 'bg-accent-500/10 border-accent-500/50 text-accent-400'
                      : 'bg-white/5 border-white/10 text-surface-400 hover:border-white/20'
                  }`}
                  id="role-supporter"
                >
                  <span className="text-2xl block mb-1">🤝</span>
                  <span className="text-sm font-medium">Supporter</span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field"
                placeholder="Min 6 characters"
                required
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="Re-enter password"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full" id="register-submit">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-surface-400">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-400 hover:text-primary-300 transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
