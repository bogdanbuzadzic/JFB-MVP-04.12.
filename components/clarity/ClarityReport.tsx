
import React from 'react';
import { Home, Download, Printer, RotateCcw, CreditCard, PiggyBank, BarChart3, AlertCircle } from 'lucide-react';
import { ClaritySurveyData, ClarityScore } from '../../types';

interface Props {
  data: ClaritySurveyData;
  score: ClarityScore;
  onExit: () => void;
  onRestart: () => void;
}

const ClarityReport: React.FC<Props> = ({ data, score, onExit, onRestart }) => {
  const { spendingStatus, savingStatus, planningStatus } = score;
  
  // Dynamic color for score circle
  const getScoreColor = (s: number) => {
      if (s >= 80) return '#10B981'; // Emerald
      if (s >= 60) return '#60A5FA'; // Blue
      if (s >= 40) return '#F59E0B'; // Amber
      return '#EF4444'; // Red
  };

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'Excellent': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
        case 'Good': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
        case 'Fair': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
        case 'Poor': return 'bg-red-500/20 text-red-400 border-red-500/50';
        default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans">
      {/* Top Bar */}
      <div className="bg-[#1E293B] border-b border-white/5 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <button onClick={onExit} className="bg-[#1E293B]/80 border border-white/10 rounded-full px-6 py-2 font-bold hover:bg-white/10 transition-all flex items-center gap-2 shadow-lg text-sm">
            <Home size={16} /> HOME
        </button>
        <div className="flex gap-4">
            <button className="flex items-center gap-2 text-slate-400 hover:text-white text-sm">
                <Download size={16}/> Download PDF
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-white text-sm">
                <Printer size={16}/> Print
            </button>
            <button onClick={onRestart} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm">
                <RotateCcw size={16}/> Start Over
            </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] pb-12 pt-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">Your Financial Clarity Score</h1>
            
            {/* Score Circle */}
            <div className="relative w-64 h-64 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="128" cy="128" r="120" fill="transparent" stroke="#334155" strokeWidth="12" />
                    <circle 
                        cx="128" 
                        cy="128" 
                        r="120" 
                        fill="transparent" 
                        stroke={getScoreColor(score.total)} 
                        strokeWidth="12"
                        strokeDasharray={2 * Math.PI * 120}
                        strokeDashoffset={2 * Math.PI * 120 * (1 - score.total / 100)}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-7xl font-bold font-mono">{score.total}</span>
                    <span className="text-slate-400 text-xl">/ 100</span>
                </div>
            </div>

            <div className={`inline-block px-6 py-2 rounded-full border ${getStatusColor(score.total >= 80 ? 'Excellent' : score.total >= 60 ? 'Good' : score.total >= 40 ? 'Fair' : 'Poor')} text-xl font-bold mb-12`}>
                {score.total >= 80 ? 'Excellent' : score.total >= 60 ? 'Good' : score.total >= 40 ? 'Fair' : 'Poor'}
            </div>

            {/* Context Section (50-30-20) */}
            <div className="bg-[#1E293B] rounded-3xl p-8 border border-white/5 text-left shadow-2xl">
                <h2 className="text-2xl font-bold tracking-tight mb-4">Your score in context</h2>
                <p className="text-slate-400 mb-8 max-w-2xl">
                    We use the trusted 50-30-20 rule as a guideline: 50% on needs, 30% on wants, and 20% on savings/debt repayment.
                </p>

                <div className="space-y-8">
                    {/* Your Allocation */}
                    <div>
                        <div className="flex justify-between text-sm mb-2 font-bold text-slate-300">
                            <span>Your Allocation</span>
                        </div>
                        <div className="h-10 w-full rounded-full overflow-hidden flex bg-slate-800">
                            <div style={{width: `${score.breakdown.needsPercent}%`}} className="bg-pink-500 flex items-center justify-center text-xs font-bold text-white/90">
                                {score.breakdown.needsPercent > 5 && `${score.breakdown.needsPercent}%`}
                            </div>
                            <div style={{width: `${score.breakdown.wantsPercent}%`}} className="bg-amber-500 flex items-center justify-center text-xs font-bold text-white/90">
                                {score.breakdown.wantsPercent > 5 && `${score.breakdown.wantsPercent}%`}
                            </div>
                            <div style={{width: `${score.breakdown.savingsPercent}%`}} className="bg-emerald-500 flex items-center justify-center text-xs font-bold text-white/90">
                                {score.breakdown.savingsPercent > 5 && `${score.breakdown.savingsPercent}%`}
                            </div>
                        </div>
                    </div>

                    {/* Guideline */}
                    <div>
                         <div className="flex justify-between text-sm mb-2 font-bold text-slate-300">
                            <span>Guideline</span>
                        </div>
                        <div className="h-10 w-full rounded-full overflow-hidden flex opacity-60">
                            <div className="w-[50%] bg-pink-500/50 flex items-center justify-center text-xs font-bold">50%</div>
                            <div className="w-[30%] bg-amber-500/50 flex items-center justify-center text-xs font-bold">30%</div>
                            <div className="w-[20%] bg-emerald-500/50 flex items-center justify-center text-xs font-bold">20%</div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex gap-6 justify-center pt-4">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-pink-500"></div><span className="text-sm text-slate-300">Essentials & Debt</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="text-sm text-slate-300">Wants</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-sm text-slate-300">Savings</span></div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Pillars Section */}
      <div className="bg-[#0F172A] px-6 py-12">
        <div className="max-w-6xl mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Spending Card */}
                <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400">
                            <CreditCard size={32} />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(spendingStatus)}`}>
                            {spendingStatus.toUpperCase()}
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight mb-1">Spending</h3>
                    <p className="text-slate-400 text-sm mb-6">{score.spendingPoints} / 35 points</p>
                    
                    <div className="space-y-4 mb-8">
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Essential Needs & Debts</span>
                            <div className="text-2xl font-mono">€{Math.round((data.numbers.income * score.breakdown.needsPercent) / 100).toLocaleString()}/mo</div>
                            <div className="text-sm text-slate-400">{score.breakdown.needsPercent}% of income</div>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                            <p className="text-sm text-slate-300 leading-relaxed">
                                {spendingStatus === 'Excellent' 
                                 ? "Well done! You keep your essential expenses low relative to your income, giving you freedom to save." 
                                 : "Your fixed costs are quite high. Consider reviewing subscriptions or debt consolidation to free up cash flow."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Saving Card */}
                <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                            <PiggyBank size={32} />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(savingStatus)}`}>
                            {savingStatus.toUpperCase()}
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight mb-1">Saving</h3>
                    <p className="text-slate-400 text-sm mb-6">{score.savingPoints} / 35 points</p>
                    
                    <div className="space-y-4 mb-8">
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Savings</span>
                            <div className="text-2xl font-mono">€{data.numbers.monthlySavings.toLocaleString()}</div>
                            <div className="text-sm text-slate-400">{Math.round((data.numbers.monthlySavings / (data.numbers.income || 1))*100)}% of income</div>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Emergency Fund</span>
                            <div className="text-2xl font-mono">
                                {((data.numbers.cash.bank + data.numbers.cash.savings) / ((Object.values(data.numbers.expenses) as number[]).reduce((a: number, b: number) => a + b, 0) || 1)).toFixed(1)} months
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                            <p className="text-sm text-slate-300 leading-relaxed">
                                {savingStatus === 'Excellent'
                                ? "Fantastic savings habit! You have a solid emergency fund and regular contributions."
                                : "Start small with 5% savings and increase gradually. Prioritize building your emergency fund to at least 3 months."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Planning Card */}
                <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                            <BarChart3 size={32} />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(planningStatus)}`}>
                            {planningStatus.toUpperCase()}
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight mb-1">Planning</h3>
                    <p className="text-slate-400 text-sm mb-6">{score.planningPoints} / 30 points</p>
                    
                    <div className="space-y-4 mb-8">
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pension</span>
                            <div className="text-2xl font-bold">{data.numbers.hasPension ? 'Yes' : 'No'}</div>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Investments</span>
                            <div className="text-2xl font-mono">€{data.numbers.investments.toLocaleString()}</div>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Insurance Policies</span>
                            <div className="text-2xl font-mono">{data.numbers.insurancePolicies.length}</div>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                            <p className="text-sm text-slate-300 leading-relaxed">
                                {planningStatus === 'Excellent'
                                ? "You're well prepared for the future with investments and protection in place."
                                : "Consider starting a pension early and reviewing insurance to protect against the unexpected."}
                            </p>
                        </div>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default ClarityReport;
