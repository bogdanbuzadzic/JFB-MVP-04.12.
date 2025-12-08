
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowRight } from 'lucide-react';

const RebalancingTool: React.FC = () => {
  // Mock Data
  const current = [
    { name: 'Stocks', value: 65, color: '#3B82F6' },
    { name: 'Bonds', value: 20, color: '#F59E0B' },
    { name: 'Crypto', value: 15, color: '#EC4899' },
  ];

  const target = [
    { name: 'Stocks', value: 60, color: '#3B82F6' },
    { name: 'Bonds', value: 30, color: '#F59E0B' },
    { name: 'Crypto', value: 10, color: '#EC4899' },
  ];

  const recommendations = [
    { action: 'sell', ticker: 'BTC', amount: 5000, shares: 0.15, reason: 'Overweight (15% vs 10%)' },
    { action: 'sell', ticker: 'SPY', amount: 2000, shares: 4.5, reason: 'Slightly Overweight' },
    { action: 'buy', ticker: 'BND', amount: 7000, shares: 95, reason: 'Underweight (20% vs 30%)' },
  ];

  const renderChart = (data: any[], title: string) => (
    <div className="flex flex-col items-center">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{title}</h3>
      <div className="w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2 w-full max-w-xs">
        {data.map(d => (
          <div key={d.name} className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
              <span className="text-slate-300">{d.name}</span>
            </div>
            <span className="font-mono text-white">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#1E293B]/40 border border-white/10 rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {renderChart(current, 'Current Allocation')}
          {renderChart(target, 'Target Allocation')}
        </div>
      </div>

      <div className="bg-[#1E293B]/40 border border-white/10 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Recommended Actions</h3>
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider w-16 text-center ${
                  rec.action === 'buy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {rec.action}
                </span>
                <div>
                  <div className="font-bold text-white text-lg">{rec.ticker}</div>
                  <div className="text-xs text-slate-400">{rec.shares} shares</div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-slate-500 font-bold uppercase">Reason</div>
                  <div className="text-sm text-slate-300">{rec.reason}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 font-bold uppercase">Amount</div>
                  <div className="font-mono text-xl font-bold text-white">€{rec.amount.toLocaleString()}</div>
                </div>
                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-slate-300">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RebalancingTool;
