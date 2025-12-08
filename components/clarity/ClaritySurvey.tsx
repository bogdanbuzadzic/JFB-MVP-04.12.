

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Home } from 'lucide-react';
import { ClaritySurveyData, ClarityScore } from '../../types';
import { calculateClarityScore } from '../../services/clarityService';

interface Props {
  onComplete: (data: ClaritySurveyData, score: ClarityScore) => void;
  onExit: () => void;
}

const INITIAL_DATA: ClaritySurveyData = {
  personal: { name: '', age: '', scope: '' },
  financialHealth: { billsOnTime: '', feeling: '', goals: [] },
  numbers: {
    income: 0,
    expenses: {
        'Rent': 0, 'Mortgage': 0, 'Utilities': 0,
        'Car / Fuel': 0, 'Public transport': 0, 'Media & Ent.': 0,
        'Insurance & Medical': 0, 'Groceries': 0, 'Child care': 0, 'Other': 0
    },
    hasDebt: null,
    debts: { creditCards: 0, loans: 0, other: 0 },
    monthlySavings: 0,
    cash: { bank: 0, savings: 0 },
    hasPension: null,
    investments: 0,
    insurancePolicies: []
  }
};

const EXPENSE_CATEGORIES = [
    'Rent', 'Mortgage', 'Utilities', 
    'Car / Fuel', 'Public transport', 'Media & Ent.', 
    'Insurance & Medical', 'Groceries', 'Child care', 'Other'
];

const GOALS_LIST = [
    'Get better at budgeting', 'Manage your debt', 
    'Grow your money', 'Save for something special', 
    'Start investing', 'Save for retirement'
];

const INSURANCE_LIST = [
    'Life Insurance', 'Health Insurance', 'Car Insurance', 
    'Home Insurance', 'Pet Insurance', 'Income Protection'
];

