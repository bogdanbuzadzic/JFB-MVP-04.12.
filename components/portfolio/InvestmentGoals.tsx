
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const InvestmentGoals: React.FC = () => {
  const [target, setTarget] = useState(100000);
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);

  const calculateProjection = () => {
    let balance = initial;
    const monthlyRate = rate / 100 / 12;
    const data = [];
    let totalContribution = initial;

    for (let i = 0; i <= years; i++) {
      data.push({
        year: `Year ${i}`,
        balance: Math.round(balance),
        contribution: Math.round(totalContribution)
      });

      // Advance 12 months
      for (let m = 0; m < 12; m++) {
        balance += monthly;
        balance *= (1 + monthlyRate);
        totalContribution += monthly;
      }
    }
    return data;
  };

  const data = calculateProjection();
  const finalBalance = data[data.length - 1].balance;
  const isTargetMet = finalBalance >= target;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-1 bg-[#1E293B]/40 border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Goal Parameters</h3>
          
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Target Amount (€)</label>
            <input type="number" value={target} onChange={e => setTarget(Number(e.target.value))} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Initial Investment (€)</label>
            <input type="number" value={initial} onChange={e => setInitial(Number(e.target.value))} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Monthly Contribution (€)</label>
            <input type="number" value={monthly} onChange={e => setMonthly(Number(e.target.value))} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Expected Return (%)</label>
            <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Time Horizon (Years)</label>
            <input type="range" min="1" max="30" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full accent-emerald-500" />
            <div className="text-right text-sm text-slate-300">{years} years</div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 bg-[#1E293B]/40 border border-white/10 rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Projection</h3>
              <div className={`text-3xl font-bold font-mono mt-1 ${isTargetMet ? 'text-emerald-400' : 'text-slate-200'}`}>
                €{finalBalance.toLocaleString()}
              </div>
              <div className="text-sm text-slate-400 mt-1">
                {isTargetMet ? 'Target reached! 🎉' : `Short by €${(target - finalBalance).toLocaleString()}`}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-500 uppercase">Total Contribution</div>
              <div className="text-xl font-bold font-mono text-white">€{data[data.length - 1].contribution.toLocaleString()}</div>
              <div className="text-xs font-bold text-slate-500 uppercase mt-2">Investment Growth</div>
              <div className="text-xl font-bold font-mono text-emerald-400">+€{(finalBalance - data[data.length - 1].contribution).toLocaleString()}</div>
            </div>
          </div>

          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="year" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} tickFormatter={(value) => `€${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`€${value.toLocaleString()}`, 'Balance']}
                />
                <Line type="monotone" dataKey="balance" stroke="#10B981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="contribution" stroke="#64748B" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentGoals;
