import React from 'react';
import { LayoutDashboard, Gamepad2, TrendingUp, Zap, Sparkles, BarChart, Settings } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onOpenSettings }) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#050B14] border-r border-white/5 flex flex-col py-6 z-50">
      {/* Logo */}
      <div className="px-6 mb-10 flex items-center gap-3">
         {/* Using a high-quality 3D piggy bank placeholder that matches the style */}
         <img 
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Piggy%20Bank.png" 
            alt="Johnny F. Banks Logo" 
            className="w-10 h-10 object-contain"
         />
         <span className="text-xl font-bold text-white tracking-tight font-space">Johnny F. Banks</span>
      </div>

      {/* Menu */}
      <div className="flex-1 px-4 space-y-8">
        <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Track</div>
            <div className="space-y-1">
                <button 
                    onClick={() => onNavigate('dashboard')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    <LayoutDashboard size={18} />
                    Home
                </button>
                <button 
                    onClick={() => onNavigate('clarity-survey')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'clarity-survey' || currentView === 'clarity-report' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    <BarChart size={18} />
                    Clarity
                </button>
                <button 
                    onClick={() => onNavigate('tetris')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'tetris' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Gamepad2 size={18} />
                    Tetris
                </button>
                <button 
                    onClick={() => onNavigate('portfolio')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'portfolio' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    <TrendingUp size={18} />
                    Invest
                </button>
                 <button 
                    onClick={() => onNavigate('project')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'project' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Zap size={18} />
                    Underlord
                </button>
            </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="px-4 space-y-3">
        <button 
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
            <Settings size={18} />
            Settings
        </button>
        <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-slate-800 to-slate-800 border border-white/10 p-3 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:border-white/20 transition-all group">
            <Sparkles size={16} className="text-purple-400 group-hover:text-purple-300"/>
            Ask anything
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;