
import React, { useState } from 'react';
import { Search, Filter, Play } from 'lucide-react';
import { Stock, ScreenerFilter } from '../../types';
import { runScreener, getPresets } from '../../services/portfolioService';

const StockScreener: React.FC = () => {
  const [filters, setFilters] = useState<ScreenerFilter>({
    marketCapMin: undefined,
    peMax: undefined,
    pegMax: undefined,
    divYieldMin: undefined,
    roeMin: undefined,
    debtEquityMax: undefined,
  });
  const [results, setResults] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setHasRun(true);
    const data = await runScreener(filters);
    setResults(data);
    setLoading(false);
  };

  const applyPreset = (presetKey: string) => {
    const presets = getPresets();
    const preset = presets[presetKey as keyof typeof presets];
    setFilters({
      marketCapMin: undefined,
      peMax: undefined,
      pegMax: undefined,
      divYieldMin: undefined,
      roeMin: undefined,
      debtEquityMax: undefined,
      ...preset
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Presets */}
          <div className="bg-[#1E293B]/40 border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Filter size={16} /> Legendary Presets
            </h3>
            <div className="space-y-3">
              <button onClick={() => applyPreset('graham')} className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
                <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">Graham Defensive</div>
                <div className="text-xs text-slate-400 mt-1">P/E &lt;15, Low Debt, Dividends</div>
              </button>
              <button onClick={() => applyPreset('buffett')} className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
                <div className="font-bold text-white group-hover:text-blue-400 transition-colors">Buffett Quality</div>
                <div className="text-xs text-slate-400 mt-1">High ROE, Large Cap, Quality</div>
              </button>
              <button onClick={() => applyPreset('lynchStalwarts')} className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
                <div className="font-bold text-white group-hover:text-purple-400 transition-colors">Lynch Stalwarts</div>
                <div className="text-xs text-slate-400 mt-1">PEG &lt;1.5, Good Yield, Mid+ Cap</div>
              </button>
            </div>
          </div>

          {/* Custom Filters */}
          <div className="bg-[#1E293B]/40 border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Custom Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-bold block mb-1">Min Market Cap ($B)</label>
                <input 
                  type="number" 
                  value={filters.marketCapMin || ''} 
                  onChange={e => setFilters({...filters, marketCapMin: Number(e.target.value)})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. 10"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold block mb-1">Max P/E Ratio</label>
                <input 
                  type="number" 
                  value={filters.peMax || ''} 
                  onChange={e => setFilters({...filters, peMax: Number(e.target.value)})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. 20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1">Max PEG</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={filters.pegMax || ''} 
                    onChange={e => setFilters({...filters, pegMax: Number(e.target.value)})}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
                    placeholder="e.g. 1.5"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1">Min Yield %</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={filters.divYieldMin || ''} 
                    onChange={e => setFilters({...filters, divYieldMin: Number(e.target.value)})}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
                    placeholder="e.g. 2.0"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold block mb-1">Min ROE %</label>
                <input 
                  type="number" 
                  value={filters.roeMin || ''} 
                  onChange={e => setFilters({...filters, roeMin: Number(e.target.value)})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. 15"
                />
              </div>
            </div>

            <button 
              onClick={handleRun}
              className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              {loading ? 'Scanning...' : <><Play size={18} fill="currentColor" /> Run Screener</>}
            </button>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-2">
          <div className="bg-[#1E293B]/40 border border-white/10 rounded-2xl p-6 min-h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Search size={20} className="text-slate-400" />
                Results 
                <span className="text-sm bg-white/10 px-2 py-0.5 rounded-full text-slate-300">{results.length}</span>
              </h3>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 animate-pulse">
                <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                Searching database...
              </div>
            ) : !hasRun ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <div className="p-4 bg-white/5 rounded-full mb-4">
                  <Search size={40} />
                </div>
                <p>Select filters and run screener to see results</p>
              </div>
            ) : results.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <p>No stocks found matching your criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-white/5">
                      <th className="pb-3 pl-3">Ticker</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3 text-right">P/E</th>
                      <th className="pb-3 text-right">PEG</th>
                      <th className="pb-3 text-right">Yield</th>
                      <th className="pb-3 text-right">ROE</th>
                      <th className="pb-3 text-right">Debt/Eq</th>
                      <th className="pb-3"></th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {results.map((stock) => (
                      <tr key={stock.ticker} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <td className="py-3 pl-3">
                          <div className="font-bold text-emerald-400">{stock.ticker}</div>
                          <div className="text-xs text-slate-500">{stock.name}</div>
                        </td>
                        <td className="py-3 font-mono text-white">€{stock.price}</td>
                        <td className="py-3 text-right font-mono text-slate-300">{stock.pe}</td>
                        <td className={`py-3 text-right font-mono ${stock.peg < 1 ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>{stock.peg}</td>
                        <td className="py-3 text-right font-mono text-slate-300">{stock.divYield}%</td>
                        <td className="py-3 text-right font-mono text-slate-300">{stock.roe}%</td>
                        <td className="py-3 text-right font-mono text-slate-300">{stock.debtEquity}</td>
                        <td className="py-3 text-right pr-3">
                          <button className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors text-white">
                            + Add
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockScreener;
