import React, { useState, useEffect } from 'react';
import { HelpCircle, X, ChevronsUp, ChevronsDown, Briefcase, ExternalLink, Home } from 'lucide-react';
import { ClaritySurveyData, TetrisBlock, TetrisGoal } from '../../types';
import CategoryModal from './CategoryModal';
import GoalModal from './GoalModal';
import SimulationView from './SimulationView';
import PortfolioOverview from '../portfolio/PortfolioOverview';
import { saveBlocks, getBlocks, saveGoals, getGoals } from '../../services/storageService';
import { getHoldings } from '../../services/portfolioService';

interface Props {
  clarityData?: ClaritySurveyData | null;
  onExit: () => void;
}

const FinancialTetris: React.FC<Props> = ({ clarityData, onExit }) => {
  const [blocks, setBlocks] = useState<TetrisBlock[]>([]);
  const [goals, setGoals] = useState<TetrisGoal[]>([]);
  const [inputAmount, setInputAmount] = useState('');
  const [timeframe, setTimeframe] = useState('monthly');
  
  // Simulation State
  const [startingPrincipal, setStartingPrincipal] = useState(0);
  const [initialSavings, setInitialSavings] = useState(0);
  const [initialInvestments, setInitialInvestments] = useState(0);
  const [simulationRate, setSimulationRate] = useState(0);

  // Modals state
  const [selectedBlockType, setSelectedBlockType] = useState<'income' | 'expense' | 'savings' | 'investment' | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [portfolioAutoOpen, setPortfolioAutoOpen] = useState(false);
  const [showExpenseBreakdown, setShowExpenseBreakdown] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadedBlocks = getBlocks();
    const loadedGoals = getGoals();
    
    if (loadedBlocks.length > 0) {
        setBlocks(loadedBlocks);
    } else if (clarityData) {
        // --- POPULATE FROM CLARITY DATA IF STORAGE IS EMPTY ---
        const newBlocks: TetrisBlock[] = [];
        
        // Income
        const income = Number(clarityData.numbers.income);
        if (income > 0) {
            newBlocks.push({ id: 'inc-clarity', type: 'income', category: 'Net Salary', amount: income });
        }
        
        // Expenses
        Object.entries(clarityData.numbers.expenses).forEach(([cat, value], i) => {
            const amount = value as number;
            if (amount > 0) {
                newBlocks.push({ id: `exp-clarity-${i}`, type: 'expense', category: cat, amount: amount });
            }
        });

        // Debts
        const { creditCards, loans, other } = clarityData.numbers.debts;
        if (creditCards > 0) newBlocks.push({ id: 'debt-cc', type: 'expense', category: 'Credit Cards', amount: creditCards });
        if (loans > 0) newBlocks.push({ id: 'debt-loans', type: 'expense', category: 'Loans', amount: loans });
        if (other > 0) newBlocks.push({ id: 'debt-other', type: 'expense', category: 'Other Debt', amount: other });

        // Savings Flow
        if (clarityData.numbers.monthlySavings > 0) {
            newBlocks.push({ id: 'sav-flow-clarity', type: 'savings', category: 'Monthly Savings', amount: clarityData.numbers.monthlySavings });
        }

        // Assets: Cash
        const totalCash = (clarityData.numbers.cash.bank || 0) + (clarityData.numbers.cash.savings || 0);
        if (totalCash > 0) {
            newBlocks.push({ id: 'asset-cash-clarity', type: 'savings', category: 'Cash Balance', amount: totalCash, isAsset: true });
        }

        // Assets: Investments
        if (clarityData.numbers.investments > 0) {
            newBlocks.push({ id: 'asset-inv-clarity', type: 'investment', category: 'Portfolio', amount: clarityData.numbers.investments, isAsset: true });
        }

        if (newBlocks.length > 0) setBlocks(newBlocks);
    }

    if (loadedGoals.length > 0) setGoals(loadedGoals);
    
    // Sync portfolio
    setTimeout(syncPortfolioToBlocks, 100);
  }, [clarityData]);

  // Sync Portfolio Data to Blocks
  const syncPortfolioToBlocks = async () => {
      // Check if user has explicitly saved portfolio data (avoiding default mock data)
      const hasPortfolioData = localStorage.getItem('fbanks_portfolio_holdings_v3');
      if (!hasPortfolioData) return;

      const holdings = await getHoldings();
      const portfolioValue = holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);
      
      setBlocks(prev => {
          // Keep all blocks EXCEPT auto-synced portfolio block
          const others = prev.filter(b => !(b.type === 'investment' && b.category === 'Portfolio' && b.isAsset));
          
          if (portfolioValue > 0) {
              const newPortfolioBlock: TetrisBlock = {
                  id: 'portfolio-synced',
                  type: 'investment',
                  category: 'Portfolio',
                  amount: portfolioValue,
                  isAsset: true
              };
              return [...others, newPortfolioBlock];
          }
          return others;
      });
  };

  // Save on change
  useEffect(() => {
    if (blocks.length > 0) saveBlocks(blocks);
  }, [blocks]);

  useEffect(() => {
    if (goals.length > 0) saveGoals(goals);
  }, [goals]);

  // Update Simulation Defaults based on current blocks
  useEffect(() => {
     // Recalculate simulation defaults whenever blocks change
     const cash = blocks.filter(b => b.isAsset && b.type === 'savings').reduce((s, b) => s + b.amount, 0);
     const inv = blocks.filter(b => b.isAsset && b.type === 'investment').reduce((s, b) => s + b.amount, 0);
     
     // Prioritize Clarity Rate if set, otherwise try to deduce
     let rate = simulationRate;
     if (!rate && clarityData?.numbers.monthlySavings) {
         rate = clarityData.numbers.monthlySavings;
     }

     setInitialSavings(cash);
     setInitialInvestments(inv);
     setStartingPrincipal(cash + inv);
     if (rate > 0) setSimulationRate(rate);
  }, [blocks, clarityData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBlockClick = (type: 'income' | 'expense' | 'savings' | 'investment') => {
    if (type === 'investment') {
        setPortfolioAutoOpen(true);
        setShowPortfolioModal(true);
        return;
    }

    if (!inputAmount || Number(inputAmount) <= 0) {
        alert('Please enter an amount first');
        return;
    }
    setSelectedBlockType(type);
    setShowCategoryModal(true);
  };

  const handleCategorySelect = (category: string) => {
    if (selectedBlockType) {
        setBlocks(prev => [...prev, {
            id: Math.random().toString(),
            type: selectedBlockType,
            category,
            amount: Number(inputAmount),
            percent: 0,
            isAsset: selectedBlockType === 'savings'
        }]);
        setShowCategoryModal(false);
        setInputAmount('');
        showToast(`Added ${category} block`);
    }
  };

  const handleGoalSave = (goal: Partial<TetrisGoal>) => {
    setGoals(prev => [...prev, {
        id: Math.random().toString(),
        name: goal.name || 'Goal',
        targetAmount: goal.targetAmount || 0,
        timeframeMonths: goal.timeframeMonths || 12,
        emoji: '🎯',
        color: '#8B5CF6',
        neededPerMonth: (goal.targetAmount || 0) / (goal.timeframeMonths || 1)
    } as TetrisGoal]);
    showToast('Goal added successfully');
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const handleClosePortfolio = () => {
      setShowPortfolioModal(false);
      setPortfolioAutoOpen(false);
      syncPortfolioToBlocks();
  };

  // --- RENDERING LOGIC ---

  // Scaling Multiplier
  const getMultiplier = () => {
    switch(timeframe) {
        case 'daily': return 1/30;
        case 'yearly': return 12;
        case '5y': return 60;
        case '10y': return 120;
        default: return 1; // monthly
    }
  };
  const m = getMultiplier();

  // Filtered & Scaled Data
  const incomeBlocks = blocks.filter(b => b.type === 'income');
  const expenseBlocks = blocks.filter(b => b.type === 'expense');
  const savingsBlocks = blocks.filter(b => b.type === 'savings');
  const investmentBlocks = blocks.filter(b => b.type === 'investment');

  const totalIncome = incomeBlocks.reduce((s, b) => s + b.amount, 0) * m;
  const totalExpenses = expenseBlocks.reduce((s, b) => s + b.amount, 0) * m;
  const totalSavings = savingsBlocks.reduce((s, b) => s + b.amount, 0) * m;
  const totalInvestments = investmentBlocks.reduce((s, b) => s + b.amount, 0) * m;

  // For Monthly+ views: aggregated values
  const netWorth = blocks.filter(b => b.isAsset).reduce((sum, b) => sum + b.amount, 0);
  const unallocatedFlow = (totalIncome - totalExpenses);

  const ExpenseBreakdownModal = () => (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowExpenseBreakdown(false)}>
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white tracking-widest">TRANSACTION BREAKDOWN</h3>
                  <button onClick={() => setShowExpenseBreakdown(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {expenseBlocks.map(b => (
                      <div key={b.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                          <span className="font-bold text-slate-300">{b.category}</span>
                          <span className="font-mono text-pink-400">€{(b.amount * m).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                      </div>
                  ))}
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center mt-4">
                      <span className="font-bold text-white">TOTAL</span>
                      <span className="font-mono text-xl font-bold text-white">€{totalExpenses.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>
              </div>
          </div>
      </div>
  );
  
  return (
    <div className="min-h-screen bg-[#0F172A] p-4 md:p-6 font-sans text-white overflow-hidden relative">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onExit} className="bg-[#1E293B]/80 border border-white/10 rounded-full px-6 py-2 font-bold hover:bg-white/10 transition-all flex items-center gap-2 shadow-lg text-sm">
            <Home size={16} /> HOME
        </button>
        <button onClick={() => setShowSimulation(true)} className="bg-pink-500/20 border border-pink-500/50 text-pink-400 rounded-full px-6 py-2 font-bold text-sm hidden md:block hover:bg-pink-500/30 transition-all tracking-wider shadow-[0_0_15px_rgba(236,72,153,0.2)]">
            SIMULATION MODE
        </button>
        <div className="flex gap-3">
            <button className="bg-[#1E293B]/80 border border-white/10 rounded-full px-6 py-2 font-bold hover:bg-white/10 transition-all text-sm">SAVE</button>
        </div>
      </div>

      {/* Timeframe */}
      <div className="flex justify-center mb-6">
         <div className="bg-[#1E293B] p-1.5 rounded-xl border border-white/10 flex shadow-xl">
             {['DAILY', 'MONTHLY', 'YEARLY', '5Y', '10Y'].map((tf) => (
                 <button 
                    key={tf}
                    onClick={() => setTimeframe(tf.toLowerCase())}
                    className={`px-5 py-2 rounded-lg text-[10px] font-bold transition-all uppercase tracking-widest ${timeframe === tf.toLowerCase() ? 'bg-pink-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                 >
                    {tf}
                 </button>
             ))}
         </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 max-w-7xl mx-auto h-[550px]">
        {/* PRESENT */}
        <div className="bg-[#1E293B]/40 border border-white/10 rounded-3xl p-6 flex flex-col h-full relative backdrop-blur-md shadow-2xl">
            <h2 className="text-xl font-bold text-center mb-6 tracking-[0.3em] text-white/90 uppercase">Present</h2>
            
            {/* Dashed Border Container */}
            <div className="absolute inset-4 top-16 border-2 border-dashed border-white/10 rounded-2xl pointer-events-none"></div>

            {/* Stacking Context */}
            <div className="flex-1 rounded-2xl p-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar relative z-10">
                
                {timeframe === 'daily' ? (
                    /* DAILY VIEW: Individual Blocks */
                    <>
                        {incomeBlocks.map(b => (
                            <div key={b.id} className="bg-emerald-500 rounded-xl p-3 text-center shadow-lg border border-emerald-400/20 shrink-0 relative overflow-hidden group">
                                <div className="font-mono font-bold text-2xl text-white drop-shadow-sm">€{(b.amount * m).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                                <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-950/80 mt-1">{b.category}</div>
                            </div>
                        ))}

                        <div className="grid grid-cols-2 gap-2 mt-1">
                            {expenseBlocks.map(b => (
                                <div key={b.id} className="bg-pink-500 rounded-xl p-3 text-center shadow-lg border border-pink-400/20 group hover:scale-[1.02] transition-transform">
                                    <div className="font-mono font-bold text-lg text-white">€{(b.amount * m).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                                    <div className="text-[10px] uppercase font-bold tracking-wider text-pink-950/80">{b.category}</div>
                                </div>
                            ))}
                            {savingsBlocks.map(b => (
                                <div key={b.id} className="bg-amber-500 rounded-xl p-3 text-center shadow-lg border border-amber-400/20 group hover:scale-[1.02] transition-transform">
                                    <div className="font-mono font-bold text-lg text-white">€{(b.amount * m).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                                    <div className="text-[10px] uppercase font-bold tracking-wider text-amber-950/80">{b.category}</div>
                                </div>
                            ))}
                            {investmentBlocks.map(b => (
                                <div 
                                    key={b.id} 
                                    onClick={() => setShowPortfolioModal(true)}
                                    className="bg-blue-500 rounded-xl p-3 text-center shadow-lg border border-blue-400/20 cursor-pointer hover:bg-blue-400 hover:scale-[1.02] transition-all ring-offset-2 ring-offset-[#0F172A] hover:ring-2 ring-blue-500 group relative"
                                >
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 rounded p-1">
                                        <ExternalLink size={12} className="text-white" />
                                    </div>
                                    <div className="font-mono font-bold text-lg text-white">€{(b.amount * m).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                                    <div className="text-[10px] uppercase font-bold tracking-wider text-blue-950/80">{b.category}</div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    /* CONSOLIDATED VIEW (Monthly+) */
                    <>
                        {/* Income Container with Nested Expenses */}
                        {totalIncome > 0 ? (
                            <div className="bg-emerald-500 rounded-xl p-0 shadow-xl border border-emerald-400/20 relative overflow-hidden flex flex-col justify-end" style={{ minHeight: '160px' }}>
                                {/* Label for Income */}
                                <div className="absolute top-3 left-0 w-full text-center z-20">
                                    <div className="font-mono font-bold text-2xl text-white drop-shadow-md">€{totalIncome.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                                    <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-950/80 mt-1">Total Income</div>
                                </div>

                                {/* Nested Expense Block */}
                                {totalExpenses > 0 && (
                                    <div 
                                        onClick={() => setShowExpenseBreakdown(true)}
                                        className="bg-pink-500 w-full relative group cursor-pointer hover:bg-pink-400 transition-colors border-t border-white/20"
                                        style={{ 
                                            height: `${Math.min(100, (totalExpenses / totalIncome) * 100)}%` 
                                        }}
                                    >
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                                            <div className="font-mono font-bold text-xl text-white drop-shadow-md">€{totalExpenses.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                                            <div className="text-[10px] uppercase font-bold tracking-wider text-pink-950/80 mt-1">Expenses</div>
                                            <div className="text-[9px] text-white/70 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to view breakdown</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center p-4 text-slate-400 text-sm">Add Income to see breakdown</div>
                        )}

                        {/* Savings & Investments separate below */}
                        <div className="grid grid-cols-2 gap-3 mt-2">
                             {/* Consolidated Savings */}
                             {totalSavings > 0 && (
                                <div className="bg-amber-500 rounded-xl p-4 text-center shadow-lg border border-amber-400/20">
                                    <div className="font-mono font-bold text-xl text-white">€{totalSavings.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                                    <div className="text-[10px] uppercase font-bold tracking-wider text-amber-950/80">Savings</div>
                                </div>
                             )}
                             {/* Consolidated Investments */}
                             {totalInvestments > 0 && (
                                <div 
                                    onClick={() => setShowPortfolioModal(true)}
                                    className="bg-blue-500 rounded-xl p-4 text-center shadow-lg border border-blue-400/20 cursor-pointer hover:bg-blue-400 transition-all"
                                >
                                    <div className="font-mono font-bold text-xl text-white">€{totalInvestments.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                                    <div className="text-[10px] uppercase font-bold tracking-wider text-blue-950/80">Investments</div>
                                </div>
                             )}
                        </div>
                    </>
                )}
                
                {blocks.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                        <div className="w-16 h-16 mb-4 text-4xl">🗄️</div>
                        <p className="text-sm font-bold text-slate-300">Add blocks below to start visualizing your finances.</p>
                    </div>
                )}

                <div className="mt-auto border-t-2 border-dashed border-white/10 pt-4 text-center grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-bold">Unallocated (Flow)</div>
                        <div className={`font-mono font-bold text-xl ${unallocatedFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            €{(unallocatedFlow).toLocaleString(undefined, {maximumFractionDigits: 0})}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-bold">Net Worth (Assets)</div>
                        <div className="font-mono font-bold text-xl text-blue-400">
                            €{netWorth.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* FUTURE */}
        <div className="bg-[#1E293B]/40 border border-white/10 rounded-3xl p-6 flex flex-col h-full relative backdrop-blur-md shadow-2xl">
            <h2 className="text-xl font-bold text-center mb-6 tracking-[0.3em] text-white/90 uppercase">Future</h2>
            <div className="absolute inset-4 top-16 border-2 border-dashed border-white/10 rounded-2xl pointer-events-none"></div>
            
            <div className="flex-1 rounded-2xl p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3 relative z-10">
                {goals.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                        <div className="w-12 h-12 mb-4 text-3xl">🎯</div>
                        <p className="text-sm font-bold text-slate-300">Add a goal to start planning</p>
                    </div>
                ) : (
                    goals.map(goal => (
                        <div key={goal.id} className="rounded-xl p-4 flex items-center justify-between shadow-lg border border-white/10 bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-xl shadow-inner">
                                    {goal.emoji}
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm">{goal.name}</div>
                                    <div className="text-[10px] text-white/70 font-mono uppercase tracking-wide">Target: {goal.timeframeMonths} mo</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono font-bold text-lg text-white">€{goal.targetAmount.toLocaleString()}</div>
                                <div className="text-[10px] bg-black/20 px-2 py-1 rounded text-white/90 mt-1 inline-block font-mono">
                                    €{Math.round(goal.neededPerMonth || 0)}/mo
                                </div>
                            </div>
                            <button onClick={() => deleteGoal(goal.id)} className="ml-2 w-6 h-6 rounded-full bg-black/20 hover:bg-red-500 text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">×</button>
                        </div>
                    ))
                )}
            </div>
             <div className="mt-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                {goals.length} Goals Set • Total: €{goals.reduce((s, g) => s + g.targetAmount, 0).toLocaleString()}
            </div>
        </div>
      </div>

      {/* Block Adder */}
      <div className="max-w-4xl mx-auto bg-[#1E293B] rounded-3xl p-6 border border-white/10 shadow-2xl relative z-20">
        <div className="mb-2 text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase ml-2">Amount Entry</div>
        <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-mono text-slate-600">€</span>
            <input 
                type="number" 
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-[#0F172A] border border-white/10 rounded-xl py-4 pl-10 pr-12 text-3xl font-mono text-white placeholder-slate-700 outline-none focus:border-blue-500 transition-colors"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 pr-2">
                <div className="bg-white/5 p-1 rounded hover:bg-white/10 cursor-pointer"><ChevronsUp size={14} className="text-slate-400" /></div>
                <div className="bg-white/5 p-1 rounded hover:bg-white/10 cursor-pointer"><ChevronsDown size={14} className="text-slate-400" /></div>
            </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
            <button onClick={() => handleBlockClick('income')} className="h-12 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs uppercase shadow-lg transition-all tracking-wider">Income</button>
            <button onClick={() => handleBlockClick('expense')} className="h-12 rounded-lg bg-pink-500 hover:bg-pink-400 text-pink-950 font-bold text-xs uppercase shadow-lg transition-all tracking-wider">Expense</button>
            <button onClick={() => handleBlockClick('savings')} className="h-12 rounded-lg bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs uppercase shadow-lg transition-all tracking-wider">Savings</button>
            <button onClick={() => handleBlockClick('investment')} className="h-12 rounded-lg bg-blue-500 hover:bg-blue-400 text-blue-950 font-bold text-xs uppercase shadow-lg transition-all tracking-wider">Invest</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
             <button onClick={() => setShowGoalModal(true)} className="bg-[#2A3542] hover:bg-[#334155] border border-white/10 py-3 rounded-xl font-bold tracking-wider text-sm transition-all text-slate-200 shadow-md">GOAL</button>
             <button onClick={() => setShowSimulation(true)} className="bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-bold tracking-wider text-sm shadow-lg shadow-pink-500/25 transition-all">SIMULATE</button>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 right-10 bg-emerald-500 text-emerald-950 px-6 py-3 rounded-xl shadow-xl font-bold animate-in slide-in-from-right duration-300 z-50 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-950 rounded-full animate-pulse"></div>
            {toastMessage}
        </div>
      )}

      {/* Modals */}
      <CategoryModal 
         isOpen={showCategoryModal} 
         type={selectedBlockType} 
         onSelect={handleCategorySelect}
         onClose={() => setShowCategoryModal(false)}
      />

      <GoalModal 
         isOpen={showGoalModal} 
         onSave={handleGoalSave}
         onClose={() => setShowGoalModal(false)}
      />
      
      {showExpenseBreakdown && <ExpenseBreakdownModal />}

      {showSimulation && (
        <SimulationView 
            blocks={blocks} 
            goals={goals} 
            initialPrincipal={netWorth} // Pass calculated Assets sum
            initialSavings={initialSavings} // Pass breakdown
            initialInvestments={initialInvestments} // Pass breakdown
            monthlyContribution={simulationRate} // Pass Step 8 Rate
            onClose={() => setShowSimulation(false)} 
        />
      )}

      {/* Portfolio Modal */}
      {showPortfolioModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl w-full max-w-5xl h-auto max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
                <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#1E293B]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-mono tracking-widest text-white">INVESTMENT PORTFOLIO</h2>
                            <p className="text-xs text-slate-400 uppercase tracking-wider">Manage your holdings & track performance</p>
                        </div>
                    </div>
                    <button onClick={handleClosePortfolio} className="text-slate-400 hover:text-white transition-colors bg-white/5 p-2 rounded-lg hover:bg-white/10">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-[#0F172A] custom-scrollbar">
                    <PortfolioOverview initialShowAddForm={portfolioAutoOpen} />
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default FinancialTetris;