import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Trash2, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { PortfolioHolding } from '../../types';
import { getHoldings, saveHolding, removeHolding } from '../../services/portfolioService';

interface Props {
  initialShowAddForm?: boolean;
  isMockDataEnabled?: boolean;
}

const PortfolioOverview: React.FC<Props> = ({ initialShowAddForm = false, isMockDataEnabled = true }) => {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [showAddForm, setShowAddForm] = useState(initialShowAddForm);
  
  // Add Holding Form State
  const [ticker, setTicker] = useState('');
  const [assetType, setAssetType] = useState<PortfolioHolding['assetType']>('Stock');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [shares, setShares] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [currPrice, setCurrPrice] = useState('');

  const loadData = async () => {
      const data = await getHoldings(isMockDataEnabled);
      const processed = data.map(h => ({
        ...h,
        gain: (h.currentPrice - h.purchasePrice) * h.shares,
        gainPercent: h.purchasePrice > 0 ? ((h.currentPrice - h.purchasePrice) / h.purchasePrice) * 100 : 0,
        value: h.shares * h.currentPrice
      }));
      setHoldings(processed);
  };

  useEffect(() => {
    loadData();
  }, [isMockDataEnabled]); // Reload when toggle changes

  useEffect(() => {
    setShowAddForm(initialShowAddForm);
  }, [initialShowAddForm]);

  const handleAddHolding = async () => {
    if (!ticker || !shares || !buyPrice || !currPrice) return;

    const newHolding: PortfolioHolding = {
        id: Math.random().toString(),
        ticker: ticker.toUpperCase(),
        name: ticker.toUpperCase(), // Simple placeholder
        assetType,
        shares: Number(shares),
        purchasePrice: Number(buyPrice),
        currentPrice: Number(currPrice),
        gain: (Number(currPrice) - Number(buyPrice)) * Number(shares),
        gainPercent: ((Number(currPrice) - Number(buyPrice)) / Number(buyPrice)) * 100,
    };

    await saveHolding(newHolding);
    await loadData();
    
    // Reset form and hide
    setTicker('');
    setShares('');
    setBuyPrice('');
    setCurrPrice('');
    setShowAddForm(false);
  };

  const deleteHolding = async (id: string) => {
    await removeHolding(id);
    await loadData();
  };

  // Stats
  const totalValue = holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);
  const totalCost = holdings.reduce((sum, h) => sum + (h.shares * h.purchasePrice), 0);
  const totalGain = totalValue - totalCost;
  const returnPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  // Mock Chart Data relative to current value for visualization
  // If no holdings, empty chart
  const chartData = holdings.length > 0 ? [
    { name: 'Jan', value: totalValue * 0.8 },
    { name: 'Feb', value: totalValue * 0.82 },
    { name: 'Mar', value: totalValue * 0.85 },
    { name: 'Apr', value: totalValue * 0.83 },
    { name: 'May', value: totalValue * 0.9 },
    { name: 'Jun', value: totalValue * 0.89 },
    { name: 'Jul', value: totalValue * 0.88 },
    { name: 'Aug', value: totalValue * 0.92 },
    { name: 'Sep', value: totalValue * 0.95 },
    { name: 'Oct', value: totalValue * 0.98 },
    { name: 'Now', value: totalValue },
  ] : [];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1E293B] border border-white/10 rounded-xl p-5 shadow-lg">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">TOTAL VALUE</div>
            <div className="text-3xl font-mono font-bold text-white">
                €{totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
        </div>
        <div className="bg-[#1E293B] border border-white/10 rounded-xl p-5 shadow-lg">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">TOTAL GAIN</div>
            <div className={`text-3xl font-mono font-bold ${totalGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {totalGain >= 0 ? '+' : '-'}€{Math.abs(totalGain).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
        </div>
        <div className="bg-[#1E293B] border border-white/10 rounded-xl p-5 shadow-lg">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">RETURN</div>
            <div className={`text-3xl font-mono font-bold ${returnPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {returnPercent.toFixed(2)}%
            </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-[#1E293B] border border-white/10 rounded-xl p-4 h-56 shadow-lg relative overflow-hidden flex items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
        {holdings.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10}} dy={10} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(val: number) => [`€${val.toLocaleString()}`, 'Value']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
            </ResponsiveContainer>
        ) : (
            <div className="text-slate-500 text-sm">Add holdings to see performance chart</div>
        )}
      </div>

      {/* Add Holding Toggle */}
      <div className="flex justify-end">
        {!showAddForm && (
            <button 
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
            >
                <Plus size={16} /> Add Position
            </button>
        )}
      </div>

      {/* Add Holding Form */}
      {showAddForm && (
        <div className="bg-[#1E293B] border border-white/10 rounded-xl p-6 shadow-lg animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">ADD NEW HOLDING</h3>
                <button onClick={() => setShowAddForm(false)} className="text-slate-500 hover:text-white"><X size={16}/></button>
            </div>
            
            <div className="grid grid-cols-12 gap-3 mb-4">
                <div className="col-span-4 md:col-span-3">
                    <label className="text-[10px] text-slate-500 font-bold mb-1 block">TICKER</label>
                    <input 
                        type="text" 
                        placeholder="AAPL" 
                        value={ticker}
                        onChange={e => setTicker(e.target.value.toUpperCase())}
                        className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500 placeholder-slate-600 font-bold"
                    />
                </div>
                <div className="col-span-4 md:col-span-3">
                    <label className="text-[10px] text-slate-500 font-bold mb-1 block">ASSET TYPE</label>
                    <select 
                        value={assetType}
                        onChange={e => setAssetType(e.target.value as any)}
                        className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500"
                    >
                        <option>Stock</option>
                        <option>ETF</option>
                        <option>Crypto</option>
                    </select>
                </div>
                <div className="col-span-4 md:col-span-3">
                    <label className="text-[10px] text-slate-500 font-bold mb-1 block">DATE</label>
                    <input 
                        type="text" 
                        placeholder="YYYY-MM-DD" 
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500 placeholder-slate-600"
                    />
                </div>
                <div className="hidden md:block col-span-3"></div> 
                
                <div className="col-span-4 md:col-span-3">
                    <label className="text-[10px] text-slate-500 font-bold mb-1 block">SHARES</label>
                    <input 
                        type="number" 
                        placeholder="0" 
                        value={shares}
                        onChange={e => setShares(e.target.value)}
                        className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500 placeholder-slate-600"
                    />
                </div>
                <div className="col-span-4 md:col-span-3">
                    <label className="text-[10px] text-slate-500 font-bold mb-1 block">BUY PRICE</label>
                    <input 
                        type="number" 
                        placeholder="0.00" 
                        value={buyPrice}
                        onChange={e => setBuyPrice(e.target.value)}
                        className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500 placeholder-slate-600"
                    />
                </div>
                <div className="col-span-4 md:col-span-3">
                    <label className="text-[10px] text-slate-500 font-bold mb-1 block">CURR PRICE</label>
                    <input 
                        type="number" 
                        placeholder="0.00" 
                        value={currPrice}
                        onChange={e => setCurrPrice(e.target.value)}
                        className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500 placeholder-slate-600"
                    />
                </div>
                <div className="col-span-12 md:col-span-3 flex items-end">
                    <button 
                        onClick={handleAddHolding}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-lg text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                        Add to Portfolio
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Holdings List */}
      <div className="overflow-x-auto rounded-lg border border-white/5">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#0F172A] text-slate-400 text-[10px] uppercase tracking-wider font-bold border-b border-white/10">
                        <th className="px-4 py-3">Ticker</th>
                        <th className="px-4 py-3">Asset</th>
                        <th className="px-4 py-3 text-right">Shares</th>
                        <th className="px-4 py-3 text-right">Price</th>
                        <th className="px-4 py-3 text-right">Value</th>
                        <th className="px-4 py-3 text-right">Gain</th>
                        <th className="px-4 py-3 text-right"></th>
                    </tr>
                </thead>
                <tbody className="text-sm bg-[#0F172A]/50">
                    {holdings.map(h => (
                        <tr key={h.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                            <td className="px-4 py-3 font-bold text-white">{h.ticker}</td>
                            <td className="px-4 py-3 text-slate-400 text-xs">
                                <span className="bg-white/10 px-2 py-0.5 rounded text-slate-300">{h.assetType}</span>
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-slate-300">{h.shares}</td>
                            <td className="px-4 py-3 text-right font-mono text-slate-300">€{h.currentPrice.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right font-mono font-bold text-white">€{(h.shares * h.currentPrice).toLocaleString()}</td>
                            <td className={`px-4 py-3 text-right font-mono font-bold ${(h.gain || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {Math.round(h.gainPercent || 0)}%
                            </td>
                            <td className="px-4 py-3 text-right">
                                <button onClick={() => deleteHolding(h.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={14} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {holdings.length === 0 && (
                        <tr>
                            <td colSpan={7} className="text-center py-8 text-slate-500 text-sm">
                                {isMockDataEnabled 
                                    ? "No holdings yet. Add one to start tracking." 
                                    : "Portfolio empty. Add positions to track your investments."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
      </div>
    </div>
  );
};

export default PortfolioOverview;