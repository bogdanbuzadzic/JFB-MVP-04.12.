
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle } from 'lucide-react';

const PortfolioXRay: React.FC = () => {
  // Mock Data
  const allocation = [
    { name: 'Stocks', value: 65, color: '#3B82F6' },
    { name: 'Bonds', value: 20, color: '#F59E0B' },
    { name: 'Cash', value: 10, color: '#10B981' },
    { name: 'Crypto', value: 5, color: '#EC4899' },
  ];

  const sectors = [
    { name: 'Technology', percent: 42, color: '#60A5FA' },
    { name: 'Healthcare', percent: 18, color: '#F472B6' },
    { name: 'Financials', percent: 15, color: '#A78BFA' },
    { name: 'Consumer Cyclical', percent: 12, color: '#FBBF24' },
    { name: 'Energy', percent: 8, color: '#34D399' },
    { name: 'Other', percent: 5, color: '#94A3B8' },
  ];

  const overlaps = [
    { id: 1, etf1: 'VOO', etf2: 'VTI', percent: 84, commonStocks: ['AAPL', 'MSFT', 'AMZN', 'NVDA'] },
    { id: 2, etf1: 'QQQ', etf2: 'VGT', percent: 62, commonStocks: ['AAPL', 'MSFT', 'NVDA'] },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Asset Allocation */}
        <div className="bg-[#1E293B]/40 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">True Asset Allocation</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocation}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }} itemStyle={{ color: '#fff' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 flex-1 w-full">
              {allocation.map(a => (
                <div key={a.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: a.color }}></div>
                    <span className="text-slate-300 font-medium">{a.name}</span>
                  </div>
                  <span className="font-mono font-bold text-white">{a.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sector Exposure */}
        <div className="bg-[#1E293B]/40 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Sector Exposure</h3>
          <div className="space-y-4">
            {sectors.map(sector => (
              <div key={sector.name}>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-slate-300">{sector.name}</span>
                  <span className={`font-mono font-bold ${sector.percent > 30 ? 'text-orange-400' : 'text-white'}`}>
                    {sector.percent}%
                    {sector.percent > 30 && <span className="ml-2 text-xs opacity-70">⚠️ High</span>}
                  </span>
                </div>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${sector.percent}%`, backgroundColor: sector.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ETF Overlap */}
      <div className="bg-[#1E293B]/40 border border-white/10 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <AlertTriangle size={16} className="text-yellow-500" /> ETF Overlap Detection
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {overlaps.map(overlap => (
            <div key={overlap.id} className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold text-white text-lg">
                  {overlap.etf1} <span className="text-slate-500 mx-1">&</span> {overlap.etf2}
                </div>
                <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-lg font-bold text-sm">
                  {overlap.percent}% Overlap
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                Common holdings include: <span className="text-slate-300">{overlap.commonStocks.join(', ')}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioXRay;
