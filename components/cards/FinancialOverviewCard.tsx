import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, PlusCircle, Calendar } from 'lucide-react';
import { CALENDAR_DAYS } from '../../constants';

interface Props {
  isMockDataEnabled?: boolean;
}

const FinancialOverviewCard: React.FC<Props> = ({ isMockDataEnabled = true }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentMonth, setCurrentMonth] = useState('November 2025');

  if (!isMockDataEnabled) {
    return (
        <div className="bg-[#1E293B]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col h-full shadow-2xl items-center justify-center text-center">
             <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-500">
                <Calendar size={32} />
             </div>
             <h3 className="text-lg font-bold text-white mb-2">Financial Overview</h3>
             <p className="text-slate-400 text-sm max-w-xs mb-6">Connect your bank accounts or manually enter transactions to see your financial calendar.</p>
             <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-xl transition-colors">
                <PlusCircle size={16} />
                Add Transaction
             </button>
        </div>
    );
  }

  return (
    <div className="bg-[#1E293B]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col h-full shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Financial Overview</h2>
        <div className="flex items-center gap-2 bg-slate-800/80 rounded-lg px-3 py-1.5 border border-white/5">
          <ChevronLeft size={16} className="text-slate-400 cursor-pointer hover:text-white" />
          <span className="text-sm font-semibold text-white">{currentMonth}</span>
          <ChevronRight size={16} className="text-slate-400 cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* Calendar Header */}
      <div className="grid grid-cols-7 mb-2 text-center">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
          <div key={d} className="text-[10px] font-bold text-slate-500 tracking-wider">{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 mb-6 flex-1">
        {CALENDAR_DAYS.map((day) => (
          <div 
            key={day.day}
            className={`
              relative flex flex-col items-center justify-between py-2 rounded-xl min-h-[80px] border
              ${day.isToday 
                ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'}
              ${day.isPast ? 'opacity-60' : 'opacity-100'}
            `}
          >
            {/* Date Number */}
            <span className={`text-xs font-medium ${day.isToday ? 'text-emerald-400' : 'text-slate-400'}`}>
              {day.day}
            </span>
            {day.isToday && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}

            {/* Transactions Icons & Amounts */}
            <div className="flex flex-col gap-1 items-center justify-center flex-1 w-full">
              {day.transactions.map((tx) => (
                 <div key={tx.id} className="relative group flex flex-col items-center">
                    <span className="text-lg filter drop-shadow-md">{tx.emoji}</span>
                    {tx.amount && (
                      <span className="text-[9px] font-bold text-slate-400 -mt-0.5 whitespace-nowrap">
                        -€{tx.amount}
                      </span>
                    )}
                 </div>
              ))}
            </div>

            {/* Daily Total */}
            {day.dailyTotal && (
              <span className={`text-[10px] font-bold ${day.dailyTotal > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {day.dailyTotal > 0 ? '+' : '-'}{'€'}{Math.abs(day.dailyTotal)}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-y-3 pt-4 border-t border-white/10">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 mb-1">Income</span>
          <span className="text-lg font-bold text-emerald-400">+€5,000</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-slate-400 mb-1">Expenses</span>
          <span className="text-lg font-bold text-red-400">-€3,200</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 mb-1">Savings</span>
          <span className="text-lg font-bold text-orange-400">+€800</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-slate-400 mb-1">Net Flow</span>
          <span className="text-lg font-bold text-emerald-400">+€1,800</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverviewCard;