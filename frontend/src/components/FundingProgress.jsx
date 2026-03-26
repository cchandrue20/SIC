'use client';

const formatINR = (n) => '₹' + (Number(n) || 0).toLocaleString('en-IN');

export default function FundingProgress({ investmentNeeded = 0, totalInterested = 0, investors = [] }) {
  const iNeeded = Number(investmentNeeded) || 0;
  const iInterested = Number(totalInterested) || 0;
  const percentage = iNeeded > 0 
    ? Math.min(100, (iInterested / iNeeded) * 100) 
    : 0;
  
  const remaining = Math.max(0, iNeeded - iInterested);

  return (
    <div className="card animate-slide-up">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-sm font-semibold text-surface-400 mb-1">Funding Progress</h3>
          <p className="text-2xl font-bold text-white">{formatINR(iInterested)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-surface-400">Target</p>
          <p className="text-sm font-medium text-surface-200">{formatINR(iNeeded)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs mb-6">
        <span className="text-emerald-400 font-bold">{percentage.toFixed(1)}% Funded</span>
        <span className="text-surface-400">{formatINR(remaining)} Remaining</span>
      </div>

      {/* Investors List */}
      {investors.length > 0 && (
        <div className="pt-4 border-t border-white/5">
          <h4 className="text-xs font-semibold text-surface-400 mb-3 uppercase tracking-wider">Interested Investors</h4>
          <div className="space-y-2">
            {investors.map((investor, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-surface-200">{investor.name}</span>
                <span className="text-emerald-400 font-medium">{formatINR(investor.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
