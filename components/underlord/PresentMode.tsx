
import React from 'react';
import { TetrisBlock } from '../../types';

interface Props {
  data: { blocks: TetrisBlock[] };
}

const PresentMode: React.FC<Props> = ({ data }) => {
  // Data Processing
  const incomeBlocks = data.blocks.filter(b => b.type === 'income');
  const totalIncome = incomeBlocks.reduce((sum, b) => sum + b.amount, 0) || 1;

  // Group Flows
  // Important: In Present Mode, we only care about Flows.
  // "Savings" here means the monthly savings flow, NOT the asset balance.
  const savingsFlow = data.blocks.filter(b => b.type === 'savings' && !b.isAsset).reduce((sum, b) => sum + b.amount, 0);
  const investmentFlow = data.blocks.filter(b => b.type === 'investment' && !b.isAsset).reduce((sum, b) => sum + b.amount, 0);
  const expenseBlocks = data.blocks.filter(b => b.type === 'expense');

  // If no explicit savings/investment flows, we might calculate unallocated?
  // For this visual, let's stick to explicit blocks + categories
  const expenseCategories = expenseBlocks.reduce((acc, block) => {
    acc[block.category] = (acc[block.category] || 0) + block.amount;
    return acc;
  }, {} as Record<string, number>);

  let targets = [
    { name: 'Savings', amount: savingsFlow, type: 'savings' },
    { name: 'Investments', amount: investmentFlow, type: 'investment' },
    ...Object.entries(expenseCategories).map(([name, amount]) => ({ name, amount, type: 'expense' }))
  ].filter(t => t.amount > 0);

  targets.sort((a, b) => b.amount - a.amount);

  // If targets sum < totalIncome, add an "Unallocated" flow?
  const totalAllocated = targets.reduce((sum, t) => sum + t.amount, 0);
  if (totalIncome > totalAllocated) {
      targets.push({ name: 'Unallocated', amount: totalIncome - totalAllocated, type: 'unallocated' });
  }

  // --- SVG Layout Constants ---
  const WIDTH = 1200;
  const HEIGHT = 600;
  const PADDING = 60;
  
  const INCOME_X = PADDING;
  const TARGET_X = WIDTH - PADDING - 300; // Leave room for labels
  const BLOCK_WIDTH = 240;
  const TARGET_BAR_WIDTH = 6;
  const GAP = 20;

  // Scale: Max height matches container minus padding
  const MAX_DRAW_HEIGHT = HEIGHT - (PADDING * 2);
  const scale = MAX_DRAW_HEIGHT / totalIncome;

  const incomeHeight = totalIncome * scale;
  const incomeY = (HEIGHT - incomeHeight) / 2;

  let currentTargetY = (HEIGHT - (totalIncome * scale + (targets.length - 1) * GAP)) / 2;
  // If target stack is smaller than income (due to gap logic or scaling), center it
  // Actually simpler: Total height of right side = totalIncome * scale + gaps.
  const rightSideTotalHeight = (totalIncome * scale) + ((targets.length - 1) * GAP);
  currentTargetY = (HEIGHT - rightSideTotalHeight) / 2;

  let currentSourceY = incomeY;

  // Helper for colors
  const getGradient = (type: string, name: string) => {
      if (type === 'savings' || name === 'Savings') return { id: 'grad-save', start: '#4F46E5', end: '#818CF8' };
      if (type === 'investment' || name === 'Investments') return { id: 'grad-inv', start: '#3B82F6', end: '#60A5FA' };
      if (type === 'unallocated') return { id: 'grad-unall', start: '#334155', end: '#94A3B8' };
      // Random consistent-ish hash for others or simple categories
      if (['Rent', 'Mortgage'].includes(name)) return { id: 'grad-home', start: '#C2410C', end: '#FB923C' };
      if (['Groceries', 'Food'].includes(name)) return { id: 'grad-food', start: '#059669', end: '#34D399' };
      return { id: `grad-${name.replace(/\s/g, '')}`, start: '#7C3AED', end: '#A78BFA' };
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg width="100%" height="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="overflow-visible">
        <defs>
            {/* Gradients */}
            <linearGradient id="incomeFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#064E3B" /> {/* Dark Emerald */}
                <stop offset="100%" stopColor="#10B981" /> {/* Emerald */}
            </linearGradient>
            
            {targets.map((t, i) => {
                const c = getGradient(t.type, t.name);
                return (
                    <React.Fragment key={i}>
                        {/* Block Gradient */}
                        <linearGradient id={`${c.id}-block`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor={c.start} stopOpacity="0.8"/>
                            <stop offset="100%" stopColor={c.end} stopOpacity="0.8"/>
                        </linearGradient>
                        {/* Flow Gradient (Horizontal) */}
                        <linearGradient id={`${c.id}-flow`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.4"/> {/* Start green (from income) */}
                            <stop offset="100%" stopColor={c.end} stopOpacity="0.6"/>
                        </linearGradient>
                    </React.Fragment>
                );
            })}
        </defs>

        {/* LEFT: Income Block */}
        <g className="income-group filter drop-shadow-2xl">
            <rect 
                x={INCOME_X} 
                y={incomeY} 
                width={BLOCK_WIDTH} 
                height={incomeHeight} 
                rx={16} 
                fill="url(#incomeFill)"
                className="stroke-white/10 stroke-1"
            />
            {/* Accent Line */}
            <rect x={INCOME_X - 6} y={incomeY + 10} width={6} height={incomeHeight - 20} rx={3} fill="#10B981" />
            
            {/* Text */}
            <text x={INCOME_X + BLOCK_WIDTH/2} y={incomeY + incomeHeight/2 - 15} textAnchor="middle" fill="#FFF" fontSize="20" fontWeight="600" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                Net Income
            </text>
            <text x={INCOME_X + BLOCK_WIDTH/2} y={incomeY + incomeHeight/2 + 25} textAnchor="middle" fill="#FFF" fontSize="36" fontWeight="bold" fontFamily="monospace" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                €{totalIncome.toLocaleString()}
            </text>
        </g>

        {/* Center Divider Line */}
        <line 
            x1={WIDTH/2} y1={PADDING} 
            x2={WIDTH/2} y2={HEIGHT - PADDING} 
            stroke="#10B981" 
            strokeWidth="4" 
            strokeDasharray="8 8"
            className="opacity-20"
        />

        {/* RIGHT: Flows & Categories */}
        {targets.map((t, i) => {
            const h = t.amount * scale;
            const c = getGradient(t.type, t.name);
            
            // Coordinates
            const sourceRight = INCOME_X + BLOCK_WIDTH;
            const targetLeft = TARGET_X;
            
            // Curved Path (Sankey Style)
            // Start at currentSourceY, End at currentTargetY
            // Control points for smooth S-curve
            const pathData = `
                M ${sourceRight} ${currentSourceY}
                C ${sourceRight + 200} ${currentSourceY}, ${targetLeft - 200} ${currentTargetY}, ${targetLeft} ${currentTargetY}
                L ${targetLeft} ${currentTargetY + h}
                C ${targetLeft - 200} ${currentTargetY + h}, ${sourceRight + 200} ${currentSourceY + h}, ${sourceRight} ${currentSourceY + h}
                Z
            `;

            const element = (
                <g key={i} className="group hover:opacity-100 transition-all duration-300">
                    {/* Flow Path */}
                    <path 
                        d={pathData} 
                        fill={`url(#${c.id}-flow)`} 
                        className="opacity-40 group-hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                    />

                    {/* Target Bar (The "Cap") */}
                    <rect 
                        x={TARGET_X} 
                        y={currentTargetY} 
                        width={300} // Visual block width for text background
                        height={h} 
                        rx={8}
                        fill={`url(#${c.id}-block)`}
                        className="opacity-90 shadow-lg"
                    />
                    {/* Right Accent */}
                    <rect x={TARGET_X + 300} y={currentTargetY} width={6} height={h} rx={3} fill={c.end} />

                    {/* Labels */}
                    <text 
                        x={TARGET_X + 280} 
                        y={currentTargetY + h/2 - 2} 
                        textAnchor="end" 
                        fill="#FFF" 
                        fontSize="18" 
                        fontWeight="600"
                        dominantBaseline="middle"
                        style={{textShadow: '0 1px 2px rgba(0,0,0,0.5)'}}
                    >
                        {t.name}
                    </text>
                    <text 
                        x={TARGET_X + 280} 
                        y={currentTargetY + h/2 + 20} 
                        textAnchor="end" 
                        fill="rgba(255,255,255,0.8)" 
                        fontSize="14" 
                        fontFamily="monospace"
                        dominantBaseline="middle"
                    >
                        €{t.amount.toLocaleString()} ({Math.round(t.amount/totalIncome * 100)}%)
                    </text>
                </g>
            );

            // Increment Y positions for next iteration
            currentSourceY += h;
            currentTargetY += h + GAP;

            return element;
        })}

      </svg>
    </div>
  );
};

export default PresentMode;
