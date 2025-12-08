import React, { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import { getBlocks, getGoals } from '../../services/storageService';
import { TetrisBlock, TetrisGoal, ClaritySurveyData } from '../../types';
import PresentMode from './PresentMode';
import FutureMode from './FutureMode';

interface Props {
  clarityData?: ClaritySurveyData | null;
  onExit: () => void;
}

const ProjectUnderlord: React.FC<Props> = ({ clarityData, onExit }) => {
  const [mode, setMode] = useState<'present' | 'future'>('present');
  const [blocks, setBlocks] = useState<TetrisBlock[]>([]);
  const [goals, setGoals] = useState<TetrisGoal[]>([]);
  
  // Future mode specific state
  const [scenario, setScenario] = useState<'bull' | 'base' | 'bear'>('base');
  const [monthlyContributionRate, setMonthlyContributionRate] = useState(0);

  useEffect(() => {
    // 1. Try local storage (Tetris data)
    const storedBlocks = getBlocks();
    const storedGoals = getGoals();

    if (storedBlocks.length > 0) {
      setBlocks(storedBlocks);
    } else if (clarityData) {
        // Fallback: Populate from Clarity Data if storage is empty
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

        // Assets
        const totalCash = (clarityData.numbers.cash.bank || 0) + (clarityData.numbers.cash.savings || 0);
        if (totalCash > 0) {
            newBlocks.push({ id: 'asset-cash-clarity', type: 'savings', category: 'Cash Balance', amount: totalCash, isAsset: true });
        }
        if (clarityData.numbers.investments > 0) {
            newBlocks.push({ id: 'asset-inv-clarity', type: 'investment', category: 'Portfolio', amount: clarityData.numbers.investments, isAsset: true });
        }

        setBlocks(newBlocks);
    }
    
    if (storedGoals.length > 0) setGoals(storedGoals);
    
    // If Clarity Data exists, update monthly contribution rate
    if (clarityData && clarityData.numbers.monthlySavings > 0) {
        setMonthlyContributionRate(clarityData.numbers.monthlySavings);
    }
  }, [clarityData]);

  // --- Data Prep for Child Components ---

  // Present Mode: Only Flows (Income vs Expenses)
  const flowBlocks = blocks.filter(b => !b.isAsset);

  // Future Mode: Needs Assets (Principal) + Flow (Contribution)
  const assets = blocks.filter(b => b.isAsset);
  
  // Calculate Starting Principals
  const initialCash = assets
    .filter(b => b.type === 'savings')
    .reduce((sum, b) => sum + b.amount, 0);
    
  const initialPortfolio = assets
    .filter(b => b.type === 'investment')
    .reduce((sum, b) => sum + b.amount, 0);

  // Calculate Monthly Flow
  // Use Step 8 rate if available, otherwise calculate unallocated income
  const income = blocks.filter(b => b.type === 'income').reduce((sum, b) => sum + b.amount, 0);
  const expense = blocks.filter(b => b.type === 'expense').reduce((sum, b) => sum + b.amount, 0);
  const unallocated = Math.max(0, income - expense);
  const monthlyFlow = monthlyContributionRate > 0 ? monthlyContributionRate : unallocated;

  return (
    <div className="min-h-screen bg-[#0A1628] text-white p-4 md:p-8 font-sans selection:bg-emerald-500/30">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
            <div className="flex items-center gap-6">
                <button onClick={onExit} className="bg-[#1E293B]/80 border border-white/10 rounded-full px-6 py-2 font-bold hover:bg-white/10 transition-all flex items-center gap-2 shadow-lg text-sm">
                    <Home size={16} /> HOME
                </button>
            </div>
            
            <div className="flex bg-white/5 p-1.5 rounded-xl backdrop-blur-md border border-white/10 shadow-xl">
                <button 
                    onClick={() => setMode('present')}
                    className={`px-8 py-2.5 rounded-lg font-bold text-sm tracking-wider transition-all duration-300 ${mode === 'present' ? 'bg-[#10B981] text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    PRESENT MODE
                </button>
                <button 
                    onClick={() => setMode('future')}
                    className={`px-8 py-2.5 rounded-lg font-bold text-sm tracking-wider transition-all duration-300 ${mode === 'future' ? 'bg-[#3B82F6] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    FUTURE MODE
                </button>
            </div>
        </div>

        {/* Content Area - Dark Glass Container */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-2 md:p-8 shadow-2xl min-h-[700px] relative overflow-hidden">
            {/* Background Ambient Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10">
                {mode === 'present' ? (
                    <PresentMode data={{ blocks: flowBlocks }} />
                ) : (
                    <FutureMode 
                        monthlyContribution={monthlyFlow}
                        initialCash={initialCash}
                        initialPortfolio={initialPortfolio}
                        goals={goals}
                        scenario={scenario}
                        onScenarioChange={setScenario}
                    />
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectUnderlord;