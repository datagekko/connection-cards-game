
import React from 'react';
import { HeartIcon } from './icons/HeartIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface CardProps {
  question: string;
  rotation: number;
  questionFace: 'front' | 'back';
  onFlip: () => void;
  isWildcard: boolean;
  actionLabel: string;
}

const Card: React.FC<CardProps> = ({ question, rotation, questionFace, onFlip, isWildcard, actionLabel }) => {
  const cardContainerClasses = 'block w-full max-w-md h-80 sm:h-96 rounded-3xl card-container cursor-pointer bg-transparent border-0 p-0 text-inherit focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-4 focus:ring-offset-slate-950 transition-transform active:scale-[0.99]';
  
  const commonSideClasses = "shadow-2xl shadow-black/50 border border-white/10";
  const questionBg = isWildcard
    ? "bg-gradient-to-br from-purple-500 to-indigo-600"
    : "bg-gradient-to-br from-slate-700 to-slate-800";
  const coverBg = "bg-gradient-to-br from-gray-700 via-gray-800 to-black";

  const renderCover = () => (
    <>
      <HeartIcon className="w-20 h-20 text-pink-500/50" />
      <span className="mt-4 text-xl font-semibold text-slate-300">Tap to reveal</span>
      <span className="mt-2 text-sm text-slate-500">No rush — start when you&apos;re ready</span>
    </>
  );

  const renderQuestion = () => (
    <>
      {isWildcard && <SparklesIcon className="w-10 h-10 text-yellow-300 absolute top-6 right-6"/>}
      <p className="text-[clamp(1.35rem,4.8vw,1.875rem)] font-semibold text-white leading-snug">
        {question}
      </p>
    </>
  );

  return (
    <button type="button" className={cardContainerClasses} onClick={onFlip} aria-label={actionLabel}>
      <div className="card-inner" style={{ transform: `rotateY(${rotation}deg)` }}>
        <div className={`card-back ${questionFace === 'back' ? questionBg : coverBg} ${commonSideClasses}`}>
          {questionFace === 'back' ? renderQuestion() : renderCover()}
        </div>
        <div className={`card-front ${questionFace === 'front' ? questionBg : coverBg} ${commonSideClasses}`}>
          {questionFace === 'front' ? renderQuestion() : renderCover()}
        </div>
      </div>
    </button>
  );
};

export default Card;
