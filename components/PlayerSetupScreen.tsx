import React, { useMemo, useState } from 'react';
import { Player } from '../types';

interface PlayerSetupScreenProps {
  initialPlayers: Player[];
  onStartGame: (players: Player[]) => void;
  onBack: () => void;
}

const PlayerSetupScreen: React.FC<PlayerSetupScreenProps> = ({ initialPlayers, onStartGame, onBack }) => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  const handlePlayerNameChange = (id: number, name: string) => {
    setPlayers(currentPlayers => currentPlayers.map(p => p.id === id ? { ...p, name } : p));
  };

  const handleAddPlayer = () => {
    const newPlayer: Player = {
      id: Date.now(),
      name: `Player ${players.length + 1}`
    };
    setPlayers(currentPlayers => [...currentPlayers, newPlayer]);
  };

  const handleRemovePlayer = (id: number) => {
    if (players.length > 2) {
      setPlayers(currentPlayers => currentPlayers.filter(p => p.id !== id));
    }
  };

  const validPlayers = useMemo(() => players.filter(p => p.name.trim().length > 0), [players]);
  const canStart = validPlayers.length >= 2;

  const handleStart = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canStart) {
      onStartGame(validPlayers.map(player => ({ ...player, name: player.name.trim() })));
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-gray-900 via-slate-950 to-black text-white">
      <form onSubmit={handleStart} className="w-full max-w-md">
        <header className="mb-8">
          <button
            type="button"
            onClick={onBack}
            className="mb-8 min-h-10 rounded-full px-3 py-2 text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-950 transition-colors"
          >
            &larr; Back to modes
          </button>

          <div className="text-center">
            <p className="text-pink-200/80 text-sm font-semibold uppercase tracking-[0.25em] mb-2">Group mode</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Who&apos;s playing?</h1>
            <p className="text-slate-300">Add at least two people. The active player will be highlighted each turn.</p>
          </div>
        </header>
        
        <div className="space-y-3 mb-5" aria-label="Player names">
          {players.map((player, index) => (
            <div key={player.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
              <label className="sr-only" htmlFor={`player-${player.id}`}>
                Player {index + 1} name
              </label>
              <input
                id={`player-${player.id}`}
                type="text"
                value={player.name}
                onChange={(e) => handlePlayerNameChange(player.id, e.target.value)}
                placeholder={`Player ${index + 1}`}
                autoComplete="off"
                className="min-h-12 flex-grow bg-transparent px-3 text-base text-white placeholder:text-slate-500 focus:outline-none"
              />
              {players.length > 2 && (
                <button 
                  type="button"
                  onClick={() => handleRemovePlayer(player.id)} 
                  className="min-h-11 min-w-11 rounded-full text-slate-400 hover:bg-red-500/15 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors"
                  aria-label={`Remove ${player.name || `Player ${index + 1}`}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex flex-col space-y-4">
          <button 
            type="button"
            onClick={handleAddPlayer} 
            className="w-full min-h-12 rounded-xl border border-dashed border-white/20 bg-white/5 p-3 text-center font-medium text-slate-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-950 transition"
          >
            + Add another player
          </button>
          
          <button 
            type="submit"
            disabled={!canStart}
            className="w-full min-h-14 rounded-xl bg-pink-600 p-4 text-lg font-semibold shadow-lg shadow-pink-600/20 transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed"
          >
            Start with {validPlayers.length} player{validPlayers.length === 1 ? '' : 's'}
          </button>
          {!canStart && (
            <p className="text-center text-sm text-slate-400" role="status">
              Add names for at least two players to begin.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default PlayerSetupScreen;
