import React from 'react';
import type { GameMode } from '../types';
import { gameModes } from '../types';

interface GameSetupProps {
  onModeSelect: (mode: GameMode) => void;
}

const modeColors: Record<GameMode, string> = {
  'First Date': 'bg-teal-500 hover:bg-teal-600',
  'Second Date': 'bg-sky-500 hover:bg-sky-600',
  'Third Date': 'bg-indigo-500 hover:bg-indigo-600',
  'Love Birds': 'bg-pink-500 hover:bg-pink-600',
  'Friends': 'bg-purple-500 hover:bg-purple-600',
};

const modeEmojis: Record<GameMode, string> = {
    'First Date': '☕️',
    'Second Date': '🤔',
    'Third Date': '🔥',
    'Love Birds': '💖',
    'Friends': '🎉',
};

export const GameSetup: React.FC<GameSetupProps> = ({ onModeSelect }) => {
  return (
    <div className="text-center animate-fade-in p-4">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-pink-500">Connection Cards</h1>
      <p className="text-slate-300 mb-12 text-lg max-w-md mx-auto">Choose a deck to start the conversation and deepen your connection.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {gameModes.map((mode) => (
          <button
            key={mode}
            onClick={() => onModeSelect(mode)}
            className={`w-full text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${modeColors[mode]}`}
          >
            <span className="mr-3 text-2xl">{modeEmojis[mode]}</span>
            <span className="text-xl">{mode}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
