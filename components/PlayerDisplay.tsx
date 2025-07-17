
import React from 'react';
import { Player } from '../types';

interface PlayerDisplayProps {
  players: Player[];
  currentPlayerId: number;
}

const PlayerDisplay: React.FC<PlayerDisplayProps> = ({ players, currentPlayerId }) => {
  return (
    <div className="flex items-center justify-center flex-wrap gap-4 mb-8">
      {players.map((player) => (
        <div
          key={player.id}
          className={`px-6 py-2 rounded-full transition-all duration-300 ${
            player.id === currentPlayerId
              ? 'bg-pink-600 text-white font-bold shadow-lg shadow-pink-500/30'
              : 'bg-gray-700 text-slate-300'
          }`}
        >
          {player.name}
        </div>
      ))}
    </div>
  );
};

export default PlayerDisplay;