const ClaritySurvey: React.FC<Props> = ({ onComplete, onExit }) => {
  // 1: Name, 2: Scope, 3: Bills, 4: Feelings, 5: Goals(4a), 6: Income(5), 7: Exp(6), 8: Debt(7), 9: Save(8), 10: Cash(9), 11: Pension(10), 12: Inv(11), 13: Ins(12)
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ClaritySurveyData>(INITIAL_DATA);

  // Helper to update deeply nested state
  const updateData = (path: string[], value: any) => {
    setData(prev => {
        const newData = JSON.parse(JSON.stringify(prev));
        let current = newData;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
        return newData;
    });
  };

  const handleNext = () => {
    if (step < 13) setStep(step + 1);
    else {
        const score = calculateClarityScore(data);
        onComplete(data, score);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onExit();
  };

  // Helper to get display step number according to the requested logic:
  // Current 5 -> 4a, 6 -> 5, 7 -> 6, 8 -> 7, 9 -> 8, 10 -> 9, 11 -> 10, 12(new) -> 11, 13(new) -> 12
  const getDisplayStep = () => {
      if (step <= 4) return step;
      if (step === 5) return "4a";
      return step - 1;
  };

  // Render Step Content
  const renderStep = () => {
    switch (step) {
        case 1: // Name & Age
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your name is <input 
                        type="text" 
                        value={data.personal.name}
                        onChange={(e) => updateData(['personal', 'name'], e.target.value)}
                        placeholder="First Name"
                        className="bg-white/10 border-b-2 border-white/20 px-2 py-1 outline-none focus:border-pink-500 transition-colors w-48 text-center"
                    />, <br/>and you're <input 
                        type="number"
                        value={data.personal.age}
                        onChange={(e) => updateData(['personal', 'age'], e.target.value)}
                        placeholder="Age"
                        className="bg-white/10 border-b-2 border-white/20 px-2 py-1 outline-none focus:border-pink-500 transition-colors w-24 text-center"
                    /> years old.</h2>
                    <p className="text-slate-400 max-w-lg">Knowing your age helps us to compare you to others in a similar age group. All the information you provide is anonymous and will not be shared.</p>
                </div>
            );
        case 2: // Scope
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Today, you'll be calculating for</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                        {['yourself', 'household'].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => updateData(['personal', 'scope'], opt)}
                                className={`p-8 rounded-xl border-2 text-left text-xl capitalize transition-all ${
                                    data.personal.scope === opt 
                                    ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_20px_rgba(236,72,153,0.2)]' 
                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                                }`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 mr-4 inline-block align-middle ${
                                    data.personal.scope === opt ? 'border-pink-500 bg-pink-500' : 'border-slate-500'
                                }`}></div>
                                {opt === 'yourself' ? 'Yourself' : 'Your household'}
                            </button>
                        ))}
                    </div>
                </div>
            );
        case 3: // Bills
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Do you pay your bills on time?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
                        {['always', 'sometimes', 'rarely'].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => updateData(['financialHealth', 'billsOnTime'], opt)}
                                className={`p-8 rounded-xl border-2 text-left text-xl capitalize transition-all ${
                                    data.financialHealth.billsOnTime === opt 
                                    ? 'border-pink-500 bg-pink-500/10' 
                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                                }`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 mr-4 inline-block align-middle ${
                                    data.financialHealth.billsOnTime === opt ? 'border-pink-500 bg-pink-500' : 'border-slate-500'
                                }`}></div>
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            );
        case 4: // Feelings
             return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How do you feel about your finances?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                        {['ok', 'worried'].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => updateData(['financialHealth', 'feeling'], opt)}
                                className={`p-8 rounded-xl border-2 text-left text-xl capitalize transition-all ${
                                    data.financialHealth.feeling === opt 
                                    ? 'border-pink-500 bg-pink-500/10' 
                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                                }`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 mr-4 inline-block align-middle ${
                                    data.financialHealth.feeling === opt ? 'border-pink-500 bg-pink-500' : 'border-slate-500'
                                }`}></div>
                                {opt === 'ok' ? 'Ok' : 'Worried'}
                            </button>
                        ))}
                    </div>
                </div>
             );
        case 5: // Goals (Step 4a)
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Do you have any financial goals in mind?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                        {GOALS_LIST.map((goal) => {
                            const isSelected = data.financialHealth.goals.includes(goal);
                            return (
                                <button
                                    key={goal}
                                    onClick={() => {
                                        const newGoals = isSelected 
                                            ? data.financialHealth.goals.filter(g => g !== goal)
                                            : [...data.financialHealth.goals, goal];
                                        updateData(['financialHealth', 'goals'], newGoals);
                                    }}
                                    className={`p-6 rounded-xl border-2 text-left text-lg transition-all flex items-center gap-4 ${
                                        isSelected
                                        ? 'border-pink-500 bg-pink-500/10' 
                                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                                    }`}
                                >
                                    <div className={`w-6 h-6 rounded flex items-center justify-center border-2 ${
                                        isSelected ? 'border-pink-500 bg-pink-500' : 'border-slate-500'
                                    }`}>
                                        {isSelected && <Check size={14} className="text-white"/>}
                                    </div>
                                    {goal}
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        case 6: // Income (Step 5)
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What is your monthly income after tax?</h2>
                    <p className="text-slate-400">If you are completing this for a household, please enter your household income.</p>
                    <div className="max-w-xl">
                        <div className="text-6xl font-mono text-slate-500 flex items-center">
                            € <input 
                                type="number"
                                value={data.numbers.income || ''}
                                onChange={(e) => updateData(['numbers', 'income'], parseFloat(e.target.value) || 0)}
                                className="bg-transparent border-b-2 border-slate-700 focus:border-pink-500 outline-none w-full ml-4 text-white placeholder-slate-700"
                                placeholder="0,000"
                            />
                        </div>
                        <p className="text-sm text-slate-500 mt-4">This is the total received each month. It could include your wages, benefit payments, pensions, dividends, and other incomings.</p>
                    </div>
                </div>
            );
        case 7: // Expenses (Step 6)
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Each month you spend €{(Object.values(data.numbers.expenses) as number[]).reduce((a: number, b: number) => a + b, 0)} on essentials</h2>
                    <p className="text-slate-400">This is the monthly costs you have to pay but excludes any loans, credit cards or any other credit finance payments. Fill in at least one category.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {EXPENSE_CATEGORIES.map(cat => (
                            <div key={cat} className="bg-white/5 border border-white/10 p-4 rounded-xl">
                                <label className="block text-sm font-bold mb-2">{cat}</label>
                                <div className="flex bg-slate-800/50 rounded-lg overflow-hidden border border-white/5">
                                    <span className="px-3 py-2 text-slate-500 border-r border-white/5">€</span>
                                    <input 
                                        type="number"
                                        value={data.numbers.expenses[cat] || ''}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value) || 0;
                                            const newExpenses = {...data.numbers.expenses, [cat]: val};
                                            updateData(['numbers', 'expenses'], newExpenses);
                                        }}
                                        className="bg-transparent w-full px-3 py-2 outline-none"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button className="flex-1 py-1 text-[10px] bg-pink-500/20 text-pink-300 rounded uppercase font-bold tracking-wider">Monthly</button>
                                    <button className="flex-1 py-1 text-[10px] bg-white/5 text-slate-500 rounded uppercase font-bold tracking-wider hover:bg-white/10">Weekly</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 8: // Debts (Step 7)
            if (data.numbers.hasDebt === null) {
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Do you have monthly debt repayments?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                            <button onClick={() => updateData(['numbers', 'hasDebt'], true)} className="p-8 rounded-xl border-2 border-white/10 bg-white/5 hover:bg-white/10 text-xl text-left">
                                <div className="w-6 h-6 rounded-full border-2 border-slate-500 mr-4 inline-block align-middle"></div>
                                Yes
                            </button>
                            <button onClick={() => updateData(['numbers', 'hasDebt'], false)} className="p-8 rounded-xl border-2 border-white/10 bg-white/5 hover:bg-white/10 text-xl text-left">
                                <div className="w-6 h-6 rounded-full border-2 border-slate-500 mr-4 inline-block align-middle"></div>
                                No
                            </button>
                        </div>
                    </div>
                );
            }
            if (data.numbers.hasDebt === true) {
                 return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Enter your debt details</h2>
                        <div className="space-y-4 max-w-2xl">
                            {['Credit Cards', 'Personal Loans', 'Other'].map(type => {
                                const key = type === 'Credit Cards' ? 'creditCards' : type === 'Personal Loans' ? 'loans' : 'other';
                                return (
                                    <div key={type} className="bg-white/5 border border-white/10 p-6 rounded-xl">
                                        <h3 className="text-xl font-medium mb-4">{type}</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2 block">Monthly Payment</label>
                                                <div className="flex bg-slate-800/50 rounded-lg overflow-hidden border border-white/5">
                                                    <span className="px-3 py-3 text-slate-500 border-r border-white/5">€</span>
                                                    <input 
                                                        type="number"
                                                        value={data.numbers.debts[key as keyof typeof data.numbers.debts] || ''}
                                                        onChange={(e) => {
                                                            const val = parseFloat(e.target.value) || 0;
                                                            const newDebts = {...data.numbers.debts, [key]: val};
                                                            updateData(['numbers', 'debts'], newDebts);
                                                        }}
                                                        className="bg-transparent w-full px-3 py-3 outline-none"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2 block">Total Balance</label>
                                                <div className="flex bg-slate-800/50 rounded-lg overflow-hidden border border-white/5">
                                                    <span className="px-3 py-3 text-slate-500 border-r border-white/5">€</span>
                                                    <input type="number" className="bg-transparent w-full px-3 py-3 outline-none" placeholder="0" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <p className="text-sm text-slate-400">This includes credit cards, personal loans and any other credit finance agreement (e.g. for a car), excluding your mortgage or any rental charges.</p>
                    </div>
                );
            }
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                     <h2 className="text-3xl md:text-4xl font-bold tracking-tight">No debts? That's great!</h2>
                     <p className="text-slate-400">Click Next to continue.</p>
                </div>
            )
        case 9: // Savings (Step 8)
            const maxSavings = Math.max(0, data.numbers.income - (Object.values(data.numbers.expenses) as number[]).reduce((a: number, b: number) => a + b, 0) - (data.numbers.debts.creditCards + data.numbers.debts.loans + data.numbers.debts.other));
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How much can you save monthly?</h2>
                    <div className="max-w-xl">
                        <div className="text-6xl font-mono text-slate-500 flex items-center">
                            € <input 
                                type="number"
                                value={data.numbers.monthlySavings || ''}
                                onChange={(e) => updateData(['numbers', 'monthlySavings'], parseFloat(e.target.value) || 0)}
                                className="bg-transparent border-b-2 border-slate-700 focus:border-pink-500 outline-none w-full ml-4 text-white placeholder-slate-700"
                                placeholder="0,000"
                            />
                        </div>
                    </div>
                    {/* Logic box based on data */}
                    <div className="bg-[#1E293B] border border-white/10 p-6 rounded-xl max-w-xl mt-8">
                        <p className="text-sm text-slate-400 mb-2">Based on the data you provided us, we have calculated that you can save a maximum of</p>
                        <p className="text-3xl font-bold text-emerald-400 mb-4">€ {maxSavings.toLocaleString()}</p>
                        <p className="text-xs text-slate-300 border-t border-white/10 pt-4 leading-relaxed">
                            This amount will be used as a <strong>contribution rate</strong> that will be used when calculating your future net worth. We will assume that this is what you will contribute to your investment and/or savings account per month.
                        </p>
                    </div>
                </div>
            );
        case 10: // Cash (Step 9)
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">You have available cash of:</h2>
                    <div className="space-y-6 max-w-xl">
                        <div>
                            <label className="block text-slate-400 mb-2">Bank account/s</label>
                            <div className="text-4xl font-mono text-slate-500 flex items-center">
                                € <input 
                                    type="number"
                                    value={data.numbers.cash.bank || ''}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        updateData(['numbers', 'cash'], {...data.numbers.cash, bank: val});
                                    }}
                                    className="bg-transparent border-b-2 border-slate-700 focus:border-pink-500 outline-none w-full ml-4 text-white placeholder-slate-700"
                                    placeholder="0,000"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-400 mb-2">Savings account/s</label>
                            <div className="text-4xl font-mono text-slate-500 flex items-center">
                                € <input 
                                    type="number"
                                    value={data.numbers.cash.savings || ''}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        updateData(['numbers', 'cash'], {...data.numbers.cash, savings: val});
                                    }}
                                    className="bg-transparent border-b-2 border-slate-700 focus:border-pink-500 outline-none w-full ml-4 text-white placeholder-slate-700"
                                    placeholder="0,000"
                                />
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-slate-400 mt-4">These amounts will appear as liquid savings assets (Orange Block) in your financial overview.</p>
                </div>
            );
        case 11: // Pension (Step 10)
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Are you paying into a pension?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                        <button 
                            onClick={() => updateData(['numbers', 'hasPension'], true)}
                            className={`p-8 rounded-xl border-2 text-left text-xl capitalize transition-all ${
                                data.numbers.hasPension === true 
                                ? 'border-pink-500 bg-pink-500/10' 
                                : 'border-white/10 bg-white/5 hover:bg-white/10'
                            }`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 mr-4 inline-block align-middle ${data.numbers.hasPension === true ? 'border-pink-500 bg-pink-500' : 'border-slate-500'}`}></div>
                            Yes
                        </button>
                        <button 
                            onClick={() => updateData(['numbers', 'hasPension'], false)}
                            className={`p-8 rounded-xl border-2 text-left text-xl capitalize transition-all ${
                                data.numbers.hasPension === false 
                                ? 'border-pink-500 bg-pink-500/10' 
                                : 'border-white/10 bg-white/5 hover:bg-white/10'
                            }`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 mr-4 inline-block align-middle ${data.numbers.hasPension === false ? 'border-pink-500 bg-pink-500' : 'border-slate-500'}`}></div>
                            No
                        </button>
                    </div>
                </div>
            );
        case 12: // Investments (Step 11)
             return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 h-[60vh] overflow-y-auto custom-scrollbar">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">How much are your investments worth?</h2>
                        <p className="text-slate-400 mb-6">(Excluding pensions)</p>
                        <div className="text-5xl font-mono text-slate-500 flex items-center max-w-lg mb-4">
                            € <input 
                                type="number"
                                value={data.numbers.investments || ''}
                                onChange={(e) => updateData(['numbers', 'investments'], parseFloat(e.target.value) || 0)}
                                className="bg-transparent border-b-2 border-slate-700 focus:border-pink-500 outline-none w-full ml-4 text-white placeholder-slate-700"
                                placeholder="0,000"
                            />
                        </div>
                        <div className="bg-[#1E293B] border border-white/10 p-4 rounded-xl max-w-lg">
                            <p className="text-xs text-slate-300 leading-relaxed">
                                This represents the <strong>current value</strong> of your investment portfolio. That amount should not be assumed that you will invest Monthly. It will be treated as your starting investment capital which will compound over time.
                            </p>
                        </div>
                    </div>
                </div>
             );
        case 13: // Insurance (Step 12)
             return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 h-[60vh] overflow-y-auto custom-scrollbar">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Insurance Policies</h2>
                        <p className="text-slate-400 mb-4">Select all that apply:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                            {INSURANCE_LIST.map((ins) => {
                                 const isSelected = data.numbers.insurancePolicies.includes(ins);
                                 return (
                                    <button
                                        key={ins}
                                        onClick={() => {
                                            const newP = isSelected 
                                                ? data.numbers.insurancePolicies.filter(i => i !== ins)
                                                : [...data.numbers.insurancePolicies, ins];
                                            updateData(['numbers', 'insurancePolicies'], newP);
                                        }}
                                        className={`p-4 rounded-xl border-2 text-left text-lg transition-all flex items-center gap-4 ${
                                            isSelected
                                            ? 'border-pink-500 bg-pink-500/10' 
                                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded flex items-center justify-center border-2 ${
                                            isSelected ? 'border-pink-500 bg-pink-500' : 'border-slate-500'
                                        }`}>
                                            {isSelected && <Check size={12} className="text-white"/>}
                                        </div>
                                        {ins}
                                    </button>
                                 )
                            })}
                        </div>
                    </div>
                </div>
             );
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col relative overflow-hidden">
      {/* Top Bar with Home Button */}
      <div className="absolute top-0 left-0 w-full p-6 z-50">
        <button onClick={onExit} className="bg-[#1E293B]/80 border border-white/10 rounded-full px-6 py-2 font-bold hover:bg-white/10 transition-all flex items-center gap-2 shadow-lg text-sm">
            <Home size={16} /> HOME
        </button>
      </div>

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col max-w-6xl mx-auto w-full px-6 py-12 md:py-20">
        <div className="flex-1 flex flex-col justify-center">
             {renderStep()}
        </div>

        {/* Navigation Bar */}
        <div className="mt-12 flex justify-between items-end border-t border-white/10 pt-8">
            <div className="flex flex-col gap-2">
                <span className="text-sm font-mono text-slate-500">Step {getDisplayStep()} / 12</span>
                <button onClick={handleBack} className="text-pink-500 hover:text-pink-400 font-bold flex items-center gap-2 transition-colors">
                    <ChevronLeft size={20}/> Go back
                </button>
            </div>

            <button 
                onClick={handleNext} 
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-pink-500/30 transition-all flex items-center gap-2"
                disabled={step === 2 && data.personal.scope === ''}
            >
                {step === 13 ? 'Calculate Score' : 'Next'} <ChevronRight size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ClaritySurvey;