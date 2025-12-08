
import React from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  type: 'income' | 'expense' | 'savings' | 'investment' | null;
  onSelect: (category: string) => void;
  onClose: () => void;
}

const CategoryModal: React.FC<Props> = ({ isOpen, type, onSelect, onClose }) => {
  if (!isOpen || !type) return null;

  const categories = {
    income: ['Salary', 'Side Gig', 'Bonus', 'Other Income'],
    expense: ['Rent', 'Utilities', 'Dining Out', 'Transportation', 'Entertainment', 'Other'],
    savings: ['Savings', 'Emergency Fund', 'Other'],
    investment: ['401k', 'Brokerage', 'Stocks', 'Crypto', 'Real Estate', 'Other']
  };

  const categoryList = categories[type] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[#2A3542] border-2 border-pink-500/30 rounded-2xl p-8 max-w-xl w-full mx-4 shadow-2xl transform transition-all scale-100"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white tracking-widest">SELECT CATEGORY</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {categoryList.map(category => (
            <button
              key={category}
              className="bg-white/10 border-2 border-white/20 rounded-xl p-5 text-white font-semibold text-lg hover:bg-pink-500/20 hover:border-pink-500 hover:scale-[1.02] transition-all duration-200"
              onClick={() => onSelect(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
