import React, { useState, useMemo, useCallback } from 'react';
import { GameSetup } from './components/GameSetup';
import { GameBoard } from './components/GameBoard';
import { ALL_QUESTIONS } from './constants/questions';
import type { GameMode, Question } from './types';

// Helper to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const App: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleModeSelect = useCallback((mode: GameMode) => {
    const filteredQuestions = ALL_QUESTIONS.filter(q => q.mode === mode);
    setQuestions(shuffleArray(filteredQuestions));
    setGameMode(mode);
  }, []);

  const handleRestart = useCallback(() => {
    setGameMode(null);
    setQuestions([]);
  }, []);

  const content = useMemo(() => {
    if (!gameMode) {
      return <GameSetup onModeSelect={handleModeSelect} />;
    }
    if (questions.length === 0) {
        return (
            <div className="text-center text-white animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">No Questions Found</h2>
                <p className="mb-8 text-slate-300">There are no questions available for the "{gameMode}" mode.</p>
                <button
                    onClick={handleRestart}
                    className="bg-pink-500 text-white font-bold py-2 px-6 rounded-full hover:bg-pink-600 transition-colors"
                >
                    Choose Another Mode
                </button>
            </div>
        );
    }
    return <GameBoard questions={questions} onRestart={handleRestart} />;
  }, [gameMode, questions, handleModeSelect, handleRestart]);
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white flex flex-col items-center justify-center p-4 font-sans relative">
      <div className="absolute top-4 left-4 text-slate-400 text-lg font-bold tracking-wider">Connection Cards</div>
      {content}
    </main>
  );
};

export default App;
