
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TetrisGoal } from '../../types';

interface Props {
  isOpen: boolean;
  onSave: (goal: Partial<TetrisGoal>) => void;
  onClose: () => void;
}

const GoalModal: React.FC<Props> = ({ isOpen, onSave, onClose }) => {
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [timeframeMonths, setTimeframeMonths] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      name: goalName,
      targetAmount: Number(targetAmount),
      timeframeMonths: Number(timeframeMonths)
    });
    setGoalName('');
    setTargetAmount('');
    setTimeframeMonths('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[#2A3542] border-2 border-pink-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white tracking-widest">SET YOUR GOAL</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Goal Name</label>
            <input 
              type="text"
              placeholder="e.g., Car Down Payment"
              value={goalName}
              onChange={e => setGoalName(e.target.value)}
              className="w-full bg-black/30 border-2 border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Goal Target Amount (€)</label>
            <input 
              type="number"
              placeholder="50000"
              value={targetAmount}
              onChange={e => setTargetAmount(e.target.value)}
              className="w-full bg-black/30 border-2 border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Timeframe (Months)</label>
            <input 
              type="number"
              placeholder="36"
              value={timeframeMonths}
              onChange={e => setTimeframeMonths(e.target.value)}
              className="w-full bg-black/30 border-2 border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          <button 
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl mt-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={!goalName || !targetAmount || !timeframeMonths}
          >
            SAVE GOAL
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalModal;
