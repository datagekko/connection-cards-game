
import React from 'react';
import { GameMode } from '../types';
import { GAME_MODES } from '../constants';
import { HeartIcon } from './icons/HeartIcon';

interface ModeSelectionScreenProps {
  onModeSelect: (mode: GameMode) => void;
}

const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({ onModeSelect }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-gray-900 to-black">
      <div className="text-center mb-10">
        <HeartIcon className="w-16 h-16 mx-auto text-pink-500 mb-4" />
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Connection Cards
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Choose a mode to begin</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {GAME_MODES.map(({ mode, description }) => {
            if (mode === GameMode.GroupMode) {
              return (
                <button
                  key={mode}
                  onClick={() => onModeSelect(mode)}
                  className="relative w-full text-left p-5 bg-gradient-to-r from-pink-500 to-purple-600 border border-pink-400/50 rounded-xl shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 group"
                >
                  <div className="absolute top-3 right-3 text-xs bg-white/20 text-white font-semibold px-2 py-1 rounded-full">
                    Multiplayer
                  </div>
                  <h2 className="text-xl font-semibold text-white">{mode}</h2>
                  <p className="text-pink-100/90 group-hover:text-white transition-colors">
                    {description}
                  </p>
                </button>
              );
            }
            return (
              <button
                key={mode}
                onClick={() => onModeSelect(mode)}
                className="w-full text-left p-5 bg-white/5 border border-white/10 rounded-xl shadow-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900 group"
              >
                <h2 className="text-xl font-semibold text-white">{mode}</h2>
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                  {description}
                </p>
              </button>
            )
        })}
      </div>
       <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>Built for connection.</p>
        </footer>
    </div>
  );
};

export default ModeSelectionScreen;
