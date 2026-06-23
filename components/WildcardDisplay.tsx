import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface WildcardDisplayProps {
  count: number;
  onUse: () => void;
  disabled: boolean;
}

const WildcardDisplay: React.FC<WildcardDisplayProps> = ({ count, onUse, disabled }) => {
  const helperText = count === 0
    ? 'No wildcards left for this player'
    : disabled
      ? 'Reveal the card before swapping it'
      : 'Swap this prompt for your own';

  return (
    <div className="flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
      <button
        type="button"
        onClick={onUse}
        disabled={disabled}
        className={`
          min-h-12 w-full sm:w-auto px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 
          transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black
          ${disabled 
            ? 'bg-slate-700/80 text-slate-500 cursor-not-allowed'
            : 'bg-yellow-500 text-slate-900 hover:bg-yellow-400 transform hover:scale-105 shadow-lg shadow-yellow-500/20'
          }
        `}
        aria-describedby="wildcard-helper"
      >
        <SparklesIcon className="w-5 h-5" />
        <span>{count > 0 ? 'Use wildcard' : 'Wildcards used'}</span>
      </button>
      <div className="text-center text-sm font-medium text-slate-400">
        <span className="font-bold text-white">{count}</span> left
        <p id="wildcard-helper" className="text-xs font-normal text-slate-500">{helperText}</p>
      </div>
    </div>
  );
};

export default WildcardDisplay;
