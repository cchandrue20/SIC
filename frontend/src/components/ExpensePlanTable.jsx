'use client';

import { useState } from 'react';

const formatINR = (n) => '₹' + (Number(n) || 0).toLocaleString('en-IN');

export default function ExpensePlanTable({ plan = [], editable = false, onUpdateActual }) {
  const [updatingId, setUpdatingId] = useState(null);
  const [editAmount, setEditAmount] = useState('');

  const handleUpdateClick = (item) => {
    setUpdatingId(item._id);
    setEditAmount((item.actualAmount || 0).toString());
  };

  const handleSave = async (id) => {
    await onUpdateActual(id, Number(editAmount));
    setUpdatingId(null);
  };

  const totalPlanned = plan.reduce((sum, item) => sum + (Number(item.plannedAmount) || 0), 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Category</th>
            <th className="py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Planned</th>
            {onUpdateActual && <th className="py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Actual</th>}
            {!onUpdateActual && <th className="py-3 px-4 text-xs font-semibold text-surface-400 uppercase text-right">Share</th>}
            {onUpdateActual && <th className="py-3 px-4 text-xs font-semibold text-surface-400 uppercase">Status</th>}
            {editable && <th className="py-3 px-4 text-xs font-semibold text-surface-400 uppercase text-right">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {plan.map((item) => {
            const actualAmt = Number(item.actualAmount) || 0;
            const plannedAmt = Number(item.plannedAmount) || 1; // prevent division by zero
            const isOver = actualAmt > plannedAmt;
            const utilization = (actualAmt / plannedAmt) * 100;
            const share = totalPlanned > 0 ? (plannedAmt / totalPlanned) * 100 : 0;

            return (
              <tr key={item._id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-4 font-medium text-surface-200">{item.category}</td>
                <td className="py-4 px-4 text-surface-300">{formatINR(item.plannedAmount)}</td>
                
                {onUpdateActual && (
                  <td className="py-4 px-4">
                    {updatingId === item._id ? (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          className="input-field py-1 px-2 text-sm w-24"
                          autoFocus
                        />
                        <button 
                          onClick={() => handleSave(item._id)}
                          className="text-emerald-400 hover:text-emerald-300"
                        >
                          ✓
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className={isOver ? 'text-red-400' : 'text-emerald-400'}>
                          {formatINR(actualAmt)}
                        </span>
                        <div className="w-24 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                           <div 
                            className={`h-full ${isOver ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, utilization)}%` }}
                           />
                        </div>
                      </div>
                    )}
                  </td>
                )}

                {!onUpdateActual && (
                  <td className="py-4 px-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-surface-300">{share.toFixed(0)}%</span>
                      <div className="w-16 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-primary-500" style={{ width: `${share}%` }} />
                      </div>
                    </div>
                  </td>
                )}

                {onUpdateActual && (
                  <td className="py-4 px-4">
                    {isOver ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] uppercase font-bold border border-red-500/20">Over</span>
                    ) : utilization > 90 ? (
                      <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] uppercase font-bold border border-yellow-500/20">Near Limit</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold border border-emerald-500/20">On Track</span>
                    )}
                  </td>
                )}

                {editable && (
                  <td className="py-4 px-4 text-right">
                    <button 
                      onClick={() => handleUpdateClick(item)}
                      className="text-xs text-primary-400 hover:text-primary-300"
                    >
                      Update
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-white/10 font-bold">
            <td className="py-4 px-4">Total</td>
            <td className="py-4 px-4">{formatINR(totalPlanned)}</td>
            {onUpdateActual && (
              <td className="py-4 px-4 text-emerald-400">
                {formatINR(plan.reduce((sum, item) => sum + (Number(item.actualAmount) || 0), 0))}
              </td>
            )}
            <td className="py-4 px-4" colSpan={2}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
