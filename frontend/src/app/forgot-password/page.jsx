'use client';

import { useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-surface-400">Enter your email to receive a reset link</p>
        </div>

        <div className="card animate-slide-up">
          {sent ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-4">📧</div>
              <h2 className="text-lg font-semibold mb-2 text-white">Check Your Email</h2>
              <p className="text-surface-400 text-sm mb-6">
                If an account exists with that email, we&apos;ve sent a password reset link.
              </p>
              <Link href="/login" className="btn-primary">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-scale-in">
                  {error}
                </div>
              )}

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

              <button type="submit" disabled={loading} className="btn-primary w-full" id="forgot-password-submit">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-primary-400 hover:text-primary-300 transition-colors font-medium">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
