'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardLink = user?.role === 'admin'
    ? '/admin'
    : user?.role === 'startup'
    ? '/dashboard/startup'
    : '/dashboard/supporter';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
              L
            </div>
            <span className="text-lg font-bold gradient-text">LaunchPad</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/browse" className="px-4 py-2 rounded-lg text-sm text-surface-300 hover:text-white hover:bg-white/5 transition-all">
              Browse Startups
            </Link>
            {!loading && user && (
              <>
                <Link href={dashboardLink} className="px-4 py-2 rounded-lg text-sm text-surface-300 hover:text-white hover:bg-white/5 transition-all">
                  Dashboard
                </Link>
                <Link href="/connections" className="px-4 py-2 rounded-lg text-sm text-surface-300 hover:text-white hover:bg-white/5 transition-all">
                  Connections
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-9 rounded-lg bg-white/5 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-surface-400">
                  {user.email}
                  <span className="ml-1.5 status-badge bg-primary-500/10 text-primary-400 border border-primary-500/20">
                    {user.role}
                  </span>
                </span>
                <button onClick={logout} className="btn-secondary text-xs px-4 py-2">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-xs px-4 py-2">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-xs px-4 py-2">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-surface-400 hover:text-white hover:bg-white/5"
            id="mobile-menu-toggle"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-white/5 animate-slide-down">
            <div className="flex flex-col gap-1">
              <Link href="/browse" onClick={() => setMobileOpen(false)} className="px-4 py-2 rounded-lg text-sm text-surface-300 hover:text-white hover:bg-white/5">
                Browse Startups
              </Link>
              {user && (
                <>
                  <Link href={dashboardLink} onClick={() => setMobileOpen(false)} className="px-4 py-2 rounded-lg text-sm text-surface-300 hover:text-white hover:bg-white/5">
                    Dashboard
                  </Link>
                  <Link href="/connections" onClick={() => setMobileOpen(false)} className="px-4 py-2 rounded-lg text-sm text-surface-300 hover:text-white hover:bg-white/5">
                    Connections
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-white/5">
                    Logout
                  </button>
                </>
              )}
              {!user && !loading && (
                <div className="flex gap-2 px-4 pt-2">
                  <Link href="/login" className="btn-secondary text-xs px-4 py-2">Login</Link>
                  <Link href="/register" className="btn-primary text-xs px-4 py-2">Get Started</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
