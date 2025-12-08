import React, { useState } from 'react';
import { Pencil, ChevronDown, ChevronUp, PieChart, Plus } from 'lucide-react';
import { BUDGET_CATEGORIES } from '../../constants';

interface Props {
  isMockDataEnabled?: boolean;
}

const BudgetCard: React.FC<Props> = ({ isMockDataEnabled = true }) => {
  const [expandedId, setExpandedId] = useState<string | null>('1');

  if (!isMockDataEnabled) {
      return (
        <div className="bg-[#1E293B]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col h-full shadow-2xl items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-500">
                <PieChart size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Budget</h3>
            <p className="text-slate-400 text-sm max-w-xs mb-6">No budget categories defined yet. Create a budget to track your spending.</p>
            <button className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-xl transition-colors">
                <Plus size={16} />
                Create Budget
            </button>
        </div>
      )
  }

  const totalBudget = 5000;
  const totalSpent = 2800;
  const percentage = Math.round((totalSpent / totalBudget) * 100);

  // SVG parameters for circle
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-[#1E293B]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col h-full shadow-2xl">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Category Breakdown</h2>
        <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400">
            <Pencil size={14} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-between text-xs font-medium text-slate-500 mb-8 px-4">
        <span>Expenses</span>
        <span className="text-white relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-blue-500 after:rounded-full">Budget</span>
        <span>Income</span>
      </div>

      {/* Circular Chart */}
      <div className="flex justify-center mb-8 relative">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            {/* Track */}
            <circle
                stroke="#1e293b"
                strokeWidth={stroke}
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            {/* Progress */}
            <circle
                stroke="#3B82F6"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-xs text-slate-400 font-medium mb-1">{percentage}%</div>
            <div className="text-2xl font-bold text-white mb-1">${totalSpent.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500">${totalBudget.toLocaleString()} budget</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-4">
          <button className="flex items-center gap-1.5 text-xs bg-slate-800/50 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-300 transition-colors border border-white/5">
            <Pencil size={10} /> Edit budget
          </button>
          <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
            View by Group <ChevronDown size={12} />
          </button>
      </div>

      {/* Category List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {BUDGET_CATEGORIES.map((cat) => (
            <div key={cat.id} className="bg-slate-800/30 rounded-xl p-3 border border-white/5">
                <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedId(expandedId === cat.id ? null : cat.id)}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                        <span className="text-sm font-semibold text-white">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white">${cat.spent}</span>
                        <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden hidden sm:block">
                            <div className="h-full rounded-full" style={{ width: `${(cat.spent / cat.budget) * 100}%`, backgroundColor: cat.color }}></div>
                        </div>
                        <span className="text-xs text-slate-500">${cat.budget}</span>
                        {expandedId === cat.id ? <ChevronUp size={14} className="text-slate-400"/> : <ChevronDown size={14} className="text-slate-400"/>}
                    </div>
                </div>

                {/* Expanded Details */}
                {expandedId === cat.id && cat.merchants && (
                    <div className="mt-4 pl-5 space-y-3">
                        {cat.merchants.map((merchant, idx) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-sm">
                                        {merchant.logo}
                                    </div>
                                    <span className="text-sm text-slate-300">{merchant.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-slate-300">${merchant.amount.toFixed(2)}</span>
                                    <button className="opacity-0 group-hover:opacity-100 text-[10px] border border-white/10 px-2 py-1 rounded text-slate-400 hover:text-white transition-all">
                                        Add budget
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetCard;