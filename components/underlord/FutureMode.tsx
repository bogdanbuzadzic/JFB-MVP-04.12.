
import React, { useState } from 'react';
import { TetrisGoal } from '../../types';

interface Props {
  monthlyContribution: number;
  initialCash: number;
  initialPortfolio: number;
  goals: TetrisGoal[];
  scenario: 'bull' | 'base' | 'bear';
  onScenarioChange: (s: 'bull' | 'base' | 'bear') => void;
}

// Improved Path Generator for horizontal tangents (Sankey-style)
const generateFlowPath = (points: {x: number, y: number}[]) => {
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const mx = (p0.x + p1.x) / 2;
        d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
};

const FutureMode: React.FC<Props> = ({ 
  monthlyContribution, initialCash, initialPortfolio, goals, scenario, onScenarioChange 
}) => {
  const [showGoals, setShowGoals] = useState(true);

  // --- Calculations ---
  const annualRate = scenario === 'bull' ? 0.15 : scenario === 'base' ? 0.10 : 0.05;
  const monthlySavingsFlow = monthlyContribution * 0.5;
  const monthlyInvestFlow = monthlyContribution * 0.5;

  const calcValues = (years: number) => {
      const months = years * 12;
      const monthlyRate = annualRate / 12;

      const sav = initialCash + (monthlySavingsFlow * months);
      
      let inv = 0;
      if (monthlyRate === 0) {
          inv = initialPortfolio + (monthlyInvestFlow * months);
      } else {
          // FV of Principal + FV of Series
          const fvPrin = initialPortfolio * Math.pow(1 + monthlyRate, months);
          const fvSer = monthlyInvestFlow * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
          inv = fvPrin + fvSer;
      }
      return { sav, inv };
  };

  const val1y = calcValues(1);
  const val5y = calcValues(5);
  const val10y = calcValues(10);

  // --- SVG Layout ---
  const WIDTH = 1400;
  const HEIGHT = 600;
  
  const START_X = 50;
  const START_WIDTH = 240; 
  const X_1Y = 500;
  const X_5Y = 900;
  const X_10Y = 1300;

  const CENTER_Y = HEIGHT / 2;

  // Scale: Max height fits in container
  const maxTotal = val10y.sav + val10y.inv;
  const scale = (HEIGHT * 0.65) / (maxTotal || 1000); 

  const getCoords = (savVal: number, invVal: number, x: number) => {
      const hSav = savVal * scale;
      const hInv = invVal * scale;
      const totalH = hSav + hInv;
      
      const topY = CENTER_Y - (totalH / 2);
      const midY = topY + hSav; 
      const botY = midY + hInv;
      
      return { topY, midY, botY, x, hSav, hInv };
  };

  const start = getCoords(Math.max(500, initialCash), Math.max(500, initialPortfolio), START_X + START_WIDTH); 
  // Start flow from the right edge of the "Present" block
  const p1y = getCoords(val1y.sav, val1y.inv, X_1Y);
  const p5y = getCoords(val5y.sav, val5y.inv, X_5Y);
  const p10y = getCoords(val10y.sav, val10y.inv, X_10Y);

  // --- Path Generation ---
  // We need continuous paths for Top Edge, Mid Edge, and Bottom Edge
  const topPoints = [{x: start.x, y: start.topY}, {x: p1y.x, y: p1y.topY}, {x: p5y.x, y: p5y.topY}, {x: p10y.x, y: p10y.topY}];
  const midPoints = [{x: start.x, y: start.midY}, {x: p1y.x, y: p1y.midY}, {x: p5y.x, y: p5y.midY}, {x: p10y.x, y: p10y.midY}];
  const botPoints = [{x: start.x, y: start.botY}, {x: p1y.x, y: p1y.botY}, {x: p5y.x, y: p5y.botY}, {x: p10y.x, y: p10y.botY}];

  const topPath = generateFlowPath(topPoints);
  const midPath = generateFlowPath(midPoints);
  const botPath = generateFlowPath(botPoints);

  // Reverse paths for closing shapes
  const reversePoints = (pts: {x:number, y:number}[]) => [...pts].reverse();
  const midPathRev = generateFlowPath(reversePoints(midPoints));
  const botPathRev = generateFlowPath(reversePoints(botPoints));

  // Combined Shapes
  const savingsShape = `${topPath} L ${p10y.x} ${p10y.midY} ${midPathRev.replace('M', 'L')} L ${start.x} ${start.topY} Z`;
  const investShape = `${midPath} L ${p10y.x} ${p10y.botY} ${botPathRev.replace('M', 'L')} L ${start.x} ${start.midY} Z`;

  // Hatched Pattern for Goals
  const HatchPattern = () => (
      <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="8" transform="translate(0,0)" fill="rgba(255,255,255,0.3)" />
      </pattern>
  );

  return (
    <div className="w-full h-full relative">
        {/* Controls */}
        <div className="absolute top-4 left-4 z-20 flex gap-4">
            <div className="bg-black/30 backdrop-blur-md p-1 rounded-xl border border-white/10 flex">
                {(['bear', 'base', 'bull'] as const).map(s => (
                    <button
                        key={s}
                        onClick={() => onScenarioChange(s)}
                        className={`px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                            scenario === s 
                            ? 'bg-blue-500 text-white shadow-lg' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        {s} {s === 'bull' ? '15%' : s === 'base' ? '10%' : '5%'}
                    </button>
                ))}
            </div>
            <button 
                onClick={() => setShowGoals(!showGoals)}
                className={`px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest border border-white/10 transition-all ${
                    showGoals ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' : 'bg-black/30 text-slate-400'
                }`}
            >
                {showGoals ? 'Hide Goals' : 'Show Goals'}
            </button>
        </div>

        <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="overflow-visible">
            <defs>
                <HatchPattern />
                {/* Present Mode Matching Fill */}
                <linearGradient id="netWorthFill" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#064E3B" /> {/* Dark Emerald */}
                    <stop offset="100%" stopColor="#10B981" /> {/* Emerald */}
                </linearGradient>

                {/* Flow Gradients */}
                <linearGradient id="savGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} /> 
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.9} />
                </linearGradient>
                <linearGradient id="invGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} /> 
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.9} />
                </linearGradient>
            </defs>

            {/* Timeline Markers */}
            {[X_1Y, X_5Y, X_10Y].map((x, i) => (
                <g key={i} className="opacity-20">
                    <line x1={x} y1={50} x2={x} y2={HEIGHT - 50} stroke="white" strokeWidth="1" strokeDasharray="4 4" />
                    <text x={x} y={40} textAnchor="middle" fill="#FFF" fontSize="12" fontWeight="bold" letterSpacing="2">
                        {i === 0 ? '1 YEAR' : i === 1 ? '5 YEARS' : '10 YEARS'}
                    </text>
                </g>
            ))}

            {/* Start Block (Present) - Rectangular & Connected */}
            <g className="filter drop-shadow-2xl">
                <rect 
                    x={START_X} 
                    y={start.topY} 
                    width={START_WIDTH} 
                    height={start.botY - start.topY} 
                    rx={4} 
                    fill="url(#netWorthFill)" 
                    className="stroke-white/10 stroke-1"
                />
                {/* Accent Line */}
                <rect 
                    x={START_X - 6} 
                    y={start.topY + 10} 
                    width={6} 
                    height={(start.botY - start.topY) - 20} 
                    rx={2} 
                    fill="#10B981" 
                />
                
                <text x={START_X + START_WIDTH/2} y={CENTER_Y - 25} textAnchor="middle" fill="#FFF" fontSize="16" fontWeight="bold" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                    Current Net Worth
                </text>
                <text x={START_X + START_WIDTH/2} y={CENTER_Y + 15} textAnchor="middle" fill="#FFF" fontSize="28" fontFamily="monospace" fontWeight="bold" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                    €{(initialCash + initialPortfolio).toLocaleString()}
                </text>
                <text x={START_X + START_WIDTH/2} y={CENTER_Y + 45} textAnchor="middle" fill="#A7F3D0" fontSize="12" fontWeight="bold" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                    + €{monthlyContribution.toLocaleString()}/mo
                </text>
            </g>

            {/* Continuous Flow Paths */}
            <g>
                <path d={savingsShape} fill="url(#savGrad)" className="transition-all duration-700 ease-in-out" />
                <path d={investShape} fill="url(#invGrad)" className="transition-all duration-700 ease-in-out" />
            </g>

            {/* Data Points (Overlays) */}
            {[
                { x: X_1Y, y: p1y, val: val1y },
                { x: X_5Y, y: p5y, val: val5y },
                { x: X_10Y, y: p10y, val: val10y }
            ].map((p, i) => {
                const totalBarHeight = p.y.hSav + p.y.hInv;
                const projectedTotal = p.val.sav + p.val.inv;
                let currentStackHeight = 0;

                return (
                    <g key={i}>
                        {/* Vertical Connector Line */}
                        <line x1={p.x} y1={p.y.topY} x2={p.x} y2={p.y.botY} stroke="white" strokeOpacity="0.1" strokeWidth="2" />

                        {/* Value Dots at Boundaries */}
                        <circle cx={p.x} cy={p.y.topY} r="3" fill="#F59E0B" />
                        <circle cx={p.x} cy={p.y.midY} r="3" fill="#FFF" fillOpacity="0.5" />
                        <circle cx={p.x} cy={p.y.botY} r="3" fill="#3B82F6" />

                        {/* Total Label */}
                        <text x={p.x} y={HEIGHT - 20} textAnchor="middle" fill="#FFF" fontSize="16" fontWeight="bold" fontFamily="monospace">
                            €{Math.round(projectedTotal).toLocaleString()}
                        </text>

                        {/* STACKED GOALS */}
                        {showGoals && [...goals]
                            .sort((a, b) => b.targetAmount - a.targetAmount) // Largest first (at bottom)
                            .map((goal, idx) => {
                                // Height relative to the bar's height (Proportionate to amount of net worth)
                                const blockHeight = (goal.targetAmount / projectedTotal) * totalBarHeight;
                                const yPos = p.y.botY - currentStackHeight - blockHeight;
                                currentStackHeight += blockHeight;
                                const color = goal.color || '#9333EA';

                                return (
                                    <g key={goal.id + i + idx} className="animate-in fade-in slide-in-from-bottom-2 duration-700" style={{animationDelay: `${idx * 100}ms`}}>
                                        <rect 
                                            x={p.x - 60} 
                                            y={yPos} 
                                            width={120} 
                                            height={blockHeight} 
                                            fill={color} 
                                            stroke="#FFF" 
                                            strokeOpacity={0.2}
                                            strokeWidth="1" 
                                            rx={2}
                                            fillOpacity={0.9}
                                            className="shadow-sm"
                                        />
                                        {/* Hatching for texture */}
                                        <rect 
                                            x={p.x - 60} 
                                            y={yPos} 
                                            width={120} 
                                            height={blockHeight} 
                                            fill="url(#hatch)" 
                                            rx={2}
                                            fillOpacity={0.1}
                                            pointerEvents="none"
                                        />
                                        
                                        {/* Labels - Only show if block is tall enough */}
                                        {blockHeight > 20 && (
                                            <>
                                                <text 
                                                    x={p.x} 
                                                    y={yPos + blockHeight/2} 
                                                    textAnchor="middle" 
                                                    dominantBaseline="middle" 
                                                    fill="#FFF" 
                                                    fontSize="13" 
                                                    fontWeight="bold"
                                                    style={{textShadow: '0 1px 2px rgba(0,0,0,0.5)'}}
                                                >
                                                    {goal.name}
                                                </text>
                                                {blockHeight > 40 && (
                                                    <text 
                                                        x={p.x} 
                                                        y={yPos + blockHeight/2 + 14} 
                                                        textAnchor="middle" 
                                                        fill="rgba(255,255,255,0.9)" 
                                                        fontSize="10" 
                                                        fontFamily="monospace"
                                                    >
                                                        €{goal.targetAmount.toLocaleString()}
                                                    </text>
                                                )}
                                            </>
                                        )}
                                        
                                        {/* Overflow Indicator */}
                                        {yPos < p.y.topY && idx === goals.length - 1 && (
                                             <text x={p.x} y={yPos - 10} textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="bold">
                                                 SHORTFALL
                                             </text>
                                        )}
                                    </g>
                                );
                            })
                        }
                    </g>
                );
            })}

        </svg>
    </div>
  );
};

export default FutureMode;
