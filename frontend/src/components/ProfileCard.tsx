'use client';

import Link from 'next/link';

interface ProfileCardProps {
  profile: any;
  type: 'startup' | 'supporter';
}

export default function ProfileCard({ profile, type }: ProfileCardProps) {
  if (type === 'startup') {
    return (
      <Link href={`/browse/${profile._id}`} className="block">
        <div className="glass-hover p-6 h-full flex flex-col group">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
              {profile.companyName?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-white truncate group-hover:text-primary-400 transition-colors">
                {profile.companyName}
              </h3>
              {profile.location && (
                <p className="text-xs text-surface-400 flex items-center gap-1 mt-0.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {profile.location}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-surface-300 line-clamp-3 mb-4 flex-1">
            {profile.description || profile.pitch || 'No description provided.'}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {profile.fundingNeeded > 0 && (
              <span className="status-badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                💰 ${(profile.fundingNeeded / 1000).toFixed(0)}K needed
              </span>
            )}
            {profile.technicalHelp && (
              <span className="status-badge bg-blue-500/10 text-blue-400 border border-blue-500/20">
                🔧 Tech help needed
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Supporter card
  return (
    <div className="glass-hover p-6 h-full flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-600 to-primary-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {profile.fullName?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{profile.fullName}</h3>
          <p className="text-xs text-surface-400 capitalize">{profile.type?.replace('_', ' ')}</p>
        </div>
      </div>
      <p className="text-sm text-surface-300 line-clamp-3 mb-4 flex-1">
        {profile.bio || 'No bio provided.'}
      </p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {profile.investmentMax > 0 && (
          <span className="status-badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            💰 Up to ${(profile.investmentMax / 1000).toFixed(0)}K
          </span>
        )}
        {profile.expertiseAreas && (
          <span className="status-badge bg-blue-500/10 text-blue-400 border border-blue-500/20">
            🎯 {profile.expertiseAreas.split(',')[0]}
          </span>
        )}
      </div>
    </div>
  );
}
