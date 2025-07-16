import React from 'react';

interface CardProps {
  isFlipped: boolean;
  onClick: () => void;
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ isFlipped, onClick, frontContent, backContent }) => {
  return (
    <div
      className="w-[300px] h-[420px] md:w-[350px] md:h-[490px] [perspective:1000px] cursor-pointer group"
      onClick={onClick}
    >
      <div
        className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700 ease-in-out ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front of Card */}
        <div className="absolute w-full h-full [backface-visibility:hidden] rounded-2xl shadow-2xl bg-white/95 backdrop-blur-sm text-slate-800 flex items-center justify-center p-6 border-4 border-white/20 transition-all duration-300 group-hover:border-white/50">
          {frontContent}
        </div>
        {/* Back of Card */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl shadow-2xl bg-white text-slate-800 flex items-center justify-center p-8 border-4 border-white/20">
          {backContent}
        </div>
      </div>
    </div>
  );
};
