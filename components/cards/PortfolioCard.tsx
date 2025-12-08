import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { ArrowUpRight, TrendingUp, Plus } from 'lucide-react';
import { PORTFOLIO_COMPARISON_DATA } from '../../constants';

interface Props {
  isMockDataEnabled?: boolean;
}

const PortfolioCard: React.FC<Props> = ({ isMockDataEnabled = true }) => {
  const [timeframe, setTimeframe] = useState('1M');

  if (!isMockDataEnabled) {
      return (
        <div className="bg-[#1E293B]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col h-full shadow-2xl items-center justify-center relative overflow-hidden text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-500">
                <TrendingUp size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Portfolio</h3>
            <p className="text-slate-400 text-sm max-w-xs mb-6">Your investment portfolio is currently empty. Add holdings to see your performance.</p>
            <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-xl transition-colors">
                <Plus size={16} />
                Add Position
            </button>
        </div>
      )
  }

  return (
    <div className="bg-[#1E293B]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col h-full shadow-2xl relative overflow-hidden">
      {/* Background radial gradient effect for subtle depth */}
      <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="mb-8 relative z-10">
        <h2 className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-6">Portfolio</h2>
        
        <div className="flex items-start gap-12">
            {/* Portfolio Stat */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-slate-400 text-sm font-medium">Portfolio</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-sans font-medium text-white">+5.0</span>
                    <ArrowUpRight size={20} className="text-emerald-500" />
                </div>
            </div>

            {/* S&P 500 Stat */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-600"></div>
                    <span className="text-slate-400 text-sm font-medium">S&P 500</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-sans font-medium text-white">+5.3</span>
                    <ArrowUpRight size={20} className="text-emerald-500" />
                </div>
            </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-[160px] relative z-10 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={PORTFOLIO_COMPARISON_DATA}>
            <defs>
              <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
                contentStyle={{ backgroundColor: '#1E293B', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                labelStyle={{ display: 'none' }}
                formatter={(value: number) => value.toFixed(2)}
            />
            {/* We hide axes to match the clean look of the screenshot */}
            <XAxis dataKey="name" hide />
            <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
            
            {/* S&P 500 Benchmark Line (Dashed, Yellow) */}
            <Line 
                type="monotone" 
                dataKey="sp500" 
                stroke="#CA8A04" // Yellow-600 equivalent
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={false}
                activeDot={false}
            />

            {/* Portfolio Line (Solid, Green, with Area) */}
            <Area 
                type="monotone" 
                dataKey="portfolio" 
                stroke="#10B981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorPortfolio)" 
            />
            
            {/* Current Value Dot (Custom dot at the end) */}
             <Line 
                type="monotone" 
                dataKey="portfolio" 
                stroke="none"
                dot={({ cx, cy, index, payload }) => {
                    // Only render dot for the last point
                    if (index === PORTFOLIO_COMPARISON_DATA.length - 1) {
                        return (
                            <g>
                                <circle cx={cx} cy={cy} r="6" fill="#10B981" stroke="#fff" strokeWidth="2" />
                            </g>
                        );
                    }
                    return null;
                }}
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-between items-center mt-4 px-2 relative z-10">
          {['1W', '1M', '3M', '6M', '1Y', '2Y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                    timeframe === tf 
                    ? 'bg-slate-700/80 text-white shadow-lg' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                  {tf}
              </button>
          ))}
      </div>
    </div>
  );
};

export default PortfolioCard;