import React, { useState } from 'react';
import { Briefcase, Search, PieChart, RefreshCw, Target, Save, Home } from 'lucide-react';
import PortfolioOverview from './PortfolioOverview';
import StockScreener from './StockScreener';
import PortfolioXRay from './PortfolioXRay';
import RebalancingTool from './RebalancingTool';
import InvestmentGoals from './InvestmentGoals';

interface Props {
  onExit: () => void;
  isMockDataEnabled?: boolean;
}

type Tab = 'overview' | 'screener' | 'xray' | 'rebalance' | 'goals';

const PortfolioBuilder: React.FC<Props> = ({ onExit, isMockDataEnabled = true }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Briefcase },
    { id: 'screener', label: 'Screener', icon: Search },
    { id: 'xray', label: 'X-Ray', icon: PieChart },
    { id: 'rebalance', label: 'Rebalance', icon: RefreshCw },
    { id: 'goals', label: 'Goals', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white font-sans pb-10">
      
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="bg-[#1E293B]/80 border border-white/10 rounded-full px-6 py-2 font-bold hover:bg-white/10 transition-all flex items-center gap-2 shadow-lg text-sm">
            <Home size={16} /> HOME
          </button>
        </div>
        <button className="bg-[#1E293B]/80 border border-white/10 rounded-full px-6 py-2 font-bold hover:bg-white/10 transition-all text-sm flex items-center gap-2">
          <Save size={16} /> SAVE
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-[#1E293B]/60 p-1.5 rounded-xl border border-white/5 backdrop-blur-sm md:inline-flex w-full md:w-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                  isActive 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
          {activeTab === 'overview' && <PortfolioOverview isMockDataEnabled={isMockDataEnabled} />}
          {activeTab === 'screener' && <StockScreener />}
          {activeTab === 'xray' && <PortfolioXRay />}
          {activeTab === 'rebalance' && <RebalancingTool />}
          {activeTab === 'goals' && <InvestmentGoals />}
        </div>

      </div>
    </div>
  );
};

export default PortfolioBuilder;