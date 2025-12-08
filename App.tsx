import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import FinancialOverviewCard from './components/cards/FinancialOverviewCard';
import PortfolioCard from './components/cards/PortfolioCard';
import BudgetCard from './components/cards/BudgetCard';
import { fetchUserData } from './services/clarityService';
import ClaritySurvey from './components/clarity/ClaritySurvey';
import ClarityReport from './components/clarity/ClarityReport';
import FinancialTetris from './components/tetris/FinancialTetris';
import ProjectUnderlord from './components/underlord/ProjectUnderlord';
import PortfolioBuilder from './components/portfolio/PortfolioBuilder';
import { ClaritySurveyData, ClarityScore } from './types';
import { X, Check } from 'lucide-react';

const App: React.FC = () => {
  const [userName, setUserName] = useState<string>('Guest');
  const [userInitial, setUserInitial] = useState<string>('G');
  const [currentView, setCurrentView] = useState<'dashboard' | 'clarity-survey' | 'clarity-report' | 'tetris' | 'project' | 'portfolio'>('dashboard');
  
  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [isMockDataEnabled, setIsMockDataEnabled] = useState(true);

  // Clarity Data State
  const [clarityData, setClarityData] = useState<ClaritySurveyData | null>(null);
  const [clarityScore, setClarityScore] = useState<ClarityScore | null>(null);

  useEffect(() => {
    // Load user name from simulated Clarity survey service
    const loadUser = async () => {
      const data = await fetchUserData();
      setUserName(data.name);
      setUserInitial(data.initial);
    };
    loadUser();

    // Check localStorage for mock data preference
    const storedMockPref = localStorage.getItem('fbanks_mock_enabled');
    if (storedMockPref !== null) {
      setIsMockDataEnabled(storedMockPref === 'true');
    }
  }, []);

  const toggleMockData = (enabled: boolean) => {
    setIsMockDataEnabled(enabled);
    localStorage.setItem('fbanks_mock_enabled', String(enabled));
  };

  const handleClarityComplete = (data: ClaritySurveyData, score: ClarityScore) => {
    setClarityData(data);
    setClarityScore(score);
    // Update dashboard name if changed
    if (data.personal.name) {
        setUserName(data.personal.name);
        setUserInitial(data.personal.name[0].toUpperCase());
    }
    setCurrentView('clarity-report');
  };

  // Full Screen Views (No Sidebar)
  if (currentView === 'clarity-survey') {
    return <ClaritySurvey onComplete={handleClarityComplete} onExit={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-pink-500/30 flex">
      <Sidebar 
        currentView={currentView} 
        onNavigate={(view) => setCurrentView(view as any)} 
        onOpenSettings={() => setShowSettings(true)}
      />
      
      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-w-0">
        
        {currentView === 'dashboard' && (
          <div className="p-8 md:p-10 max-w-[1920px] mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex justify-between items-center mb-8 md:mb-12">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                  Welcome back, {userName}
                </h1>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-pink-500/20 border-2 border-white/10">
                {userInitial}
              </div>
            </header>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[600px] mb-8">
              {/* Card 1: Calendar / Financial Overview */}
              <div className="lg:col-span-1 h-full">
                 <FinancialOverviewCard isMockDataEnabled={isMockDataEnabled} />
              </div>

              {/* Card 2: Portfolio */}
              <div className="lg:col-span-1 h-full">
                <PortfolioCard isMockDataEnabled={isMockDataEnabled} />
              </div>

              {/* Card 3: Budget */}
              <div className="lg:col-span-1 h-full">
                <BudgetCard isMockDataEnabled={isMockDataEnabled} />
              </div>
            </div>
          </div>
        )}

        {currentView === 'clarity-report' && clarityData && clarityScore && (
            <ClarityReport 
                data={clarityData} 
                score={clarityScore} 
                onExit={() => setCurrentView('dashboard')} 
                onRestart={() => setCurrentView('clarity-survey')}
            />
        )}

        {currentView === 'tetris' && (
            <FinancialTetris 
              clarityData={clarityData} 
              onExit={() => setCurrentView('dashboard')} 
            />
        )}

        {currentView === 'project' && (
            <ProjectUnderlord 
              clarityData={clarityData} 
              onExit={() => setCurrentView('dashboard')} 
            />
        )}

        {currentView === 'portfolio' && (
            <PortfolioBuilder 
              onExit={() => setCurrentView('dashboard')} 
              isMockDataEnabled={isMockDataEnabled}
            />
        )}

      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)}>
            <div 
                className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white tracking-tight">App Settings</h2>
                    <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                        <div>
                            <div className="text-sm font-bold text-white mb-1">Demo Mode</div>
                            <div className="text-xs text-slate-400">Populate dashboard with mock data</div>
                        </div>
                        <button 
                            onClick={() => toggleMockData(!isMockDataEnabled)}
                            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isMockDataEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${isMockDataEnabled ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>
                    
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <p className="text-xs text-blue-300 leading-relaxed">
                            <strong className="block mb-1">Note:</strong>
                            Disabling Demo Mode will clear the Overview, Portfolio, and Budget widgets on the home screen, allowing you to enter your own data. Clarity, Tetris, and Underlord always start empty.
                        </p>
                    </div>
                </div>

                <button 
                    onClick={() => setShowSettings(false)}
                    className="w-full mt-6 bg-[#0F172A] hover:bg-black text-white font-bold py-3 rounded-xl border border-white/10 transition-all"
                >
                    Close
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;