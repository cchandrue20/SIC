'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
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
      await api.post(`/auth/reset-password/${params.token}`, { password });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Set New Password</h1>
          <p className="text-surface-400">Enter your new password below</p>
        </div>

        <div className="card animate-slide-up">
          {success ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-lg font-semibold mb-2 text-white">Password Reset!</h2>
              <p className="text-surface-400 text-sm mb-4">
                Your password has been updated. Redirecting to login...
              </p>
              <Link href="/login" className="btn-primary">
                Go to Login
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
                <label htmlFor="password" className="label">New Password</label>
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

              <button type="submit" disabled={loading} className="btn-primary w-full" id="reset-password-submit">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
