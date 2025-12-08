
import React, { useState } from 'react';
import { X, RefreshCcw, ChevronsUp, ChevronsDown } from 'lucide-react';
import { TetrisBlock, TetrisGoal } from '../../types';

interface Props {
  blocks: TetrisBlock[];
  goals: TetrisGoal[];
  initialPrincipal?: number; 
  initialSavings?: number;
  initialInvestments?: number;
  monthlyContribution?: number; 
  onClose: () => void;
}

const SimulationView: React.FC<Props> = ({ 
    blocks, 
    goals, 
    initialPrincipal = 0, 
    initialSavings = 0,
    initialInvestments = 0,
    monthlyContribution = 0, 
    onClose 
}) => {
  const [simulationPeriod, setSimulationPeriod] = useState(17);
  const [additionalMonthly, setAdditionalMonthly] = useState(monthlyContribution);
  const [bullRate, setBullRate] = useState(15);
  const [baseRate, setBaseRate] = useState(10);
  const [bearRate, setBearRate] = useState(5);

  const flowBlocksAmount = blocks
      .filter(b => (b.type === 'savings' || b.type === 'investment') && !b.isAsset)
      .reduce((sum, b) => sum + b.amount, 0);

  const totalMonthlyPmt = flowBlocksAmount + Number(additionalMonthly);

  const processScenario = (rate: number) => {
    const monthlyRate = rate / 100 / 12;
    const months = simulationPeriod * 12;

    // 1. Principal Growth
    const fvPrincipal = initialPrincipal * Math.pow(1 + monthlyRate, months);

    // 2. Contribution Growth
    let fvContributions = 0;
    if (monthlyRate === 0) {
        fvContributions = totalMonthlyPmt * months;
    } else {
        fvContributions = totalMonthlyPmt * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }

    const projectedValue = fvPrincipal + fvContributions;
    const growth = projectedValue - initialPrincipal;

    return {
      projectedValue,
      growth,
      goals: goals.map(goal => {
        // Impact % = How much of the Future Net Worth is this goal?
        const impact = projectedValue > 0 ? (goal.targetAmount / projectedValue) * 100 : 0;
        return {
          ...goal,
          impact
        };
      })
    };
  };

  const scenarios = {
    bull: processScenario(bullRate),
    base: processScenario(baseRate),
    bear: processScenario(bearRate)
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#0F172A] text-white overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-300">
      
      {/* HEADER CONTROLS */}
      <div className="bg-[#0B1221] border-b border-white/10 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative z-10">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-2 text-xs font-bold tracking-[0.3em] text-slate-500 uppercase">Simulation Mode</div>
         <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>

         {/* Left: Period Slider */}
         <div className="flex-1 max-w-md w-full mt-6 md:mt-0">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 tracking-wider">
                <span>SIMULATION PERIOD</span>
                <span className="text-white text-lg font-mono">{simulationPeriod} <span className="text-xs text-slate-500">YEARS</span></span>
            </div>
            <input 
                type="range" 
                min="1" max="40" 
                value={simulationPeriod} 
                onChange={e => setSimulationPeriod(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-white hover:accent-emerald-400 transition-all"
            />
         </div>

         {/* Center: Contribution */}
         <div className="flex flex-col w-48">
            <label className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Monthly Contribution</label>
            <div className="bg-[#1E293B] border border-white/10 rounded-lg flex items-center px-3 py-2">
                <span className="text-slate-400 mr-2 text-sm">$</span>
                <input 
                    type="number" 
                    value={additionalMonthly} 
                    onChange={e => setAdditionalMonthly(Number(e.target.value))}
                    className="bg-transparent w-full text-white font-mono font-bold outline-none"
                />
                <div className="flex flex-col ml-2 opacity-50">
                    <ChevronsUp size={10} className="cursor-pointer hover:text-white" onClick={() => setAdditionalMonthly(p => p + 50)}/>
                    <ChevronsDown size={10} className="cursor-pointer hover:text-white" onClick={() => setAdditionalMonthly(p => Math.max(0, p - 50))}/>
                </div>
            </div>
         </div>

         {/* Right: Rates */}
         <div className="flex gap-3">
            {[
                { label: 'BULL (+15%)', val: bullRate, set: setBullRate, color: 'text-emerald-400' },
                { label: 'BASE (+10%)', val: baseRate, set: setBaseRate, color: 'text-blue-400' },
                { label: 'BEAR (+5%)', val: bearRate, set: setBearRate, color: 'text-red-400' }
            ].map((rate, i) => (
                <div key={i} className="flex flex-col w-24">
                    <label className={`text-[10px] font-bold ${rate.color} mb-1 uppercase tracking-wider`}>{rate.label}</label>
                    <div className="bg-[#1E293B] border border-white/10 rounded-lg flex items-center px-2 py-2">
                        <input 
                            type="number" 
                            value={rate.val} 
                            onChange={e => rate.set(Number(e.target.value))}
                            className="bg-transparent w-full text-white font-mono font-bold text-center outline-none"
                        />
                        <div className="flex flex-col ml-1 opacity-50">
                            <ChevronsUp size={8} className="cursor-pointer hover:text-white" onClick={() => rate.set(p => p + 1)}/>
                            <ChevronsDown size={8} className="cursor-pointer hover:text-white" onClick={() => rate.set(p => Math.max(0, p - 1))}/>
                        </div>
                    </div>
                </div>
            ))}
            <div className="flex flex-col justify-end">
                <button 
                    onClick={() => { setBullRate(15); setBaseRate(10); setBearRate(5); }}
                    className="h-[38px] w-[38px] flex items-center justify-center bg-[#1E293B] border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-slate-400"
                >
                    <RefreshCcw size={14} />
                </button>
            </div>
         </div>
      </div>

      {/* CONTENT: SCENARIO CARDS */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
         <div className="max-w-7xl mx-auto space-y-8">
            <ScenarioCard 
                label="BULL CASE" 
                sub="+15% RETURN" 
                data={scenarios.bull} 
                initial={initialPrincipal}
                theme="bull"
            />
            <ScenarioCard 
                label="BASE CASE" 
                sub="+10% RETURN" 
                data={scenarios.base} 
                initial={initialPrincipal}
                theme="base"
            />
            <ScenarioCard 
                label="BEAR CASE" 
                sub="+5% RETURN" 
                data={scenarios.bear} 
                initial={initialPrincipal}
                theme="bear"
            />
         </div>
      </div>
    </div>
  );
};

const ScenarioCard: React.FC<{ 
    label: string, 
    sub: string, 
    data: any, 
    initial: number,
    theme: 'bull' | 'base' | 'bear' 
}> = ({ label, sub, data, initial, theme }) => {
    
    // Theme Colors
    const colors = {
        bull: { 
            text: 'text-emerald-400', 
            bar: 'bg-emerald-500',
            bg: 'bg-emerald-900/20',
            hex: '#10B981',
            glow: 'shadow-emerald-500/10'
        },
        base: { 
            text: 'text-blue-400', 
            bar: 'bg-blue-500', 
            bg: 'bg-blue-900/20',
            hex: '#3B82F6',
            glow: 'shadow-blue-500/10'
        },
        bear: { 
            text: 'text-red-400', 
            bar: 'bg-red-500',
            bg: 'bg-red-900/20',
            hex: '#EF4444',
            glow: 'shadow-red-500/10'
        }
    };
    const c = colors[theme];

    // Scale Logic
    const maxValue = Math.max(initial, data.projectedValue) * 1.3; 
    const presentHeightPercent = maxValue > 0 ? Math.max(5, (initial / maxValue) * 100) : 0; 
    const futureHeightPercent = maxValue > 0 ? Math.max(5, (data.projectedValue / maxValue) * 100) : 0;
    
    return (
        <div className={`bg-[#0B1221] border border-white/5 rounded-3xl p-0 grid grid-cols-1 lg:grid-cols-2 overflow-hidden shadow-2xl ${c.glow} transition-all duration-500 hover:border-white/10 group`}>
            
            {/* LEFT SIDE: NET WORTH PROJECTION */}
            <div className="p-8 relative border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between min-h-[300px]">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-2xl font-bold tracking-tight ${c.text}`}>{label}</h3>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 ${c.text}`}>{sub}</span>
                    </div>

                    <div className="mt-4">
                        <div className="text-5xl font-mono font-bold text-white mb-2 tracking-tight drop-shadow-lg">
                            ${Math.round(data.projectedValue).toLocaleString()}
                        </div>
                        <div className={`text-sm font-mono font-bold ${data.growth >= 0 ? 'text-emerald-400' : 'text-red-400'} flex items-center gap-2`}>
                            <span>{data.growth >= 0 ? '+' : ''}${Math.round(data.growth).toLocaleString()}</span>
                            <span className="opacity-60 text-xs text-slate-400">({initial > 0 ? Math.round((data.growth / initial) * 100) : 0}%)</span>
                        </div>
                    </div>
                </div>

                {/* Timeline Visualization */}
                <div className="flex-1 relative mt-8 flex items-end justify-between px-[10%]">
                    {/* SVG Connecting Line */}
                    <div className="absolute inset-0 w-full h-full z-0 overflow-visible pointer-events-none">
                        <svg width="100%" height="100%" style={{overflow: 'visible'}}>
                             <defs>
                                <marker id={`arrow-${theme}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                                    <path d="M 0 0 L 10 5 L 0 10 z" fill={c.hex} />
                                </marker>
                            </defs>
                            <line 
                                x1="25%" 
                                y1={`${100 - presentHeightPercent}%`} 
                                x2="75%" 
                                y2={`${100 - futureHeightPercent}%`} 
                                stroke={c.hex} 
                                strokeWidth="2" 
                                strokeDasharray="6 4"
                                opacity="0.4"
                                markerEnd={`url(#arrow-${theme})`}
                            />
                             <circle cx="25%" cy={`${100 - presentHeightPercent}%`} r="3" fill="#334155" />
                             <circle cx="75%" cy={`${100 - futureHeightPercent}%`} r="3" fill={c.hex} />
                        </svg>
                    </div>

                    {/* Present Block */}
                    <div className="flex flex-col items-center gap-2 w-24 relative justify-end h-full z-10">
                        <div className="text-center mb-1">
                            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Present</div>
                            <div className="text-xs font-mono font-bold text-white opacity-70">${Math.round(initial / 1000)}k</div>
                        </div>
                        <div 
                            style={{ height: `${presentHeightPercent}%` }}
                            className="w-16 bg-[#1E293B] border border-slate-600 rounded-t-lg relative shadow-lg overflow-hidden"
                        ></div>
                    </div>

                    {/* Future Block */}
                    <div className="flex flex-col items-center gap-2 w-24 relative justify-end h-full z-10">
                        <div className="text-center mb-1">
                            <div className={`text-[10px] uppercase font-bold tracking-wider ${c.text}`}>Future</div>
                        </div>
                        <div 
                            style={{ height: `${futureHeightPercent}%` }}
                            className={`w-16 ${c.bar} opacity-90 rounded-t-lg relative shadow-lg shadow-${theme}-500/20`}
                        >
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/40"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: GOAL IMPACT */}
            <div className="p-8 bg-[#0B1221] flex flex-col">
                <div className="flex justify-between items-start mb-10">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Goal Impact</h4>
                    <span className="text-[10px] text-slate-600 font-mono tracking-widest italic">Bar height relative to net worth</span>
                </div>

                <div className="flex-1 flex items-end justify-around pb-4 min-h-[200px]">
                    {data.goals.length === 0 ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
                            <div className="p-4 rounded-full bg-white/5"><ChevronsUp size={24} className="opacity-50"/></div>
                            <div className="text-xs italic">No goals defined</div>
                        </div>
                    ) : (
                        data.goals.map((goal: any, i: number) => {
                            // Ensure percentage is capped visually but displayed accurately text-wise
                            const visualPercent = Math.min(100, goal.impact);
                            
                            return (
                                <div key={i} className="flex flex-col justify-end items-center gap-2 w-20 group h-full">
                                    {/* Percentage Label */}
                                    <div className={`text-sm font-bold font-mono ${c.text} mb-1 opacity-90 group-hover:opacity-100 transition-opacity`}>
                                        {goal.impact.toFixed(1)}%
                                    </div>
                                    
                                    {/* Bar Container */}
                                    <div className="w-12 h-full flex items-end justify-center bg-white/[0.02] rounded-t-lg overflow-hidden relative">
                                        <div 
                                            style={{height: `${visualPercent}%`}}
                                            className={`w-full ${c.bar} opacity-70 group-hover:opacity-100 transition-all duration-300 relative rounded-t-md`}
                                        ></div>
                                    </div>

                                    {/* Label Bottom */}
                                    <div className="text-center w-full pt-2">
                                        <div className="text-[10px] font-bold text-white leading-tight mb-0.5 truncate px-1">{goal.name}</div>
                                        <div className="text-[9px] text-slate-500 font-mono">${(goal.targetAmount/1000).toFixed(0)}k</div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

        </div>
    );
};

export default SimulationView;
