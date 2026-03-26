'use client';

const STAGE_COLORS = {
  'Idea': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'MVP': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Revenue': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
};

const formatINR = (n) => '₹' + (Number(n) || 0).toLocaleString('en-IN');

export default function InvestmentOverview({ stage, equity, traction, investmentNeeded }) {
  return (
    <div className="card animate-slide-up">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-xs font-semibold text-surface-400 mb-2 uppercase">Stage</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STAGE_COLORS[stage] || STAGE_COLORS['Idea']}`}>
            {stage}
          </span>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-surface-400 mb-2 uppercase">Equity Offered</h3>
          <p className="text-xl font-bold text-white">{equity ? `${equity}%` : '—'}</p>
        </div>
        <div className="col-span-2">
          <h3 className="text-xs font-semibold text-surface-400 mb-2 uppercase">Traction</h3>
          <p className="text-sm text-surface-200 italic">"{traction || 'No traction data provided yet.'}"</p>
        </div>
        <div className="col-span-2 pt-4 border-t border-white/5">
          <h3 className="text-xs font-semibold text-surface-400 mb-1 uppercase">Investment Needed</h3>
          <p className="text-3xl font-bold gradient-text">{investmentNeeded ? formatINR(investmentNeeded) : <span className="text-surface-400 text-lg">Not specified</span>}</p>
        </div>
      </div>
    </div>
  );
}
