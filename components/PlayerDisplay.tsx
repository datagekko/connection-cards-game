import React from 'react';
import { Player } from '../types';

interface PlayerDisplayProps {
  players: Player[];
  currentPlayerId: number;
}

const PlayerDisplay: React.FC<PlayerDisplayProps> = ({ players, currentPlayerId }) => {
  const currentPlayer = players.find(player => player.id === currentPlayerId);

  return (
    <section className="mb-5 w-full max-w-2xl text-center" aria-label="Turn order">
      <p className="mb-3 text-sm font-medium text-slate-400">
        {currentPlayer ? `${currentPlayer.name}'s turn` : 'Current turn'}
      </p>
      <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
        {players.map((player) => {
          const isCurrent = player.id === currentPlayerId;

          return (
            <div
              key={player.id}
              className={`px-4 py-2 rounded-full text-sm sm:text-base transition-all duration-300 ${
                isCurrent
                  ? 'bg-pink-600 text-white font-bold shadow-lg shadow-pink-500/30 scale-105'
                  : 'bg-white/10 text-slate-300'
              }`}
              aria-current={isCurrent ? 'true' : undefined}
            >
              {isCurrent && <span className="mr-1" aria-hidden="true">●</span>}
              {player.name}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PlayerDisplay;
