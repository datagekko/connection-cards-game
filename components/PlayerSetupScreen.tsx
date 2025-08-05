
import React, { useState, useMemo } from 'react';
import { Player, SessionConfig, SessionMood, CustomQuestion } from '../types';
import MoodSelector from './MoodSelector';
import CustomQuestionModal from './CustomQuestionModal';

interface PlayerSetupScreenProps {
  initialPlayers: Player[];
  onStartGame: (players: Player[], config: SessionConfig) => void;
  onBack: () => void;
  onAddCustomQuestion?: (question: Omit<CustomQuestion, 'id' | 'createdAt'>) => void;
  customQuestionsCount?: number;
}

const PlayerSetupScreen: React.FC<PlayerSetupScreenProps> = ({ 
  initialPlayers, 
  onStartGame, 
  onBack, 
  onAddCustomQuestion,
  customQuestionsCount = 0
}) => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>({
    mood: SessionMood.Chill,
    intensity: 5
  });
  const [showCustomQuestionModal, setShowCustomQuestionModal] = useState(false);

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

  const handleStart = () => {
    const validPlayers = players.filter(p => p.name.trim().length > 0);
    if (validPlayers.length >= 2) {
      onStartGame(validPlayers, sessionConfig);
    }
  };

  const canStart = useMemo(() => {
    return players.filter(p => p.name.trim().length > 0).length >= 2;
  }, [players]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="w-full max-w-md">
        <header className="relative flex justify-center items-center mb-8">
            <button onClick={onBack} className="absolute left-0 text-slate-400 hover:text-white transition-colors">
                &larr; Back to Modes
            </button>
        </header>

        <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">Who's Playing?</h1>
            <p className="text-slate-400 mb-8">Edit names and add players for your group game.</p>
        </div>
        
        <div className="space-y-4 mb-6">
          {players.map((player, index) => (
            <div key={player.id} className="flex items-center space-x-3 group">
              <input
                type="text"
                value={player.name}
                onChange={(e) => handlePlayerNameChange(player.id, e.target.value)}
                placeholder={`Player ${index + 1}`}
                className="flex-grow bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500 focus:outline-none transition w-full"
              />
              {players.length > 2 && (
                <button 
                  onClick={() => handleRemovePlayer(player.id)} 
                  className="p-2 text-slate-500 hover:text-red-500 transition-colors opacity-50 group-hover:opacity-100"
                  aria-label={`Remove ${player.name}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>
        
        <MoodSelector 
          selectedMood={sessionConfig.mood}
          onMoodChange={(mood) => setSessionConfig(prev => ({...prev, mood}))}
        />
        
        <div className="flex flex-col space-y-4">
          <button 
            onClick={handleAddPlayer} 
            className="w-full text-center p-3 bg-white/5 border border-dashed border-white/20 rounded-lg hover:bg-white/10 transition text-slate-300"
            >
            + Add Player
          </button>
          
          {onAddCustomQuestion && (
            <button 
              onClick={() => setShowCustomQuestionModal(true)}
              className="w-full text-center p-3 bg-purple-600/20 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition text-purple-300"
            >
              + Add Custom Question {customQuestionsCount > 0 && `(${customQuestionsCount} added)`}
            </button>
          )}
          
          <button 
            onClick={handleStart} 
            disabled={!canStart}
            className="w-full text-lg p-4 bg-pink-600 font-semibold rounded-lg shadow-md hover:bg-pink-700 transition disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            Start Game ({players.length} players)
          </button>
        </div>
        
        {showCustomQuestionModal && onAddCustomQuestion && (
          <CustomQuestionModal
            isOpen={showCustomQuestionModal}
            onClose={() => setShowCustomQuestionModal(false)}
            onSubmit={(question) => {
              onAddCustomQuestion(question);
              setShowCustomQuestionModal(false);
            }}
            currentPlayer={players[0]} // Use first player as default author
          />
        )}
      </div>
    </div>
  );
};

export default PlayerSetupScreen;
