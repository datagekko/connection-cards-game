
import React from 'react';
import { HeartIcon } from './icons/HeartIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface CardProps {
  question: string;
  isFlipped: boolean;
  onFlip: () => void;
  isWildcard: boolean;
}

const Card: React.FC<CardProps> = ({ question, isFlipped, onFlip, isWildcard }) => {
  const cardContainerClasses = `w-full max-w-md h-80 sm:h-96 rounded-3xl card-container cursor-pointer ${isFlipped ? 'flipped' : ''}`;
  
  const commonSideClasses = "shadow-2xl shadow-black/50 border border-white/10";
  const frontBg = isWildcard
    ? "bg-gradient-to-br from-purple-500 to-indigo-600"
    : "bg-gradient-to-br from-slate-700 to-slate-800";
  const backBg = "bg-gradient-to-br from-gray-700 via-gray-800 to-black";

  return (
    <div className={cardContainerClasses} onClick={onFlip}>
      <div className="card-inner">
        <div className={`card-back ${backBg} ${commonSideClasses}`}>
            <HeartIcon className="w-20 h-20 text-pink-500/50" />
            <span className="mt-4 text-xl font-semibold text-slate-300">Tap to Reveal</span>
        </div>
        <div className={`card-front ${frontBg} ${commonSideClasses}`}>
            {isWildcard && <SparklesIcon className="w-10 h-10 text-yellow-300 absolute top-6 right-6"/>}
            <p className="text-2xl sm:text-3xl font-semibold text-white leading-snug">
                {question}
            </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
