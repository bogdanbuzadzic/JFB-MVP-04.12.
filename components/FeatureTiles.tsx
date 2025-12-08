
import React from 'react';
import { BarChart, Gamepad2, Briefcase, Clock } from 'lucide-react';

interface Props {
  onNavigate?: (view: string) => void;
}

const FeatureTiles: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {/* Clarity */}
      <button 
        onClick={() => onNavigate?.('clarity-survey')}
        className="bg-[#1E293B]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-[#1E293B]/80 hover:translate-y-[-4px] transition-all duration-300 group"
      >
        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
            <BarChart size={24} />
        </div>
        <span className="font-semibold text-slate-200">Clarity</span>
      </button>

      {/* Tetris */}
      <button 
        onClick={() => onNavigate?.('tetris')}
        className="bg-[#1E293B]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-[#1E293B]/80 hover:translate-y-[-4px] transition-all duration-300 group"
      >
        <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 group-hover:scale-110 transition-all">
            <Gamepad2 size={24} />
        </div>
        <span className="font-semibold text-slate-200">Tetris</span>
      </button>

      {/* Portfolio */}
      <button 
        onClick={() => onNavigate?.('portfolio')}
        className="bg-[#1E293B]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-[#1E293B]/80 hover:translate-y-[-4px] transition-all duration-300 group"
      >
        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
            <Briefcase size={24} />
        </div>
        <span className="font-semibold text-slate-200">Portfolio</span>
      </button>

      {/* Project */}
      <button 
        onClick={() => onNavigate?.('project')}
        className="bg-[#1E293B]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-[#1E293B]/80 hover:translate-y-[-4px] transition-all duration-300 group relative overflow-hidden"
      >
        <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400 group-hover:bg-orange-500/20 group-hover:scale-110 transition-all">
            <Clock size={24} />
        </div>
        <div className="flex flex-col items-center">
            <span className="font-semibold text-slate-200">Project</span>
        </div>
        <div className="absolute top-4 right-4 bg-black/40 text-[10px] px-2 py-0.5 rounded text-slate-400 border border-white/10">Preview</div>
      </button>
    </div>
  );
};

export default FeatureTiles;
