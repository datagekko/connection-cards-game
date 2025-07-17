
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface WildcardDisplayProps {
  count: number;
  onUse: () => void;
  disabled: boolean;
}

const WildcardDisplay: React.FC<WildcardDisplayProps> = ({ count, onUse, disabled }) => {
  return (
    <div className="flex items-center space-x-4">
        <button
            onClick={onUse}
            disabled={disabled}
            className={`
                px-6 py-3 rounded-full font-semibold flex items-center justify-center space-x-2 
                transition-all duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black
                ${disabled 
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-yellow-500 text-slate-900 hover:bg-yellow-400 transform hover:scale-105 shadow-lg shadow-yellow-500/20'
                }
            `}
        >
            <SparklesIcon className="w-5 h-5" />
            <span>Use Wildcard</span>
        </button>
        <div className="text-slate-400 text-sm font-medium">
            Remaining: <span className="font-bold text-white">{count}</span>
        </div>
    </div>
  );
};

export default WildcardDisplay;
